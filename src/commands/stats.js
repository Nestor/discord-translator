const langCheck = require("../core/lang.check");
const botSend = require("../core/send");
const db = require("../core/db");
const auth = require("../core/auth");
const logger = require("../core/logger");

module.exports = function(data)
{
   //
   // Version Info
   //
   console.log('stats() - 1');

   var version = `**\`${data.config.version}\`**`;

   if (auth.changelog)
   {
      version += ` ([changelog](${auth.changelog}))`;
   }

   if (data.cmd.main === "version")
   {
      data.color = "info";
      data.text = `:robot:  Current bot version is ${version}`;
      return botSend(data);
   }

   console.log('stats() - 2');
   //
   // Get Stats from Database
   //

   //eslint-disable-next-line complexity
   db.getStats(function(err, stats)
   {
      if (err)
      {
         return logger("error", err);
      }

   console.log('stats() - 3');
      const botLang = langCheck(stats.botLang);

      const activeTasks = stats.activeTasks - stats.activeUserTasks;

      data.color = "info";

      var serverStats = "";

      const globalStats =
         `**\`\`\`@${data.bot.username} - Global Stats\`\`\`**\n` +
         `:earth_africa:  Default bot language:  ` +
         `**\`${botLang.name} (${botLang.native})\`` +
         `**\n\n:bar_chart:  Translated **\`${stats.totalCount}\`** messages ` +
         `across **\`${stats.totalServers}\`** servers\n\n` +
         `:robot:  Version:  ${version}\n\n` +
         `:repeat:  Automatic translation:  ` +
         `**\`${activeTasks}\`**  channels and  ` +
         `**\`${stats.activeUserTasks}\`**  users`;

      if (data.message.channel.type === "text" && data.cmd.server)
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

   console.log('stats() - 4');
      if (data.cmd.params && data.cmd.params.toLowerCase().includes("server"))
      {
         data.text = serverStats;

   console.log('stats() - 5');
         //
         // Calling via DM
         //

         if (data.message.channel.type === "dm")
         {
            data.color = "warn";
            data.text = "You must call server stats from a server channel.";
         }

   console.log('stats() - 6');
         //
         // Unregistered server
         //

         if (!data.cmd.server)
         {
            data.color = "error";
            data.text = "This server is not registered in the database.";
            logger(
               "error",
               "'UNREGISTERED'\n" +
               data.message.channel.guild.name + "\n" +
               data.message.channel.guild.id
            );
         }

         botSend(data);
         return true;
      }

   console.log('stats() - 7');
      if (data.cmd.params && data.cmd.params.toLowerCase().includes("global"))
      {
         data.text = globalStats;
         botSend(data);
         return botSend(data);
      }

   console.log('stats() - 8');
      data.text = globalStats + "\n\n" + serverStats;
      botSend(data);
      return botSend(data);
   });
};
