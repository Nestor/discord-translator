const setStatus = require("../core/status");
const botSend = require("../core/send");
const db = require("../core/db");

// --------------------
// Handle stop command
// --------------------

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
   // Disallow multiple destinations
   //

   if (data.cmd.for.length > 1)
   {
      data.color = "error";
      data.text = "Please specify only one `for` value.";
      return botSend(data);
   }

   //
   // Disallow non-managers to stop for others
   //

   if (data.cmd.for[0] !== "me" && !data.message.isManager)
   {
      data.color = "error";
      data.text = "You need to be a channel manager to stop auto translating " +
                  "this channel for others.";
      return botSend(data);
   }

   //
   // Prepare task data
   //

   const origin = data.message.channel.id;
   const dest = destID(data.cmd.for[0], data.message.author.id);
   const destDisplay = destResolver(data.cmd.for[0], data.message.author.id);

   db.removeTask(origin, dest, function(err)
   {
      if (err)
      {
         data.color = "error";
         data.text = "Could not handle request. Make sure you entered the " +
                     "correct information and that the current channel has " +
                     "active translation tasks.";
         botSend(data);
         return console.error(err);
      }

      data.color = "ok";
      data.text = "Auto translation of this channel has been stopped for **" +
                  destDisplay + "**.";

      return botSend(data);
   });
};

// -----------------------
// Destination ID handler
// -----------------------

const destID = function(dest, author)
{
   if (dest.startsWith("<#"))
   {
      return dest.slice(2,-1);
   }
   if (dest.startsWith("<@"))
   {
      return dest.slice(1,-1);
   }
   if (dest === "me")
   {
      return "@" + author;
   }
   return dest;
};

const destResolver = function(dest, author)
{
   if (dest === "me")
   {
      return "<@" + author + ">";
   }
   return dest;
};
