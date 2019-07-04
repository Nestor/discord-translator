const langCheck = require("../core/lang.check");
const botSend = require("../core/send");
const db = require("../core/db");
const logger = require("../core/logger");

// --------------------
// Handle stop command
// --------------------

module.exports = function(data)
{

   //
   // Disallow this command in Direct/Private messages
   //

   if (data.message.channel.type === "dm")
   {
      data.color = "warn";
      data.text =
         ":no_entry:  This command can only be called in server channels.";

      return botSend(data);
   }

   //
   // Disallow multiple destinations
   //

   if (data.cmd.for.length > 1)
   {
      data.color = "error";
      data.text = ":warning:  Please specify only one `for` value.";
      return botSend(data);
   }

/*
   //
   // Disallow non-managers to stop for others
   //

   if (data.cmd.for[0] !== "me" && !data.message.isManager)
   {
      data.color = "error";
      data.text =
         ":cop:  You need to be a channel manager to stop auto translating " +
         "this channel for others.";

      return botSend(data);
   }
*/

   //
   // Prepare task data
   //

   const origin = data.message.channel.id;
   const dest = destID(data.cmd.for[0], data.message.author.id);
   const destDisplay = destResolver(data.cmd.for[0], data.message.author.id);

   //
   // Check if task actually exists
   //

   db.getTasks(origin, dest, function(err, res)
   {
      if (err)
      {
         return dbError(err, data);
      }

      //
      // Error if task does not exist
      //

      if (res.length < 1 || !res)
      {
	 const orig = destResolver(origin);
         data.color = "error";
         data.text =
            ":warning:  __**No tasks**__ for " +
            `**<${orig}>**.`;

         if (dest === "all")
         {
            data.text =
               ":warning:  This channel is not being automatically " +
               "translated for anyone.";
         }

         return botSend(data);
      }

      //
      // Otherwise, proceed to remove task from database
      //

      shoutTasks(res, data, origin, dest, destDisplay);
   });
};

// ---------------------
// Remove from database
// ---------------------

const shoutTasks = function(res, data, origin, dest, destDisplay)
{
   //console.log(data);
   //console.log(res);

   data.color = "ok";
   data.text = ":negative_squared_cross_mark:  Translation tasks for this channel:"
   botSend(data);

      //"channel has been stopped for **" + destDisplay + "**"

	/*
   if (dest === "all")
   {
      data.text += ` (${res.length})`;
   }
   */
   for(var i = 0, len = res.length; i < len; i++) {
	const task = res[i];
	const dest = destResolver(task.dest);
	const origin = destResolver(task.origin);	
	const lang_from = langCheck(task.lang_from).valid[0].name;	
	const lang_to = langCheck(task.lang_to).valid[0].name;	
   	data.text = `:arrow_right:   Translating **${lang_from}** messages from **<${origin}>** ` +
		   `and sending **${lang_to}** messages to **<${dest}>**`
	botSend(data);
   }

   data.text = ":negative_squared_cross_mark:  That's all I have!"
   return botSend(data);
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

const destResolver = function(dest)
{
   if (!dest.startsWith("@"))
   {
      return "#" + dest;
   }
   return dest;
};

// --------------------
// Database error
// --------------------

const dbError = function(err, data)
{
   data.color = "error";
   data.text =
      ":warning:  Could not retrieve information from database. Try again " +
      "later or report this issue to an admin if problem continues.";

   botSend(data);
   return console.log("error", err);
};
