/*eslint-disable*/
module.exports = function(args, data)
{
/*
   // -------------------------------
   // default language getter/setter
   // -------------------------------

   if (translateArgs.startsWith("-def"))
   {
      toLang = translateArgs.replace("-def", "").trim();

      // displays current default language
      if (toLang.length < 2)
      {
         sendBox({
            channel: channel.id,
            color: colorInfo,
            text:
               ":information_source:  " +
               "The current default translation language is `" +
               langCheck(defaultLanguage, "both") + "`."
         });
         return;
      }

      if (!isAdmin)
      {
         sendBox({
            channel: channel.id,
            color: colorErr,
            text: text.errAdminOnly
         });
         return;
      }

      if (!langCheck(toLang))
      {
         sendBox({
            channel: channel.id,
            color: colorErr,
            text: text.errBadLang(toLang)
         });
         return;
      }

      toLang = langCheck(toLang);

      sendBox({
         channel: channel.id,
         color: colorOk,
         text:
            ":white_check_mark:  The default language for " +
            "translations has been updated from `" +
            langCheck(defaultLanguage, "both") + "` to `" +
            langCheck(toLang, "both") + "`"
      });

      defaultLanguage = toLang;
      return;
   }

   // --------------------
   // Test editing
   // --------------------

   if (translateArgs.startsWith("-edit"))
   {
      message.edit("test");
   }

   // --------------------
   // Test deleting
   // --------------------

   if (translateArgs.startsWith("-del"))
   {
      message.delete().then(msg =>
      {
         message.channel.send(msg.content);
      });
   }

   // ----------
   // Fun Stuff
   // ----------

   //
   // Turn off bot
   //

   if (translateArgs.startsWith("-off"))
   {
      // stop non admins
      if (!isAdmin)
      {
         sendBox({
            channel: channel.id,
            color: colorErr,
            text: text.errAdminOnly
         });
         return;
      }

      sendBox({
         channel: channel.id,
         color: colorOk,
         text: ":octagonal_sign: Translator is now offline."
      });
      return client.destroy();
   }

   //
   // Reset presence/status
   //

   if (translateArgs.startsWith("-status"))
   {
      return botStatus("online", channel);
   }
*/
};
