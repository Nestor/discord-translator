Translation bot built using `discord.js` and `Google Translate API`.
## Features
* Translate custom messages
* Translate messages by reacting with flag emoji
* Translate last message(s) in channel
* Translate to multiple languages at once
* Automatic translation of channels with option to forward translations to users or seperate channels.
* Supports 100+ languages

## Discord Usage
* Write `!translate help` or `!t help` for a list of commands.

## Deploy to [Heroku](https://www.heroku.com/)
To deploy a free translation bot that you can add to your discord server, follow these easy steps.

#### 1. Fork this repo.
* If you don't yet have a github account, [create one](https://github.com/join)! It's free and easy.
* Use the button in the upper righthand side of this page to fork the repo so that it will be associated with your github account.

#### 2. Create a new [Discord App](https://discordapp.com/developers/applications/me/create)
* Give app a friendly name and click the **Create App** button
  * I like the name **C-3PO**, but feel free to pick something different if you fear George Lucas's wrath. Maybe **C-4PO**
* Take note of the app **CLIENT ID**, you will need it later
* Scroll down to the **Bot** section
* Click the **Create a Bot User** button
* Click the **Yes, do it!** button
* Copy the bot's **TOKEN**, you will need it later

#### 3. Create a [Heroku account](https://id.heroku.com/signup/login) (It's free!)
* Create a new app. It's name must be unique and composed of all lowercase letters and dashes. Something like `yourname-discordbot` is fine
* Under **Deployment Method** select Github. Connect to your github account and search for this repo by name.
* Scroll down to the manual deploy section, and select the **heroku-deployment** branch. Click deploy branch, and wait for the successfully deployed message.
* Go to the **Resources** tab and look for the addons section. Search 'Postgres', and add a 'Hobby Dev - Free' version of Heroku Postgres. This will be automatically attached as your bot's database. 
* Go to the **Settings** tab. Click to reveal Config Variables, then add a new one. The key will be **DISCORD_TOKEN**, and the value will be your discord bot's token that you copied earlier.
* Go to the **Overview** tab and click configure dynos. Turn off the default `web npm start` dyno and turn on the `worker node src/bot.js` dyno. Your bot will now be up and running!

#### 4. Invite your bot to your server and configure it!
* Replace the CLIENTID string in the following url with your own apps client id: https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8
* Vist the resulting url and add your bot to any server where you have admin privileges.
* Once added, your bot should show up more or less instantaneously. Type `!t help` within the discord chat for more details on how to use it. Happy translating!

#### 5. Troubleshooting
* You can set up debugging webhooks using the following steps
    1. Create a new channel on your server to recieve the webhooks, let's say `#webhooks`.
    2. Go to Server Settings -> Webhooks -> Create Webhook. Select the `#webhooks` channel, then copy the webhook's URL. It will look something like `https://discordapp.com/api/webhooks/012345678901234567/VCj9yOOtJF9VCm-BU2F9xrbnoWD5gBZZ-UU1mZHcxi5VLgr3bPb9NanRJM8YD9cpBisL`
    3. In the **Settings** tab of your Heroku app add the following Config Variables (values extracted from your URL):
        * **DISCORD_DEBUG_WEBHOOK_ID** : 012345678901234567
        * **DISCORD_DEBUG_WEBHOOK_TOKEN** : VCj9yOOtJF9VCm-BU2F9xrbnoWD5gBZZ-UU1mZHcxi5VLgr3bPb9NanRJM8YD9cpBisL
    4. Restart your app's `worker node src/bot.js` dyno, and you will begin to recieve debugging messages in your `#webhooks` channel.
* If your bot in unresponsive, the first thing to check is Heroku. Log in and manually restart the `worker node src/bot.js` dyno. 
* For further troubleshooting, it's helpful to install the Heroku command line interface. Once installed you can login from a terminal with `heroku login` and check your apps logs with `heroku logs --tail -a <your-app-name>`
* If you are unable to solve a problem yourself, report it with as much detail as possible in this repo's issue tracker. 

## Commands
* [Translate Custom Text](https://github.com/NotMyself/Louie/wiki/Translate-Custom-Text)
* [Translate by Reaction](https://github.com/NotMyself/Louie/wiki/Translate-with-Emoji-Reaction)
* [Translate Last Message](https://github.com/NotMyself/Louie/wiki/Translate-Last-Message)
* [Translate Channel](https://github.com/NotMyself/Louie/wiki/Translate-Channel-(Automatic))
* [Settings](https://github.com/NotMyself/Louie/wiki/Settings)
* [Statistics](https://github.com/NotMyself/Louie/wiki/Get-Statistics)

## Credits & License

This project was originally released by Aziz under the MIT license. He chose to take the project private/commercial at version 0.4.2 Beta. Bobby Johnson forked the project and renamed it Louie after his dog. AlooAkbar forked Louie and added the necessary modifications for simple and free deployment of the bot using Heroku. Both would like to thank Aziz for his hard work and making these early versions OSS so that others may learn and build on his hard work to share with the community.


- [discord-translator](https://github.com/nvuio/discord-translator) created by [nvu.io](https://nvu.io) / Aziz Natour - [@aziznatour](http://www.twitter.com/aziznatour)
- [Louie](https://github.com/NotMyself/Louie) forked by [NotMyself](https://iamnotmyself.com/) / Bobby Johnson - [@NotMyself](https://twitter.com/NotMyself)

Released under MIT license.
