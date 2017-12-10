const setStatus = require("../core/status");
const botSend = require("../core/send");
//const db = require("../core/db");

module.exports = function(data)
{
   console.log("settings called");

   setStatus(data.bot, "startTyping", data.message.channel);

   //
   // Command allowed by admins only
   //

   console.log(data.message.isAdmin);

   if (!data.message.isAdmin)
   {
      data.color = "warn";
      data.text = "This command is reserved for server administrators.";
      return botSend(data);
   }
};
