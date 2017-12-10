const setStatus = require("../core/status");
const botSend = require("../core/send");
const db = require("../core/db");

module.exports = function(data)
{
   setStatus(data.bot, "startTyping", data.message.channel);

   db.getStats(function(err, stats)
   {
      if (err)
      {
         return console.error(err);
      }

      data.color = "info";
      data.text = ":bar_chart:  ";

      if (stats.totalCount === 0)
      {
         data.color = "warn";
         data.text += "This bot has **not** translated any messages yet.";
      }

      else if (stats.totalCount === 1)
      {
         data.text += "This bot has translated only **one** message so far.";
      }

      else
      {
         data.text += `This bot has translated over **${stats.totalCount}** ` +
                      `messages across **${stats.totalServers}** servers.`;
      }

      return botSend(data);
   });
};

/*

const serverLang = langCheck(data.cmd.server.lang);

data.color = "info";
data.text =
   `__**${data.message.channel.guild.name}** - Server Info__\n\n` +
   `:earth_africa:  Default server language:  ` +
   `**\`${serverLang.valid[0].name} (${serverLang.valid[0].native})\`` +
   `**\n\n:bar_chart:  Translated messages:  ` +
   `**\`${data.cmd.server.count}\`**\n\n` +
   `:repeat:  Automatic translation:  ` +
   `**\`X\`**  channels and  **\`X\`**  users`;
return botSend(data);

*/
