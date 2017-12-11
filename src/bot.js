// ===============
// Initialize Bot
// ===============
//
// Discord
//

const discord = require("discord.js");
const token = require("./core/auth").token;
const client = new discord.Client();
const botVersion = "0.2.0 beta";
const botCreator = "@aziz#5919";

//
// Core
//

const db = require("./core/db");
const fn = require("./core/helpers");
const setStatus = require("./core/status");
const cmdArgs = require("./commands/args");

//
// Default Settings
//

var config = {
   version: botVersion,
   defaultLanguage: "en",
   translateCmd: "!translate",
   maxMulti: 6,
   maxChains: 10,
   maxChainLen: 5,
   maxEmbeds: 5,
   maxTasksPerChannel: 10
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

// ===================
// Initialize  Guilds
// ===================

client.on("guildCreate", guild =>
{
   console.log("joined the `" + guild.name + "` guild.");
   db.addServer(guild.id, config.defaultLanguage);
});

client.on("guildDelete", guild =>
{
   console.log("left the `" + guild.name + "` guild.");
   db.removeServer(guild.id);
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

   if (message.channel.type !== "dm")
   {
      message.isAdmin =
         message.member.permissions.has("ADMINISTRATOR");

      message.isManager =
         fn.checkPerm(message.member, message.channel, "MANAGE_CHANNELS");
   }

   //
   // Data object
   //

   const data = {
      client: client,
      config: config,
      bot: bot,
      message: message
   };

   // ===================
   // Proccess Commands
   // ===================

   if (message.content.startsWith(config.translateCmd))
   {
      return cmdArgs(data);
   }

   // ==========================
   // Check for automatic tasks
   // ==========================

   return db.channelTasks(data);
});

client.login(token);
