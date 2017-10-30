/*eslint-disable*/
module.exports = function()
{
/*
   // ----------------------------------
   // Auto Translate Message in Channel
   // ----------------------------------

   if (`#${channel.id}` in dbAutomatic)
   {
      var autoChannel = dbAutomatic[`#${channel.id}`];

      for (var key in autoChannel)
      {
         var toLang = autoChannel[key].to;
         var fromLang = autoChannel[key].from;
         var destination = key;
         var footer = null;

         // check if forward channel is same as origin

         var forward = true;
         if (channel.id === destination)
         {
            forward = false;
         }

         if (forward)
         {
            footer = {
               text: `via ${channel.name}`,
               //eslint-disable-next-line camelcase
               icon_url: server.iconURL
            };
         }

         sendTranslation({
            toLang: toLang,
            fromLang: fromLang,
            original: message.content,
            author: author,
            channel: destination,
            forwardTo: forward,
            embeds: message.embeds,
            dyk: true,
            footer: footer
         });
      }
   }

   // -----------------------------
   // Auto Translate Message in DM
   // -----------------------------

   if (fn.isDM(channel) && `@${author.id}` in dbAutoDMs)
   {
      var data = dbAutoDMs[`@${author.id}`];

      sendTranslation({
         toLang: data.to,
         fromLang: data.from,
         channel: data.destination,
         original: message.content,
         author: author,
         forwardTo: true,
         embeds: message.embeds,
         footer: {
            text: `via direct message`,
            //eslint-disable-next-line camelcase
            icon_url: bot.displayAvatarURL
         }
      });
   }
*/
};
