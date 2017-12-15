const setStatus = require("../core/status");
const botSend = require("../core/send");
const db = require("../core/db");

// -------------------------
// Proccess settings params
// -------------------------

module.exports = function(data)
{
   setStatus(data.bot, "startTyping", data.message.channel, data.canWrite);

   //
   // Command allowed by admins only
   //

   if (!data.message.isAdmin)
   {
      data.color = "warn";
      data.text = ":cop:  This command is reserved for server administrators.";
      return botSend(data);
   }

   //
   // Error if settings param is missing
   //

   if (!data.cmd.params)
   {
      data.color = "error";
      data.text =
         ":warning:  Missing `settings` parameter. Use `" +
         `${data.config.translateCmd} help settings\` to learn more.`;

      return botSend(data);
   }

   //
   // Execute setting
   //

   getSettings(data);
};

// ===================
// Available Settings
// ===================

const getSettings = function(data)
{
   // ----------------------------
   // Set default server language
   // ----------------------------

   const setLang = function(data)
   {
      //
      // Error for invalid language
      //

      if (data.cmd.to.valid.length !== 1)
      {
         data.color = "error";
         data.text = ":warning:  Please specify 1 valid language.";
         return botSend(data);
      }

      //
      // Error for same language
      //

      if (data.cmd.to.valid[0].iso === data.cmd.server.lang)
      {
         data.color = "warn";
         data.text =
            ":warning: **`" +
            data.cmd.to.valid[0].name + "`** is already the default " +
            "languange of this server.";

         return botSend(data);
      }

      //
      // Update database
      //

      return db.updateServerLang(
         data.message.channel.guild.id,
         data.cmd.to.valid[0].iso,
         function(err)
         {
            if (err)
            {
               return console.error(err);
            }
            data.color = "ok";
            data.text =
               "Default language for server has been changed to **`" +
               data.cmd.to.valid[0].name + "`**.";

            return botSend(data);
         }
      );
   };

   // ---------------
   // Disconnect bot
   // ---------------

   const disconnect = function(data)
   {
      data.color = "info";
      data.text = data.bot.username + " is now disconnected from the server.";
      botSend(data);

      return setTimeout(function()
      {
         data.message.channel.guild.leave();
      }, 3000);
   };

   // ---------------
   // List Servers
   // ---------------

   const listServers = function(data)
   {
      if (data.message.author.id === data.config.owner)
      {
         data.color = "info";
         data.text = "__**Active Servers**__\n\n";

         const activeGuilds = data.client.guilds.array();

         activeGuilds.forEach(guild =>
         {
            data.text += `**${guild.name}** (${guild.id}):\n`;
            data.text += `@${guild.owner.user.username}#`;
            data.text += `${guild.owner.user.discriminator} / <@`;
            data.text += `${guild.ownerID}>\n\n`;
         });

         botSend(data);
      }
   };

   // --------------------------
   // Execute command if exists
   // --------------------------

   const validSettings = {
      "setlang": setLang,
      "disconnect": disconnect,
      "listservers": listServers
   };

   const settingParam = data.cmd.params.split(" ")[0].toLowerCase();

   if (validSettings.hasOwnProperty(settingParam))
   {
      return validSettings[settingParam](data);
   }

   // ------------------------
   // Error for invalid param
   // ------------------------

   data.color = "error";
   data.text =
      ":warning:  **`" + data.cmd.params +
      "`** is not a valid settings option.";

   return botSend(data);
};
