const setStatus = require("../core/status");
const botSend = require("../core/send");
const translate = require("../core/translate");

module.exports = function(data)
{
   //
   // Set default language if none specified
   //

   var translateTo = {
      valid: [data.config.defaultLanguage]
   };

   (function()
   {
      if (data.cmd.to)
      {
         translateTo = data.cmd.to;
      }
   })();

   //
   // Prepare translation data
   //

   data.translate = {
      to: translateTo,
      from: data.cmd.from
   };

   //
   // Get count param
   //

   var count = "-1";

   (function()
   {
      if (data.cmd.num)
      {
         count = data.cmd.num;
      }
   })();

   //
   // Set mode
   //

   var mode = "all";

   if (count.startsWith("-") || count === "1")
   {
      mode = "single";
      data.translate.multi = true;
   }

   if (mode === "all" && Math.abs(count) > data.config.maxChains)
   {
      botSend({
         message: {
            channel: data.message.channel
         },
         color: "warn",
         bot: data.bot,
         text:
            `Cannot translate more than ${data.config.maxChains}
            message chains at once.`
      });

      count = data.config.maxChains;
   }

   //
   // Start typing
   //

   setStatus(data.bot, "startTyping", data.message.channel);

   //
   // Get requested collection
   //

   data.message.channel.fetchMessages({
      limit: Math.abs(count) * data.config.maxChainLen + 1
   }).then(messages => //eslint-disable-line complexity
   {
      const messagesArray = messages.array().reverse();
      var lastAuthor;
      var chains = [];

      for (var i = 0; i < messagesArray.length; i++)
      {
         if (
            !messagesArray[i].author.bot &&
            !messagesArray[i].content.startsWith(data.config.translateCmd)
         )
         {
            if (
               lastAuthor === messagesArray[i].author.id &&
               chains[chains.length - 1].msgs.length < data.config.maxChainLen
            )
            {
               chains[chains.length - 1].msgs.push(messagesArray[i].content);
            }

            else
            {
               chains.push({
                  author: messagesArray[i].author,
                  msgs: [messagesArray[i].content],
                  time: messagesArray[i].createdTimestamp
               });
               lastAuthor = messagesArray[i].author.id;
            }
         }
      }

      //
      // Get requested chains only
      //

      const reqChains = chains.slice(-Math.abs(count));

      //
      // Translate single chain
      //

      if (mode === "single")
      {
         data.message.author = reqChains[0].author;
         data.translate.original = reqChains[0].msgs.join("\n");
         return translate(data);
      }

      //
      // Translate multiple chains (buffer)
      //

      data.bufferChains = reqChains;
      return translate(data);
   }).catch(console.error);
};
