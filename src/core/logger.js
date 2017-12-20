const webhook = require("webhook-discord");
const auth = require("./auth");
const hook = new webhook(auth.loggerWebhook);
const spacer = "​                                                          ​";

// ------------
// Command log
// ------------

const logCmd = function(data)
{
   var srv = "";
   var chN = "dm";
   var perm = "user";

   if (data.message.channel.type === "text")
   {
      srv = `  in  \`${data.message.channel.guild.name}\``;
      chN = `#${data.message.channel.name}`;

      if (data.message.author.id === data.message.channel.guild.owner.id)
      {
         perm = "server owner";
      }
   }

   if (data.message.isManager)
   {
      perm = "manager";
   }
   if (data.message.isAdmin)
   {
      perm = "admin";
   }
   if (data.message.author.id === data.config.owner)
   {
      perm = "bot owner";
   }

   hook.custom(
      "Bot Logger",
      "```py\n" +
      `@${data.message.author.username}#${data.message.author.discriminator}` +
      `\n${data.message.content}` +
      "\n```" +
      `\nvia  \`${chN}\`` + srv + spacer + spacer,
      `Cmd by ${perm}`,
      "#659fbe"
   );
};

// ----------
// Error log
// ----------

const logError = function(err)
{
   hook.custom(
      "Bot Logger",
      "```prolog\n" + err + "\n```" + spacer + spacer,
      `Error log`,
      "#ff4747"
   );
};

// ------------
// Warning log
// ------------

const logWarn = function(info)
{
   hook.custom(
      "Bot Logger",
      "```prolog\n" + info + "\n```",
      `Discord Warning`,
      "#fff497"
   );
};

// ---------------
// Guild Join Log
// ---------------

const logJoin = function(guild)
{
   hook.custom(
      "Bot Logger",
      `:white_check_mark:  **${guild.name}**\n` +
      "```md\n> " + guild.id + "\n@" + guild.owner.user.username + "#" +
      guild.owner.user.discriminator + "\n```" + spacer + spacer,
      "Joined Guild",
      "#65be8d"
   );
};

// ----------------
// Guild Leave Log
// ----------------

const logLeave = function(guild)
{
   hook.custom(
      "Bot Logger",
      `:regional_indicator_x:  **${guild.name}**\n` +
      "```md\n> " + guild.id + "\n@" + guild.owner.user.username + "#" +
      guild.owner.user.discriminator + "\n```" + spacer + spacer,
      "Left Guild",
      "#be7865"
   );
};

// ----------------
// Channel Deleted
// ----------------

const channelDelete = function(channel)
{
   hook.custom(
      "Bot Logger",
      `__#${channel.name}__ in __${channel.guild.name}__ has been deleted ` +
      "along with any auto tasks.",
      "Channel Delete Event",
      "#be7865"
   );
};

// --------------
// Custom Logger
// --------------

const logCustom = function(data)
{
   hook.custom("Bot Logger", data.msg, data.title, data.color);
};

// ====================
// Analyze log request
// ====================

module.exports = function(type, data)
{
   // ------------------------------------------------
   // Stop proccessing if hook URL is invalid/not set
   // ------------------------------------------------

   if (!hook || !hook.url || hook.url === "" || hook.url === " ")
   {
      return;
   }

   // ---------------
   // Logging Events
   // ---------------

   const logEvents = {
      "cmd": logCmd,
      "error": logError,
      "warning": logWarn,
      "guildJoin": logJoin,
      "guildLeave": logLeave,
      "channelDel": channelDelete,
      "custom": logCustom
   };

   if (logEvents.hasOwnProperty(type))
   {
      return logEvents[type](data);
   }
};
