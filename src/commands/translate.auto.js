const setStatus = require("../core/status");
const botSend = require("../core/send");
const translate = require("../core/translate");

// ------------------------------
// Auto translate Channel/Author
// ------------------------------

module.exports = function(data)
{
   //
   // Disallow this command in Direct/Private messages
   //

   if (data.message.channel.type === "dm")
   {
      data.color = "warn";
      data.text = "This command can only be called in server channels";

      return botSend(data);
   }

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



/*

   if (
      translateArgs.startsWith("<#") ||
      translateArgs.startsWith("channel")
   )
   {
      //
      // Disallow this command in Direct/Private messages
      //

      if (fn.isDM(channel))
      {
         sendBox({
            channel: channel.id,
            color: colorErr,
            text: text.errDM
         });
         return;
      }

      //
      // Detect request for current or specified channel ID
      //

      var current = true;
      if (translateArgs.startsWith("<#"))
      {
         current = false;
      }

      //
      // Throw error for invalid args
      //

      if (!current && isNaN(translateArgs.charAt(2)))
      {
         sendBox({
            channel: channel.id,
            color: colorErr,
            text: text.errInvalidArgs
         });
         return;
      }

      //
      // Set default args
      //

      args = translateArgs.split(" ");

      key = `#${channel.id}`;

      if (!current)
      {
         key = args[0].slice(1,-1);
      }

      var id = key.slice(1); // digits only

      toLang = defaultLanguage;

      fromLang = defaultLanguage;

      destination = key;

      //
      // Throw error if there too many args
      //

      if (args.length > 7)
      {
         sendBox({
            channel: channel.id,
            color: colorErr,
            text: text.errInvalidArgs
         });
         return;
      }

      //
      // Proccess command args
      //

      // Translation language

      if (fn.inArray("to", args))
      {
         toLang = args[args.indexOf("to") + 1];

         if (!langCheck(toLang))
         {
            channel.send(text.errBadLang(toLang));
            return;
         }

         // get ISO of language
         toLang = langCheck(toLang);
      }

      // Translate from

      if (fn.inArray("from", args))
      {
         fromLang = args[args.indexOf("from") + 1];

         if (!langCheck(fromLang))
         {
            channel.send(text.errBadLang(fromLang));
            return;
         }

         // get ISO of language
         fromLang = langCheck(fromLang);
      }

      // Destination

      if (fn.inArray("for", args))
      {
         destination = args[args.indexOf("for") + 1];

         if (destination === "me")
         {
            destination = `@${message.author.id}`;
         }

         else
         {
            destination = destination.slice(1, -1);
         }
      }

      //
      // Get name of channel
      //

      var name;

      if (client.channels.get(id))
      {
         name = client.channels.get(id).name;
      }

      // Throw error if Channel does not exist in client cache

      else
      {
         sendBox({
            channel: channel.id,
            color: colorErr,
            text: text.errChannelNotFound
         });
         return;
      }

      //
      // Debug
      //

      console.log(
         "name: " + name +
         " | key: " + key +
         " | from: " +fromLang +
         " | to: " +toLang +
         " | for: " + destination
      );

      //
      // User/Channel current translation status
      //

      if (args.length === 1)
      {
         if (key in dbAutomatic)
         {
         /*
            var forwardTxt =
               " at the  **`"
               + client.channels.get(typeObj[id][1]).name
               + "`** channel";

            if (id == typeObj[id][1]) forwardTxt = "";
         */
         /*
            sendBox({
               channel: channel.id,
               color: colorInfo,
               text:
                  ":information_source:  All messages in" +
                  "  **`"+ name +"`**" +
                  "  are being automatically translated to **`[object]`**"
                  //langCheck(dbAutomatic[key][0], "name")

            });
            return;
         }

         sendBox({
            channel: channel.id,
            color: colorInfo,
            text:
               ":information_source:  Messages in" +
               "  **`"+ name +
               "`**  are __**not**__ being automatically translated."
         });
         return;
      }

      //
      // Start translating
      //

      if (args.length > 2)
      {
         if (!dbAutomatic[key])
         {
            dbAutomatic[key] = {};
         }

         dbAutomatic[key][destination] = {
            to: toLang,
            from: fromLang
         };

         if (destination.startsWith("@"))
         {
            dbAutoDMs[destination] = {
               destination: key,
               to: fromLang,
               from: toLang
            };
         }

         sendBox({
            channel: channel.id,
            color: colorOk,
            text:
               ":white_check_mark:  All messages " +
               "in  **`"+ name +"`**" +
               "  are now being automatically translated to **`" +
               langCheck(toLang, "name") + "`** for <" +
               destination + ">."
         });
         return;
      }
   }
*/
};
