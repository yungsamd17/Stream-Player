# Stream Player
Webpage with embedded Twitch & Kick player and chat

[yungsamd17.github.io/Stream-Player](https://yungsamd17.github.io/Stream-Player/)

## Features

- Choose a channel on your first visit and change it from the toolbar. The last channel is remembered.
- Automatically switch to Kick when the same channel is live there, or choose Twitch or Kick manually. Auto switching depends on Kick's API being available to the browser.
- Choose Twitch playback quality, hide or show chat, and reload chat independently.
- Chat overlays support third-party emotes and use a dark background.
- Use `?channel=channelname&quality=720p60` to set a channel and Twitch quality in the URL. Use `quality=best` for the best available Twitch quality.
- The player and chat adapt to desktop and mobile screens.


## Why

Kick's webpage is very heavy, this project aims to minimise cpu usage by embedding the player and making the chat experience better without any 3rd party extension. 

Keep in mind this is a very barebones project but it gets the job done.

## Install

Clone the repo and use a webserver to host it. Keep in mind the twitch player needs HTTPS parent to work except if on 127.0.0.1, use a self signed cert for it.

## Credits

[Giambaj](https://www.giambaj.it/) for the [Twitch chat overlay](https://www.giambaj.it/twitch/jchat/).

[matinaniss](https://www.matinaniss.com/) for the [Kick chat overlay](https://chat-overlay.matinaniss.com/).
