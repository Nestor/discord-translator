const setStatus = require("../core/status");
const botSend = require("../core/send");
const fn = require("../core/helpers");
const db = require("../core/db");

// ------------------------------
// Resolve language to
// ------------------------------

function resolveLangTo(to)
{
   if (to !== "default")
   {
      return to.valid[0].iso;
   }
   return to;
}

// ------------------------------
// Auto translate Channel/Author
// ------------------------------

module.exports = function(data)
{
   setStatus(data.bot, "startTyping", data.message.channel);

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
   // Language checks
   //

   if (data.cmd.from === "auto")
   {
      data.color = "error";
      data.text = "Please specify a valid language to translate from";
      return botSend(data);
   }

   if (data.cmd.to !== "default" && data.cmd.to.valid.length !== 1)
   {
      data.color = "error";
      data.text = "Please specify 1 valid language only for auto translation.";
      return botSend(data);
   }

   //
   // Prepare task data
   //

   data.task = {
      origin: data.message.channel.id,
      for: data.cmd.for,
      dest: [],
      invalid: [],
      from: data.cmd.from,
      to: resolveLangTo(data.cmd.to),
      server: data.message.guild.id
   };

   //
   // Error if non-manager sets channel as dest
   //

   if (
      data.cmd.for === 1 &&
      data.cmd.for[0] !== "me" &&
      !data.message.isManager
   )
   {
      data.color = "error";
      data.text = "You need to be a channel manager to auto translate " +
                  "this channel for others.";
      return botSend(data);
   }

   //
   // Validate Task(s) before sending to database
   //

   const validateTask = function()
   {
      // invalid langs

      if (data.task.invalid.length > 0)
      {
         data.color = "error";
         data.text = "Invalid auto translation request.";
         return botSend(data);
      }

      // multiple dests set by non-manager

      if (data.task.dest.length > 1 && !data.message.isManager)
      {
         data.color = "error";
         data.text = "You need to be a channel manager to auto translate " +
                     "this channel for others.";
         return botSend(data);
      }

      //
      // Add task to database
      //

      db.addTask(data.task);
   };

   //
   // Task buffer
   //

   var taskBuffer = {
      len: data.task.for.length,
      dest: [],
      reduce: function()
      {
         this.len--;
         this.check();
      },
      update: function(dest)
      {
         this.dest.push(dest);
         this.check();
      },
      check: function()
      {
         if (this.dest.length === this.len)
         {
            data.task.dest = fn.removeDupes(this.dest);
            data.task.invalid = fn.removeDupes(data.task.invalid);
            validateTask();
         }
      }
   };

   //
   // Resolve ID of each destiantion (user dm/channel)
   //

   data.task.for.forEach(dest => //eslint-disable-line complexity
   {
      // resolve `me` / original message author

      if (dest === "me")
      {
         data.message.author.createDM().then(dm =>
         {
            taskBuffer.update(dm.id);
         }).catch(console.error);
      }

      // resolve mentioned user(s)

      if (dest.startsWith("<@"))
      {
         const user = data.client.users.get(dest.slice(2,-1));

         if (user && !user.bot)
         {
            user.createDM().then(dm =>
            {
               taskBuffer.update(dm.id);
            }).catch(console.error);
         }
         else
         {
            data.task.invalid.push(dest);
            taskBuffer.reduce();
         }
      }

      // resolve mentioned channel(s)

      if (dest.startsWith("<#"))
      {
         const channel = data.client.channels.get(dest.slice(2,-1));

         if (channel)
         {
            taskBuffer.update(channel.id);
         }
         else
         {
            data.task.invalid.push(dest);
            taskBuffer.reduce();
         }
      }

      // invalidate @everyone and @userGroups for now

      if (dest.startsWith("@"))
      {
         data.task.invalid.push(dest);
         taskBuffer.reduce();
      }
   });



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
