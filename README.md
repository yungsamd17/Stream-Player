# Stream Player
Webpage with embedded Twitch & Kick player and chat

[yungsamd17.github.io/Stream-Player](https://yungsamd17.github.io/Stream-Player/)

## Features

- Channel change button top left.
- Automatically switch stream if Kick stream either goes live or offline. (checks the same username that is entered in the prompt.)
- 3rd party chat supports 7TV,BTTV,FFZ emotes.
- Remember selected channel on page load.
- Enter /?channel={channel}&quality={720p60} to change channel and quality. Not both of the prompts are required. Quality change only works with the Twitch player Kick didn't implement this feature yet in their player.
- Early Portrait mode for mobile devices (CSS help welcome). 
- Load [xQc](https://twitch.tv/xqc) stream if no stream is selected.


## Why

Kick's webpage is very heavy, this project aims to minimise cpu usage by embedding the player and making the chat experience better without any 3rd party extension. 

Keep in mind this is a very barebones project but it gets the job done.

## Install

Clone the repo and use a webserver to host it. Keep in mind the twitch player needs HTTPS parent to work except if on 127.0.0.1, use a self signed cert for it.

## Credits

[Giambaj](https://www.giambaj.it/) for the [Twitch chat overlay](https://www.giambaj.it/twitch/jchat/).

[matinaniss](https://www.matinaniss.com/) for the [Kick chat overlay](https://chat-overlay.matinaniss.com/).
