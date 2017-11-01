const setStatus = require("../core/status");
const botSend = require("../core/send");
const translate = require("../core/translate");

// -----------------------------
// translate string to language
// -----------------------------

module.exports = function(data)
{
   //
   // Send error for empty content
   //

   if (!data.cmd.content)
   {
      setStatus(data.bot, "startTyping", data.message.channel);

      return botSend({
         message: {
            channel: data.message.channel
         },
         color: "error",
         text: "Error: Missing content for translation",
         bot: data.bot
      });
   }

   setStatus(data.bot, "startTyping", data.message.channel);

   //
   // Set default language if none specified
   //

   var translateTo = {
      valid: [data.config.defaultLanguage]
   };

   if (data.cmd.to)
   {
      translateTo = data.cmd.to;
   }

   //
   // Start translation
   //

   data.translate = {
      original: data.cmd.content,
      to: translateTo,
      from: data.cmd.from,
      multi: true
   };

   translate(data);
};
