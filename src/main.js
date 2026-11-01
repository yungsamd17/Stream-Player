const player = document.getElementById('twitch-player');
const chat = document.getElementById('twitch-chat');
const channelInput = document.getElementById('channel-input');
const currentPlatform = document.getElementById('current-platform');
const status = document.getElementById('status');
const autoStatus = document.getElementById('auto-status');
const platformMode = document.getElementById('platform-mode');
const qualitySelect = document.getElementById('quality');
const chatToggle = document.getElementById('chat-toggle');
const welcome = document.getElementById('welcome');
const welcomeChannel = document.getElementById('welcome-channel');
const params = new URLSearchParams(window.location.search);
const validChannel = value => /^[a-zA-Z0-9_]{1,25}$/.test(value || '');
const savedChannel = document.cookie.split('; ').find(cookie => cookie.startsWith('channel='))?.slice(8);
const readSetting = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
const saveSetting = (key, value) => { try { localStorage.setItem(key, value); } catch (_) { /* The player still works without storage. */ } };
let channel = [params.get('channel'), savedChannel, 'xqc'].find(validChannel);
let quality = params.get('quality') || readSetting('stream-quality') || '720p60';
if (quality === 'best') quality = 'chunked';
if (![...qualitySelect.options].some(option => option.value === quality)) {
    qualitySelect.add(new Option(quality, quality));
}
qualitySelect.value = quality;
platformMode.value = ['auto', 'twitch', 'kick'].includes(readSetting('stream-platform')) ? readSetting('stream-platform') : 'auto';
let platform = platformMode.value === 'kick' ? 'kick' : 'twitch';
let generation = 0;
let requestId = 0;

function renderPlayer() {
    const name = encodeURIComponent(channel);
    player.src = platform === 'kick'
        ? `https://player.kick.com/${name}?muted=true&autoplay=true&allowfullscreen=true`
        : `https://player.twitch.tv/?channel=${name}&parent=${encodeURIComponent(location.hostname)}&player=popout&autoplay=true&muted=true&quality=${encodeURIComponent(quality)}`;
}

function render() {
    const name = encodeURIComponent(channel);
    renderPlayer();
    if (platform === 'kick') {
        chat.src = `https://chat-overlay.matinaniss.com/?channel=${name}&sevenTVCosmeticsEnabled=true&sevenTVEmotesEnabled=true&theme=dark&textShadow=small&textSize=medium&animation=none&showPinEnabled=false&textBackgroundEnabled=true`;
    } else {
        chat.src = `https://www.giambaj.it/twitch/jchat/v2/?channel=${name}&bots=true&hide_commands=true&size=1&font=2`;
    }
    currentPlatform.textContent = platform === 'kick' ? 'Kick' : 'Twitch';
    currentPlatform.dataset.platform = platform;
    channelInput.value = channel;
    status.textContent = `Watching ${channel} on ${currentPlatform.textContent}.`;
}

async function checkStream() {
    if (platformMode.value !== 'auto') return;
    const checkedGeneration = generation;
    const checkedRequest = ++requestId;
    try {
        const response = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(channel)}`);
        if (!response.ok) throw new Error("Live check failed");
        const data = await response.json();
        if (checkedGeneration !== generation || checkedRequest !== requestId || platformMode.value !== 'auto') return;
        autoStatus.hidden = true;
        const nextPlatform = data.livestream?.is_live ? 'kick' : 'twitch';
        if (nextPlatform !== platform) { platform = nextPlatform; render(); }
    } catch (_) {
        if (checkedGeneration !== generation || checkedRequest !== requestId || platformMode.value !== 'auto') return;
        autoStatus.textContent = 'Auto switching is unavailable. Choose a platform in Settings.';
        autoStatus.hidden = false;
    }
}

function setChannel(input) {
    const nextChannel = input.value.trim();
    if (!validChannel(nextChannel)) {
        input.setCustomValidity('Use 1–25 letters, numbers, or underscores.');
        input.reportValidity();
        return false;
    }
    channel = nextChannel;
    generation++;
    platform = platformMode.value === 'kick' ? 'kick' : 'twitch';
    document.cookie = `channel=${encodeURIComponent(channel)}; max-age=31536000; path=/; SameSite=Lax`;
    const url = new URL(window.location.href);
    url.searchParams.set('channel', channel);
    history.replaceState(null, '', url);
    render();
    checkStream();
    return true;
}

document.getElementById('channel-form').addEventListener('submit', event => {
    event.preventDefault();
    setChannel(channelInput);
});
document.getElementById('welcome-form').addEventListener('submit', event => {
    event.preventDefault();
    if (setChannel(welcomeChannel)) { saveSetting('stream-welcomed', 'yes'); welcome.close(); }
});
for (const input of [channelInput, welcomeChannel]) input.addEventListener('input', () => input.setCustomValidity(''));
platformMode.addEventListener('change', () => {
    generation++;
    saveSetting('stream-platform', platformMode.value);
    autoStatus.hidden = true;
    if (platformMode.value !== 'auto' && platform !== platformMode.value) { platform = platformMode.value; render(); }
    if (platformMode.value === 'auto') checkStream();
});
qualitySelect.addEventListener('change', () => {
    quality = qualitySelect.value;
    saveSetting('stream-quality', quality);
    const url = new URL(window.location.href);
    if (url.searchParams.has('quality')) {
        url.searchParams.set('quality', quality);
        history.replaceState(null, '', url);
    }
    if (platform === 'twitch') renderPlayer();
});
const settings = document.getElementById('settings');
document.getElementById('open-settings').addEventListener('click', () => settings.showModal());
document.getElementById('close-settings').addEventListener('click', () => settings.close());
chatToggle.addEventListener('click', () => {
    chat.hidden = !chat.hidden;
    chatToggle.setAttribute('aria-expanded', String(!chat.hidden));
    chatToggle.setAttribute('aria-label', chat.hidden ? 'Show chat' : 'Hide chat');
    chatToggle.title = chat.hidden ? 'Show chat' : 'Hide chat';
});
document.getElementById('reload-chat').addEventListener('click', () => { chat.src = chat.src; });
render();
checkStream();
setInterval(checkStream, 10000);
if (!readSetting('stream-welcomed') && !savedChannel) {
    welcomeChannel.value = channel;
    welcome.showModal();
}
