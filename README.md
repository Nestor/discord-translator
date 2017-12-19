# Discord Translator Bot (beta)
Translation bot built using `discord.js` and `Google Translate API.`

[![Discord](https://discordapp.com/api/guilds/377112375372808193/embed.png)](https://discord.gg/uekTNPj)
[![invite](https://img.shields.io/badge/invite-Translator%20Bot-7289DA.svg)](https://discordapp.com/oauth2/authorize?client_id=360081866461806595&scope=bot&permissions=248960)
[![Build Status](https://ci.0x09.de/job/aziz.TranslatorBot/badge/icon)](https://ci.0x09.de/job/aziz.TranslatorBot)
[![npmD](https://img.shields.io/npm/dt/discord-translator.svg)](https://www.npmjs.com/package/discord-translator)
[![npmV](https://img.shields.io/npm/v/discord-translator.svg)](https://www.npmjs.com/package/discord-translator)
[![donate](https://img.shields.io/badge/donate-patreon-F96854.svg)](https://www.patreon.com/aziznatour)

## Features
* Translate custom messages
* Translate last message(s) in channel
* Translate to multiple languages at once
* Automatic translation of channels with option to forward translations to users or seperate channels.
* Supports 100+ languages
* Embeds link to google for translation improvement

## Discord Usage
* [Invite bot](https://discordapp.com/oauth2/authorize?client_id=360081866461806595&scope=bot&permissions=248960) to your server
* Write `!translate help` for a list of commands.

### Running Bot
Requires `npm`, `node 8.0+` and a `discord bot token`.

1. Clone repo from git
2. Run `npm install`
3. Update `src/core/auth.js` with your discord bot token
4. Run `gulp` or `npm run build` to build
5. Run `node build/bot` or `npm run start` to start bot
6. Add bot to your server through `OAuth2` (https://discordapp.com/developers/docs/topics/oauth2)

### Development
Use `gulp watch` or `npm run dev` for active development (auto lint, build).

### Future plans
* Translating images through OCR
* Generate link for webpage translation
* Automatic translation of specific users

### Credits & License

* Created by Aziz Natour - [@aziznatour](http://www.twitter.com/aziznatour).<br />
* Released under MIT license.
