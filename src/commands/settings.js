const setStatus = require("../core/status");
const botSend = require("../core/send");
const db = require("../core/db");

module.exports = function(data)
{
   setStatus(data.bot, "startTyping", data.message.channel);

   //
   // Command allowed by admins only
   //

   if (!data.message.isAdmin)
   {
      data.color = "warn";
      data.text = "This command is reserved for server administrators.";
      return botSend(data);
   }

   //
   // Set default server language
   //

   if (data.cmd.params.toLowerCase().includes("setlang"))
   {
      if (data.cmd.to.valid.length !== 1)
      {
         data.color = "error";
         data.text = "Please specify 1 valid language.";
         return botSend(data);
      }

      return db.updateServerLang(
         data.message.channel.guild.id,
         data.cmd.to.valid[0].iso,
         function(err)
         {
            if (err)
            {
               return console.error(err);
            }
            data.color = "ok";
            data.text = "Default language for server has been changed to **`" +
                        data.cmd.to.valid[0].name + "`**.";

            return botSend(data);
         }
      );
   }

   //
   // Disconnect bot
   //

   if (data.cmd.params.toLowerCase().includes("disconnect"))
   {
      console.log("disconnect bot from server");
   }
};
