const langCheck = require("../core/lang.check");
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
      server: data.message.guild.id,
      reply: data.message.guild.nameAcronym
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
   // Error if channel exceeds maximum allowed tasks
   //

   db.getCount("tasks", "origin", data.task.origin, function(err, res)
   {
      if (err)
      {
         console.error(err);
      }

      const taskCount = res[Object.keys(res)[0]];

      if (data.task.for.length + taskCount >= data.config.maxTasksPerChannel)
      {
         data.color = "error";
         data.text = "Cannot add more auto-translation tasks for this channel" +
                     ` (${data.config.maxTasksPerChannel} max)`;
         return botSend(data);
      }

      taskLoop();
   });

   //
   // Resolve ID of each destiantion (user dm/channel)
   //

   const taskLoop = function()
   {
      data.task.for.forEach(dest => //eslint-disable-line complexity
      {
         // resolve `me` / original message author

         if (dest === "me")
         {
            taskBuffer.update("@" + data.message.author.id);
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

               taskBuffer.update("@" + user.id);
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

      //
      // Send out success message
      //

      const langFrom = langCheck(data.task.from).valid[0].name;
      const langTo = langCheck(data.task.to).valid[0].name;
      const forNames = data.cmd.for.join(",  ").replace(
         "me", `<@${data.message.author.id}>`
      );

      data.color = "ok";
      data.text = "This channel is now being automatically translated " +
                  `from  **\`${langFrom}\`**  to  **\`${langTo}\`**` +
                  `  for  ${forNames}.`;

      return botSend(data);
   };
};