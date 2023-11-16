var channelID = ''; // channel ID for building the player and chat
let quality = "720p60";
let live = false; // true if live on Kick.com
let alreadySwitched = false; // false if on twitch player true if on Kick.com player
let kickCheck = 1000; // how often the live check updates for Kick.com (ms)
var kickCount = 10;
var interval;
let channelBtn = document.getElementById('channelSelector'); 
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
document.body.onload = nullCheck;


// Parent url needed for the twitch player embed
let parentURL = "yungsamd17.github.io"; // for the demo page
// let parentURL = "localhost"; // for local developement

// fuction to check if the channel is live on Kick.com through the API every 10s
async function checkStream(channel) {
    try {
        let response = await fetch(`https://kick.com/api/v2/channels/${channel}`);
        // console.log("[INFO] Check started...")
        let data = await response.json();
        if(response.status === 200){
            if(data.livestream.is_live == true){
                return setLive();
            }
        };
        } catch (err ) {
            return setOffline(); 
    }
};

function setLive() {
    live = true;
    // console.log("[INFO] Live on KICK");
};

function setOffline() {
    live = false;
    // console.log("[INFO] Not Live on KICK")
};


function platformCheck() {
    checkStream(channelID);

    if(alreadySwitched) {
        if(!live) {
            switchPlatform();
        }
    } else if(!alreadySwitched) {
        if(live) {
            switchPlatform();
        }
    }
}

function startKickCheck(){
    clearInterval(interval);
    kickCount--;
    platformCheck();
    if(kickCount <= 0){
        kickCheck = 10000
        interval = setInterval(startKickCheck, kickCheck);
    } else {
        interval = setInterval(startKickCheck, kickCheck);
        }
}

startKickCheck();


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkCookie() {

    let channel = getCookie("channel");
    if(channel != null || channel != "null"){
        buildTwitch(channel, quality);
        nullCheck();
    } else {
        let selectedChannel = prompt("Set Channel", "xqc");
        channelID = selectedChannel;
        buildTwitch(selectedChannel, quality);
        setCookie("channel", channel, 365);
        nullCheck();
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = `name; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
function channelSelector() {
    deleteCookie("channel=")
    clearInterval(interval);
    kickCount = 10;
    kickCheck = 1000;
    let channel = prompt("Set Channel", "xqc");
    setCookie("channel", channel, 365);
    startKickCheck();
    checkCookie();
}

function buildTwitch(channel, quality) {
    document.getElementById('twitch-player').src = `https://player.twitch.tv/?channel=${channel}&parent=${parentURL}&player=popout&quality=${quality}`;
    document.getElementById('twitch-chat').src = `https://www.giambaj.it/twitch/jchat/v2/?channel=${channel}&bots=true&hide_commands=true&size=1&font=2`;
    alreadySwitched = false;
    channelID = channel;
    
}

function buildKick(channel) {
    document.getElementById('twitch-player').src = `https://player.kick.com/${channel}?muted=false&autoplay=true&allowfullscreen=true`;
    // document.getElementById('twitch-chat').src = `https://kick-chat.corard.tv/v1/chat?user=${channel}&font-size=Small&stroke=Off&animate=false&badges=true&commands=false&bots=false`;
    document.getElementById('twitch-chat').src = `https://chat-overlay.matinaniss.com/?channel=${channel}&sevenTVCosmeticsEnabled=true&sevenTVEmotesEnabled=true&theme=dark&textShadow=small&textSize=medium&animation=none&showPinEnabled=false&textBackgroundEnabled=true`;
    alreadySwitched = true;
    channelID = channel;
}


function checkQuery() {
    let channelQuery = urlParams.get("channel");
    let quality = urlParams.get("quality");
    channelID = channelQuery;
    if(channelQuery == "" || channelQuery == null){
        let c = getCookie("channel");
        channelQuery = c;
        channelID = c;
    }
    if(quality == "" || quality == "null") {
        quality = "720p60";
    } else if(quality == "best") {
        quality = "chunked";
    }

    buildTwitch(channelID, quality);
}

if( queryString == "" || queryString == null || queryString == "null") {
    checkCookie();
} else if( queryString != "") {
    checkQuery();
}


async function nullCheck(){
    if(channelID == null || channelID == "null" || channelID == ""){
    buildTwitch("xqc", "1080p60", "0.5")
    }
}
