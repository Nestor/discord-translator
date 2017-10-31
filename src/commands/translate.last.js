const setStatus = require("../core/status");
const botSend = require("../core/send");
const translate = require("../core/translate");

//
// Get previous message(s) in channel
//

//var maxMsgs = 5;
//var maxCounter = 0;

//function getPrevMsg(message, channel, callback)
//{
//   channel.fetchMessages({
//      limit: 1,
//      before: message
//   }).then(messages =>
//   {
//      const prevMsg = messages.array()[0];
//      if (!prevMsg.author.bot && maxCounter < maxMsgs)
//      {
//         maxCounter++;
//         console.log(`i: ${maxCounter}`);
//         callback(prevMsg.content);
//         return getPrevMsg(prevMsg.id, prevMsg.channel, callback);
//      }
//   }).catch(console.error);
//}



function getChain(message, channel, callback)
{
   //const chainAuthor = message.author.username;

   channel.fetchMessages({
      limit: 3,
      around: message
   }).then(messages =>
   {
      //console.log(chainAuthor);
      console.log(messages.size);
      console.log(messages);

      //const chain = messages.findAll("username", chainAuthor);
      //callback(chain);
   });
}

module.exports = function(data)
{
   //setStatus(data.bot, "startTyping", data.message.channel);
   //console.log("---");
   //console.log("translating last message(s)");
   //console.log("---");

   const lastMsg = data.message.channel.lastMessageID;

   //getChain(lastMsg, data.message.channel, console.log);

   //console.log(lastMsg);

   //getPrevMsg(lastMsg, data.message.channel, console.log);

   //data.message.channel.fetchMessage(lastMsg).then(m =>
   //{
   //   console.log(`id: ${m.id}`);
   //   console.log(`content: ${m.content}`);
   //
   //   m.channel.fetchMessages({
   //      limit: 1,
   //      before: m.id
   //   }).then(messages =>
   //   {
   //      //console.log(messages.size);
   //      //console.log(messages.array());
   //
   //      const prevMsg = messages.array()[0];
   //      //console.log(prevMsg);
   //
   //      console.log(`before id: ${prevMsg.id}`);
   //      console.log(`before content: ${prevMsg.content}`);
   //   }).catch(console.error);
   //}).catch(console.error);

   //console.log();

   //data.message.channel.fetchMessages({
   //   limit: 3
   //}).then(messages =>
   //{
   //   console.log(`Received ${messages.size} messages`);
   //   console.log(messages.array);
   //
   //}).catch(console.error);

   //  const test = data.message.channel.fetchMessages({
   //     limit: 3
   //  });
   //  console.log(test);

/*
   // ---------------
   // Translate last
   // ---------------

   if (translateArgs.startsWith("last"))
   {
      //
      // Get number of chains of current channel from chain cache
      //

      var chainCount = dbChains[channel.id].length;

      //
      // There are no mesasges: send error
      //

      if (chainCount < 1)
      {
         sendBox({
            channel: channel.id,
            color: colorWarn,
            text: text.errNoMsgs
         });
         return;
      }

      //
      // Set default command arguments
      //

      var args = translateArgs.replace("last", "").trim();
      toLang = defaultLanguage;
      var multi = false;
      var single = true;
      var position = "-1";
      var output = "";

      //
      // Get language args through regex
      //

      toLang = (/to\s*\[?([a-z,\s]*)/i).exec(args);

      // Switch to default language if regex fails

      if (!toLang)
      {
         toLang = defaultLanguage;
      }

      // Convert language string to array

      else
      {
         toLang = toLang[1].split(",");

         // Throw error if too many languages requested

         if (toLang.length > maxMulti)
         {
            sendBox({
               channel: channel.id,
               color: colorErr,
               text: text.errMaxMulti(maxMulti)
            });
            return;
         }

         // Convert to object `{valid, invalid}`

         toLang = langCheck(toLang);

         if (toLang.valid.length === 0)
         {
            var invErr = text.errBadLang(toLang.invalid);
            sendBox({
               channel: channel.id,
               color: colorErr,
               text: invErr
            });
            return;
         }

         // Convert object back to single string
         // If there was only one valid language

         if (toLang.valid.length === 1 && toLang.invalid.length === 0)
         {
            toLang = toLang.valid[0];
         }

         // Update lang type for multiple languages

         else
         {
            multi = true;
         }
      }

      //
      // Analyze position value
      //

      position = (/-?\d+/i).exec(args);

      // rest to default if regex fails

      if (!position)
      {
         position = "-1";
      }

      position = position.toString();

      // detect mode

      if (!position.startsWith("-"))
      {
         single = false;
      }

      // convert to absolute number

      position = Math.round(Math.abs(position));

      // always start at 1 for loop to work properly

      if (position < 1)
      {
         position = 1;
      }

      // prevent requests of non-existent messages in cache

      if (position > chainCount)
      {
         position = chainCount;
      }

      //
      // Debug command
      //

      console.log(
         `Pos: ${position} |
         To: ${toLang}:${multi} |
         Single: ${single} |
         Chains: ${chainCount}`
      );

      //
      // Translate single chain only
      //

      if (single)
      {
         var chain = dbChains[channel.id][position - 1];
         author = dbMessages[channel.id][chain[0] - 1].author;

         output = "";
         chain.forEach(function(msgID)
         {
            output += "\n";
            output += dbMessages[channel.id][msgID - 1].content;
         });

         //
         // Translate single chain to multiple languages
         //

         if (multi)
         {
            sendMulti({
               channel: channel.id,
               author: author,
               valid: toLang.valid,
               invalid: toLang.invalid,
               original: output
            });
            return;
         }

         //
         // Translate single chain to single language
         //

         return translate(output, {to: toLang}).then(res =>
         {
            sendBox({
               channel: channel.id,
               author: author,
               text: fn.translateFix(res.text),
               original: output,
               toLang: toLang,
               fromLang: res.from.language.iso,
               dyk: true
            });
            return;
         });
      }

      //
      // Translate all requested chains
      //


      //
      // Prevent multiple languages when translating many chains
      //

      if (multi)
      {
         sendBox({
            channel: channel.id,
            color: colorErr,
            text: text.errMultiDisabled
         });
         return;
      }

      //
      // Prevent translating chains beyond allowed number
      //

      if (position > maxChains)
      {
         position = maxChains;
         sendBox({
            channel: channel.id,
            color: colorWarn,
            text: text.errMaxChains(maxChains)
         });
      }

      //
      // Set bot to writing mode
      //

      isWriting = true;
      //botStatus("writing", channel);

      //
      // Loop through channel chains
      //

      for (var i = position - 1; i >= 0; i--)
      {
         chain = dbChains[channel.id][i];
         var chainFirst = dbMessages[channel.id][chain[0]-1];
         author = chainFirst.author;
         var time = chainFirst.createdTimestamp;

         //
         // Add the content of each message to output
         // Resets on each iteration
         //

         output = "";

         chain.forEach(msgID =>
         {
            var content = dbMessages[channel.id][msgID-1].content;

            if (content === chainFirst.content)
            {
               output += `[${time}]`;
               output += content;
            }

            else
            {
               output += "\n";
               output += content;
            }
         });

         //
         // Add chain translation object to buffer queue
         //

         var opts = {
            to: toLang,
            raw: true
         };

         translate(output, opts).then(res =>
         {
            var raw = JSON.parse(`[${res.raw}]`);
            var content = fn.translateFix(res.text);
            var ts = fn.getTimeFromStr(content);
            content = fn.remTimeFromStr(content, ts);
            var original = fn.remTimeFromStr(raw[0][0][0][1], ts);

            fn.buffer("push", {
               order: ts,
               langTo: toLang,
               langFrom: res.from.language.iso,
               content: content,
               original: original,
               author: author
            });

            //
            // Callback once all chains resolved in buffer
            //

            if (fn.buffer("len") === position)
            {
               // Reorder array by timestamp key

               var sorted = fn.sortByKey(fn.buffer("arr"), "order");

               // Reset Buffer

               fn.buffer("reset");

               // Send translation to channel

               sorted.forEach(function(chain)
               {
                  sendBox({
                     channel: channel.id,
                     text: chain.content,
                     author: chain.author,
                     original: chain.original,
                     fromLang: chain.langFrom,
                     toLang: chain.langTo,
                     buffer: sorted.length,
                     order: chain.order
                  });
               });

               // Finish writing mode

               isWriting = false;
               return;
            }
         });
      }

      // loop is over
      return;
   }
*/
};
