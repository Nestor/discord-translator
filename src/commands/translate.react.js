const setStatus = require("../core/status");
const langCheck = require("../core/lang.check");
const translate = require("../core/translate");
const logger = require("../core/logger");
const countryLangs = require("../core/country.langs");

// ---------------------------------------------------
// translate a message through discord reaction (flag)
// ---------------------------------------------------

module.exports = function(data)
{
   //
   // Disallow messages by bots
   //

   if (data.message.author.bot || !data.emoji || !data.emoji.name)
   {
      return;
   }

   //
   // Get country by emoji
   //

   const emoji = data.emoji.name;

   if (countryLangs.hasOwnProperty(emoji))
   {
      setStatus(data.bot, "startTyping", data.message.channel, data.canWrite);

      data.translate = {
         original: data.message.content,
         to: langCheck(countryLangs[emoji].langs),
         from: langCheck("auto"),
         multi: true
      };

      //
      // Start translation
      //

      translate(data);
      reactLog(data, emoji);
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
