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
