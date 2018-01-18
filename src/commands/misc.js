const botSend = require("../core/send");
const auth = require("../core/auth");

//
// Version Info
//

exports.version = function(data)
{
   var version = `**\`${data.config.version}\`**`;

   if (auth.changelog)
   {
      version += ` ([changelog](${auth.changelog}))`;
   }

   data.color = "info";
   data.text = `:robot:  Current bot version is ${version}`;
   return botSend(data);
};

//
// Invite Link
//

exports.invite = function(data)
{
   data.color = "info";
   data.text = `Invite ${data.bot} `;
   data.text += `\`v${data.config.version}\` to your server\n\n`;
   data.text += `${auth.invite}`;
   data.footer = {
      text:
         "Requires VIEW, SEND, REACT, EMBED, ATTACH and MENTION permissions.\n"
   };
   return botSend(data);
};
