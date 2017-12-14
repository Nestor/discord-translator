# Discord Translator Bot (beta)
Translation bot built using `discord.js` and `Google Translate API.`

[![Discord](https://discordapp.com/api/guilds/377112375372808193/embed.png)](https://discord.gg/uekTNPj)
[![Build Status](https://ci.0x09.de/job/aziz.TranslatorBot/badge/icon)](https://ci.0x09.de/job/aziz.TranslatorBot)
[![npmD](https://img.shields.io/npm/dt/discord-translator.svg)](https://www.npmjs.com/package/discord-translator)
[![npmV](https://img.shields.io/npm/v/discord-translator.svg)](https://www.npmjs.com/package/discord-translator)

## Features
* Translate custom messages
* Translate last message(s) in channel
* Translate to multiple languages at once
* Automatic translation of channels with option to forward translations to users or seperate channels.
* Supports 100+ languages
* Embeds link to google for translation improvement

### Running Bot
Requires `npm`, `node 8.0+` and a `discord bot token`.

1. Clone repo from git or get npm package `npm install discord-translator`
2. Run `npm install`
3. Update `src/core/auth.js` with your discord bot token
4. Run `gulp` or `npm build` to build 
5. Run `node build/bot` or `npm run` to start bot
6. Add bot to your server through `OAuth2` (https://discordapp.com/developers/docs/topics/oauth2)

### Development
Use `gulp watch` or `npm dev` for active development (auto lint, build).

### Future plans
* Translating images through OCR
* Generate link for webpage translation
* Automatic translation of specific users

#### Credits & License

Created by Aziz Natour - [@aziznatour](http://www.twitter.com/aziznatour)

Released under MIT license.
