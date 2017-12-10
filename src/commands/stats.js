const langCheck = require("../core/lang.check");
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

      const botLang = langCheck(stats.botLang).valid[0];

      const activeTasks = stats.activeTasks - stats.activeUserTasks;

      data.color = "info";

      var serverStats = "";

      const globalStats =
         `**\`\`\`@${data.bot.username} - Global Stats\`\`\`**\n` +
         `:earth_africa:  Default bot language:  ` +
         `**\`${botLang.name} (${botLang.native})\`` +
         `**\n\n:bar_chart:  Translated **\`${stats.totalCount}\`** messages ` +
         `across **\`${stats.totalServers}\`** servers\n\n` +
         `:repeat:  Automatic translation:  ` +
         `**\`${activeTasks}\`**  channels and  ` +
         `**\`${stats.activeUserTasks}\`**  users`;

      if (data.message.channel.type === "text")
      {
         const serverLang = langCheck(data.cmd.server.lang).valid[0];

         const activeServerTasks =
            data.cmd.server.activeTasks - data.cmd.server.activeUserTasks;

         serverStats =
            `**\`\`\`${data.message.channel.guild.name} - Server Info` +
            `\`\`\`**\n:earth_africa:  Default server language:  ` +
            `**\`${serverLang.name} (${serverLang.native})\`` +
            `**\n\n:bar_chart:  Translated messages:  ` +
            `**\`${data.cmd.server.count}\`**\n\n` +
            `:repeat:  Automatic translation:  ` +
            `**\`${activeServerTasks}\`**  channels and  ` +
            `**\`${data.cmd.server.activeUserTasks}\`**  users`;
      }

      if (data.cmd.params && data.cmd.params.toLowerCase().includes("server"))
      {
         data.text = serverStats;
         return botSend(data);
      }

      if (data.cmd.params && data.cmd.params.toLowerCase().includes("global"))
      {
         data.text = globalStats;
         return botSend(data);
      }

      data.text = globalStats + "\n\n" + serverStats;
      return botSend(data);
   });
};
