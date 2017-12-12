const setStatus = require("../core/status");
const botSend = require("../core/send");

// ------------------------
// Bot Help / Command List
// ------------------------

module.exports = function(data)
{
   setStatus(data.bot, "startTyping", data.message.channel);

   data.color = "info";

   //
   // Detect if help is needed for specific command
   //

   var getHelpWith = "basics";

   if (data.cmd.params)
   {
      const cleanParam = data.cmd.params.toLocaleLowerCase().trim();
      getHelpWith = cleanParam;
   }

   data.text = helpMessage(data.config, data.bot.username, getHelpWith);

   return botSend(data);
};

// ------------------------
// Help Text
// ------------------------

const helpMessage = function(config, botname, param)
{
   //
   // Bot Info
   //

   const info =
   `**${botname} Bot - v.${config.version}**\n` +
   `Translates Discord messages (based on \`Google API\`).\n\n`;

   //
   // Help Basics
   //

   const basics =
   `The bot has many commands, please write the command name after ` +
   `\`help\` as shown below to learn more.\n` +
   "```md\n" +
   `# Translate custom message \n` +
   `* ${config.translateCmd} help custom\n` +
   `> ${config.translateCmd} this\n\n` +

   `# Translate last message(s) \n` +
   `* ${config.translateCmd} help last\n` +
   `> ${config.translateCmd} last\n\n` +

   `# Auto translate channels \n` +
   `* ${config.translateCmd} help auto\n` +
   `> ${config.translateCmd} channel\n\n` +

   `# Stop Auto-Translation \n` +
   `* ${config.translateCmd} help stop\n` +
   `> ${config.translateCmd} stop\n\n` +

   `# Misc & stats \n` +
   `* ${config.translateCmd} help misc\n` +
   `> ${config.translateCmd} help\n` +
   `> ${config.translateCmd} stats\n\n` +

   `# Settings (server-admins) \n` +
   `* ${config.translateCmd} help settings\n` +
   `> ${config.translateCmd} settings setLang\n` +
   `> ${config.translateCmd} settings disconnect\n` +
   "```" +
   "\n Please report any bugs or requests to the **[official developement " +
   `server](${config.botServer})**.`;

   //
   // Last Message (last)
   //

   const last =
   `__**Translate Last Message(s)**__\n\n` +
   `Translates last message chain(s) in channel. A chain is a collection of ` +
   `messages by the same author, to keep things simple.\n` +
   "```md\n" +

   `# Command\n` +
   `> ${config.translateCmd} last \n` +
   `> ${config.translateCmd} last [n] to [lang] from [lang] \n\n` +

   `# Parameters\n` +
   `* to [lang] - defaults to server default language\n` +
   `* to [lang, lang, ...] - translates to multiple languages\n` +
   `* from [lang] - defaults to automatic detection\n` +
   `* [n] - number of chains to translate, default is 1\n` +
   `* [-n] - negative number means only one chain is translated\n\n` +

   `# Examples\n` +
   `> ${config.translateCmd} last 2 \n` +
   `> ${config.translateCmd} last to english \n` +
   `> ${config.translateCmd} last to english, german, french \n` +
   `> ${config.translateCmd} last -6 to english from german` +
   "```";

   //
   // Custom message (this)
   //

   const custom =
   `__**Translate Custom Message**__\n\n` +
   `Translates a custom message entered by user.\n` +
   "```md\n" +

   `# Command\n` +
   `> ${config.translateCmd} this: [msg] \n` +
   `> ${config.translateCmd} this to [lang] from [lang]: [msg] \n\n` +

   `# Parameters\n` +
   `* to [lang] - defaults to server default language\n` +
   `* to [lang, lang, ...] - translates to multiple languages\n` +
   `* from [lang] - defaults to automatic detection\n\n` +

   `# Examples\n` +
   `> ${config.translateCmd} this: bonjour \n` +
   `> ${config.translateCmd} this to spanish: hello world \n` +
   `> ${config.translateCmd} this to arabic, hebrew: I love you \n` +
   `> ${config.translateCmd} this to de from en: how are you? \n` +
   "```";

   //
   // Auto translate (channel)
   //

   const auto =
   `__**Auto Translate Channels/Users**__\n\n` +
   `Automatically translates any new messages in channel and forwards them ` +
   `to you. Admins/mods can set forwarding to other channels or users in ` +
   `server. Messages in forwarded channels will also be sent back to origin*.` +
   "```md\n" +

   `# Command\n` +
   `> ${config.translateCmd} channel \n` +
   `> ${config.translateCmd} channel to [lang] from [lang] for [me/@/#] \n` +
   `> ${config.translateCmd} stop for [me/@/#] \n\n` +

   `# Parameters\n` +
   `* to [lang] - defaults to server default language\n` +
   `* from [lang] -  language to translate from \n` +
   `* for [me/@/#] - defaults to "me", admins can use mentions \n\n` +

   `# Examples\n` +
   `> ${config.translateCmd} channel to english from chinese \n` +
   `> ${config.translateCmd} channel to en from de for #englishChannel \n` +
   `> ${config.translateCmd} channel to de from en for @steve \n` +
   `> ${config.translateCmd} channel to en from ru for #ch1, #ch2, #usr1 \n` +
   "```" +
   "\n* Translated messages that are forwarded to users include a special id " +
   "for replying. Simply copy the code and paste into DM window before your " +
   "message to send a response, example: `XX123: your message here`.";

   //
   // Auto translate (stop)
   //

   const stop =
   `__**Stop Auto Translation**__\n\n` +
   `Terminates auto-translation of channel for you. ` +
   `Admins/mods can stop for other channels or users in server.` +
   "```md\n" +

   `# Command\n` +
   `> ${config.translateCmd} stop \n` +
   `> ${config.translateCmd} stop for [me/@/#/all] \n\n` +

   `# Parameters\n` +
   `* for [me/@/#/all] - defaults to "me" \n\n` +

   `# Examples\n` +
   `> ${config.translateCmd} stop \n` +
   `> ${config.translateCmd} stop for me \n` +
   `> ${config.translateCmd} stop for @usr1 \n` +
   `> ${config.translateCmd} stop for #ch1 \n` +
   `> ${config.translateCmd} stop for all \n` +
   "```";

   //
   // Misc
   //

   const misc =
   `__**Miscellaneous Commands**__\n\n` +
   "```md\n" +

   `# Help\n` +
   `> ${config.translateCmd} help\n` +
   `> ${config.translateCmd} help [command]\n\n` +

   `# Statistics\n` +
   `> ${config.translateCmd} stats \n` +
   `> ${config.translateCmd} stats global \n` +
   `> ${config.translateCmd} stats server \n\n` +

   `# Supported Languages\n` +
   `> ${config.translateCmd} list\n` +
   "```";

   //
   // Settings
   //

   const settings =
   `__**Settings**__\n\n` +
   `These commands are available only to admins in server channels.` +
   "```md\n" +

   `# Set default server language\n` +
   `> ${config.translateCmd} settings setLang to [lang]\n\n` +

   `# Disconnect bot from server\n` +
   `> ${config.translateCmd} settings disconnect \n` +
   "```";

   //
   // Proccess result
   //

   const paramMap =
   {
      "basics": info + basics,
      "custom": custom,
      "last": last,
      "auto": auto,
      "stop": stop,
      "misc": misc,
      "settings": settings
   };

   if (paramMap.hasOwnProperty(param))
   {
      return paramMap[param];
   }

   return paramMap.basics;
};
