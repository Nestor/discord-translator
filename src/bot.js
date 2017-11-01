// ===============
// Initialize Bot
// ===============
//
// Discord
//

const discord = require("discord.js");
const token = require("./core/auth").token;
const client = new discord.Client();
const botVersion = "0.1.4 beta";
const botCreator = "@aziz#5919";

//
// Core
//

const fn = require("./core/helpers");
const cache = require("./core/cache");
const setStatus = require("./core/status");
const autoTranslate = require("./core/auto");

//
// Commands
//

const cmdArgs = require("./commands/args");
const cmdHelp = require("./commands/help");
const cmdList = require("./commands/list");
const cmdSettings = require("./commands/settings");
const cmdTranslateLast = require("./commands/translate.last");
const cmdTranslateThis = require("./commands/translate.this");
const cmdTranslateAuto = require("./commands/translate.auto");
const cmdTranslateStop = require("./commands/translate.stop");

//
// Default Settings
//

var config = {
   defaultLanguage: {
      iso: "en",
      name: "English",
      native: "English"
   },
   translateCmd: "!translate",
   maxMulti: 6,
   maxChains: 10,
   maxChainLen: 5,
   maxEmbeds: 5
};

//
// Internal Database
//

var db = {
   messages: {},
   chains: {},
   lastAuthor: {}
};

var auto = {
   channels: {},
   dms: {}
};

// ==================
// Initialize Client
// ==================

var bot;

client.on("ready", () =>
{
   bot = client.user;

   console.log(
      `\x1b[90m-------------------------------------------------\x1b[39m\n` +
      `\x1b[32m Discord Translator is online (@${bot.username}) \x1b[39m\n` +
      `\x1b[90m Bot Version:  ${botVersion} | Bot ID: ${bot.id} \x1b[39m\n` +
      `\x1b[90m Created by:  ${botCreator} | License: ISC       \x1b[39m\n` +
      `\x1b[90m-------------------------------------------------\x1b[39m\n`
   );

   setStatus(bot, "online");
});

// ====================
// Listen for messages
// ====================

client.on("message", message =>
{
   //
   // Ignore messages by bots
   //

   if (message.author.bot)
   {
      return;
   }

   //
   // Embed member permissions in message data
   //

   (function()
   {
      if (!fn.isDM(message.channel))
      {
         message.isAdmin =
            message.member.permissions.has("ADMINISTRATOR");

         message.isManager =
            fn.checkPerm(message.member, message.channel, "MANAGE_CHANNELS");
      }
   })();

   //
   // Initalize internal cache/database for current channel
   //

   cache.init(message.channel, db);

   // ===================
   // Proccess Commands
   // ===================

   if (message.content.startsWith(config.translateCmd))
   {
      //
      // Get arguments object
      //

      const cmd = cmdArgs(
         message.content.replace(config.translateCmd, "").trim()
      );

      //
      // Legal Commands
      //

      const cmdMap =
      {
         "this": cmdTranslateThis,
         "last": cmdTranslateLast,
         "auto": cmdTranslateAuto,
         "stop": cmdTranslateStop,
         "help": cmdHelp,
         "list": cmdList,
         "settings": cmdSettings
      };

      if (cmdMap.hasOwnProperty(cmd.main))
      {
         cmdMap[cmd.main]({
            client: client,
            config: config,
            bot: bot,
            cmd: cmd,
            message: message
         });
      }
      return;
   }

   // ========================
   // Proccess normal message
   // ========================

   // ADD: auto translate check

   autoTranslate(message, db, auto);

   //
   // Update cache/database
   //

   return cache.update(message, db);
});

client.login(token);
