// ===============
// Initialize Bot
// ===============
//
// Discord
//

const discord = require("discord.js");
const auth = require("./core/auth");
const client = new discord.Client();
const botVersion = "0.3.4 Beta";
const botCreator = "Aziz Natour (@aziz#5919)";

//
// Core
//

const db = require("./core/db");
const fn = require("./core/helpers");
const logger = require("./core/logger");
const setStatus = require("./core/status");
const cmdArgs = require("./commands/args");

//
// Default Settings
//

var config = {
   version: botVersion,
   botServer: "https://discord.gg/uekTNPj",
   inviteURL: auth.invite,
   owner: auth.botOwner,
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
      `\x1b[90m Bot Version: ${botVersion} | Bot ID: ${bot.id}  \x1b[39m\n` +
      `\x1b[90m Created by: ${botCreator} | License: MIT        \x1b[39m\n` +
      `\x1b[90m Official dev server: ${config.botServer}        \x1b[39m\n` +
      `\x1b[90m-------------------------------------------------\x1b[39m\n`
   );

   setStatus(bot, "online");
});

// ===================
// Initialize  Guilds
// ===================

client.on("guildCreate", guild =>
{
   logger("guildJoin", guild);
   db.addServer(guild.id, config.defaultLanguage);
});

client.on("guildDelete", guild =>
{
   logger("guildLeave", guild);
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

   if (message.channel.type === "text" && message.member)
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
      message: message,
      canWrite: true
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

// ==========================
// Catch client errors
// ==========================

client.on("error", err =>
{
   logger("error", err);
});

client.login(auth.token);
