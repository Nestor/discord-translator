const setStatus = require("../core/status");
const botSend = require("../core/send");
const translate = require("../core/translate");

// -----------------------------
// translate string to language
// -----------------------------

module.exports = function(data)
{
   setStatus(data.bot, "startTyping", data.message.channel);

   //
   // Send error for empty content
   //

   if (!data.cmd.content)
   {
      return botSend.box({
         channel: data.message.channel,
         color: "error",
         text: "Error: Missing content for translation",
         bot: data.bot
      });
   }

   //
   // Translate to default language if none specified
   //

   var translateTo = {
      valid: [data.config.defaultLanguage]
   };

   if (data.cmd.to)
   {
      translateTo = data.cmd.to;
   }

   //
   // translate > send > status
   //

   data.translate = {
      original: data.cmd.content,
      to: translateTo,
      from: data.cmd.from,
      multi: true
   };

   //return data.translate;

   translate(data);
};
