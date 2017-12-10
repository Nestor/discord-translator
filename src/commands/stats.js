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