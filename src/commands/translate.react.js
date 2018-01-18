const langCheck = require("../core/lang.check");
const translate = require("../core/translate");
const fn = require("../core/helpers");
const logger = require("../core/logger");
const countryLangs = require("../core/country.langs");

// ---------------------------------------------------
// translate a message through discord reaction (flag)
// ---------------------------------------------------

module.exports = function(data, client)
{
   //
   // Get country by emoji
   //

   const emoji = data.emoji.name;

   if (emoji && countryLangs.hasOwnProperty(emoji))
   {
      //
      // Stop proccessing if country has no langs / null
      //

      if (!countryLangs[emoji].langs)
      {
         return;
      }

      //
      // Get message data
      //

      fn.getMessage(
         client,
         data.message_id,
         data.channel_id,
         data.user_id,
         (message, err) =>
         {
            if (err)
            {
               return logger("error", err);
            }

            // ignore bots

            if (message.author.bot)
            {
               return;
            }

            const flagExists = message.reactions.get(emoji);

            // prevent flag spam

            if (flagExists)
            {
               return;
            }

            // translate data

            data.translate = {
               original: message.content,
               to: langCheck(countryLangs[emoji].langs),
               from: langCheck("auto"),
               multi: true
            };

            // message data

            data.message = message;
            data.message.roleColor = fn.getRoleColor(data.message.member);
            data.canWrite = true;

            //
            // Start translation
            //

            translate(data);
            reactLog(data, emoji);
         }
      );
   }
};

// -------
// Logger
// -------

const reactLog = function(data, emoji)
{
   var via = "via __`";

   if (data.message.channel.type === "dm")
   {
      via += "DM`__ `>` __`@" + data.message.channel.recipient.username;
      via += `#${data.message.channel.recipient.discriminator}\`__`;
   }

   if (data.message.channel.type === "text")
   {
      via += `#${data.message.channel.name}`;
      via += "`__ `>` __`" + data.message.channel.guild.name + "`__";
   }

   const reactLog = {
      title: "Flag Emoji - Reaction Translation",
      color: "#65b4be",
      msg: `Message translated to ${emoji} - ${via}`
   };

   logger("custom", reactLog);
};
