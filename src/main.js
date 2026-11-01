const player = document.getElementById('twitch-player');
const chat = document.getElementById('twitch-chat');
const channelInput = document.getElementById('channel-input');
const currentChannel = document.getElementById('current-channel');
const currentPlatform = document.getElementById('current-platform');
const status = document.getElementById('status');
const params = new URLSearchParams(window.location.search);
const validChannel = channel => /^[a-zA-Z0-9_]{1,25}$/.test(channel || '');
const savedChannel = document.cookie.split('; ').find(cookie => cookie.startsWith('channel='))?.slice(8);
let channel = [params.get('channel'), savedChannel, 'xqc'].find(validChannel);
let quality = params.get('quality') || '720p60';
if (quality === 'best') quality = 'chunked';
let platform = 'twitch';
let generation = 0;

function render() {
    const name = encodeURIComponent(channel);
    if (platform === 'kick') {
        player.src = `https://player.kick.com/${name}?muted=false&autoplay=true&allowfullscreen=true`;
        chat.src = `https://chat-overlay.matinaniss.com/?channel=${name}&sevenTVCosmeticsEnabled=true&sevenTVEmotesEnabled=true&theme=dark&textShadow=small&textSize=medium&animation=none&showPinEnabled=false&textBackgroundEnabled=true`;
    } else {
        player.src = `https://player.twitch.tv/?channel=${name}&parent=${encodeURIComponent(location.hostname)}&player=popout&quality=${encodeURIComponent(quality)}`;
        chat.src = `https://www.giambaj.it/twitch/jchat/v2/?channel=${name}&bots=true&hide_commands=true&size=1&font=2`;
    }
    currentChannel.textContent = channel;
    currentPlatform.textContent = platform === 'kick' ? 'Kick' : 'Twitch';
    channelInput.value = channel;
    status.textContent = `Watching ${channel} on ${currentPlatform.textContent}.`;
}

async function checkStream() {
    const checkedChannel = channel;
    const checkedGeneration = generation;
    try {
        const response = await fetch(`https://kick.com/api/v2/channels/${encodeURIComponent(checkedChannel)}`);
        if (!response.ok) return;
        const data = await response.json();
        if (checkedGeneration !== generation) return;
        const nextPlatform = data.livestream?.is_live ? 'kick' : 'twitch';
        if (nextPlatform !== platform) {
            platform = nextPlatform;
            render();
        }
    } catch (_) {
        // Keep the current stream when the live check is unavailable.
    }
}

document.getElementById('channel-form').addEventListener('submit', event => {
    event.preventDefault();
    const nextChannel = channelInput.value.trim();
    if (!validChannel(nextChannel)) {
        channelInput.setCustomValidity('Use 1–25 letters, numbers, or underscores.');
        channelInput.reportValidity();
        return;
    }
    channel = nextChannel;
    generation++;
    platform = 'twitch';
    document.cookie = `channel=${encodeURIComponent(channel)}; max-age=31536000; path=/; SameSite=Lax`;
    const url = new URL(window.location.href);
    url.searchParams.set('channel', channel);
    history.replaceState(null, '', url);
    render();
    checkStream();
});
channelInput.addEventListener('input', () => channelInput.setCustomValidity(''));
render();
checkStream();
setInterval(checkStream, 10000);
