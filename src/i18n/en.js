/*eslint-disable*/
// ======================
// Bot Texts / Responses
// ======================s

exports.errChannelNotFound =
   ':warning:  Cannot find channel in server.';

exports.errUserNotFound =
   ':warning:  Cannot find user in server.';

exports.errMultiDisabled =
   ':warning:  Multi-translation is not allowed for multiple message chains / `last [n]`';

exports.errDM =
   ':warning:  This command is not allowed in Direct/Private conversations. Try it at a server channel!';

exports.errNoAuto =
   "There are no automatic translations for this channel to stop.";

exports.errBusy =
   ':warning:  Translate bot is busy, try later!';

exports.errBot =
   ':warning:  Auto translation for bots is forbidden.';

exports.errInvalidArgs =
   ':warning:  Invalid arguments.';

exports.errAdminOnly =
   ':warning:  Sorry! This command is reserved for **server admins** only.';

exports.errManagerOnly =
   ':warning:  Sorry! This command is reserved for **channel managers** only.';

exports.errNoMsgs =
   ":warning:  **Could not detect messages for translation**:\n"
   + "```md\nThe bot cannot translate the following:\n"
   + "* Messages written before the bot logged in\n"
   + "* Messages by other bots\n"
   + "* Bot commands"
   + "```";

exports.soon =
   'This feature will be available soon!';

exports.improvement =
   ':bulb:  Did you know? You can suggest translation improvements by clicking'
   + ' on the check mark icon (:heavy_check_mark:) in translated messages. You may also join the [Google Translate Community](https://translate.google.com/community).';

exports.supported =
   ':globe_with_meridians:  **Supported translation languages:**\n';

exports.errBadLang = function (lang)
{
   return ":warning:  The language **`" + lang + "`** is not supported. Please use `!translate -list` for available languages.";
}

exports.errMaxChains = function (max)
{
   return `:warning:  Cannot translate more than ${max} messages at once.`;
}

exports.errMaxEmbeds = function (max)
{
   return `:warning:  Cannot embed more than ${max} links.`;
}

exports.errMaxMulti = function (max)
{
   return `:warning:  You can only set a maximum of ${max} languages for multi-translation.`;
}

exports.helpMessage = function(version)
{
   return "```md"
   + "\n# Translator Bot - v." + version + "\n"
   + "Translates Discord messages (based on Google API).\n\n"

   + "# Translate Last Message(s):\n"
   + "* !translate last - translates last message in channel.\n"
   + "* !translate last to [lang] - translates last message to specified language.\n"
   + "* !translate last [n] - translates all last [n] messages.\n"
   + "* !translate last -[n] - translates only specific last message.\n\n"

   + "# Translate Custom Message:\n"
   + "* !translate this: [msg] - translates entered message.\n"
   + "* !translate this to [lang]: [msg] - translates entered message to specified language.\n\n"

   + "# Auto Translate Channel [admins-only]:\n"
   + "* !translate #channel - current channel translation info.\n"
   + "* !translate #channel to [lang] at #forwardChannel - translates channel to specific language and forwards messages to another channel.\n"
   + "* !translate #channel stop - terminates channel auto translation.\n\n"

   + "# Auto Translate User:\n"
   + "* !translate @user - current user translation info.\n"
   + "* !translate @user to [lang] at #channel - translates user messages to specific language in specific channel.\n"
   + "* !translate @user stop - terminates user auto translation.\n\n"

   + "# Misc:\n"
   + "* !translate help OR @mention - list of commands.\n"
   + "* !translate -list - display list of supported languages.\n"
   + "* !translate -def - display current default translation language.\n\n"

   + "# Settings [admins-only]:\n"
   + "* !translate -def [lang] - sets a new default translation language.\n"
   + "* !translate -off - shutdown translate bot.\n\n"
   //+ "* !translate -status - reset status.\n\n"

   + "# Notes:\n"
   + "* Use ISO 639-1 codes for the [lang] param.\n"
   + "* Integrity of emojis and links in messages not guaranteed.\n"
   + "* The bot is not responsible for any poor translations :p\n\n"

   //+ "## Credits:\n\n"
   //+ ""
   + "```";
}
