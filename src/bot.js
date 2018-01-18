// ===============
// Initialize Bot
// ===============
//
// Discord
//

const discord = require("discord.js");
const auth = require("./core/auth");
const client = new discord.Client();
const botVersion = "0.4.0 Beta";
const botCreator = "Aziz Natour (@aziz#5919)";

//
// Core
//

const db = require("./core/db");
const fn = require("./core/helpers");
const logger = require("./core/logger");
const setStatus = require("./core/status");
const cmdArgs = require("./commands/args");
const react = require("./commands/translate.react");

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
   translateCmdShort: "!t",
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

   logger("custom", {
      title: "Client Connection",
      msg: `:wave:  **${bot.username}** is now online - v${botVersion}`,
      color: "#98ffc1"
   });
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

//eslint-disable-next-line complexity
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

      // Add role color

      message.roleColor = fn.getRoleColor(message.member);
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

   // ==================
   // Proccess Commands
   // ==================

   if (
      message.content.startsWith(config.translateCmd) ||
      message.content.startsWith(config.translateCmdShort) ||
      message.isMentioned(bot)
   )
   {
      return cmdArgs(data);
   }

   // ==========================
   // Check for automatic tasks
   // ==========================

   return db.channelTasks(data);
});

// =====================
// Listen for reactions
// =====================
/*
client.on("messageReactionAdd", reaction =>
{
   react({
      client: client,
      config: config,
      bot: bot,
      canWrite: true,
      message: reaction.message,
      emoji: reaction.emoji
   });
});
*/
// ======================
// Listen for raw events
// ======================

client.on("raw", raw =>
{
   //
   // Listen for reactions
   //

   if (raw.t === "MESSAGE_REACTION_ADD")
   {
      react(raw.d, client);
   }
});

// ====================
// Catch client errors
// ====================

client.on("error", err =>
{
   logger("error", err);
});

// ===============================
// Remove channel tasks on delete
// ===============================

client.on("channelDelete", channel =>
{
   db.removeTask(channel.id, "all", function(err)
   {
      if (err)
      {
         return logger("error", err);
      }
      return logger("channelDel", channel);
   });
});

// =================
// Disconnect event
// =================

client.on("disconnect", event =>
{
   return logger("error", event);
});

// ================
// Discord warning
// ================

client.on("warning", info =>
{
   return logger("warn", info);
});

// ============
// Init client
// ============

client.login(auth.token);
