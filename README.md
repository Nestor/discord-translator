# Discord Translator Bot (beta)
Translation bot built using discord.js and Google Translate API. Requires `npm` `node 8.0+` and `discord bot token`.

## Features
* Translate custom messages
* Translate last message(s) in channel
* Translate to multiple languages at once
* Automatic translation of channels with option to forward translations to users or seperate channels.
* Supports 100+ languages
* Embeds link to google for translation improvement

### Running Bot
1. Clone repo
2. Run `npm install`
3. Update `src/core/auth.js` with your discord bot token
3. Run `gulp` to build
4. Run `node build/bot` to start bot

### Development
Use `gulp watch` for active development (auto lint, build).

### Future plans
* Translating images through OCR
* Generate link for webpage translation
* Automatic translation of specific users

#### Credit & License

Created by Aziz Natour - [@aziznatour](http://www.twitter.com/aziznatour)
Released under ISC license.
