/*eslint-disable*/
module.exports = function(data)
{
/*
   // -------------------------
   // Auto Translation Stopper
   // -------------------------

   if (translateArgs.startsWith("stop for"))
   {
      var stopFor = translateArgs.replace("stop for", "").trim();
      key = `#${channel.id}`;
      id = key.slice(1);

      //
      // Check if channel is being translated at all
      //

      if (!dbAutomatic[key])
      {
         sendBox({
            channel: channel.id,
            color: colorErr,
            text: text.errNoAuto
         });
         return;
      }

      //
      // Stop translation for author
      //

      if (stopFor === "me")
      {
         if (dbAutomatic[key][`@${author.id}`])
         {
            sendBox({
               channel: channel.id,
               color: colorErr,
               text: "Stopped translating messages in this channel for you."
            });
            delete dbAutomatic[key][`@${author.id}`];
            delete dbAutoDMs[`@${author.id}`];
            return;
         }
      }

      //
      // Stop all channel translations
      //

      if (stopFor === "all")
      {
         if (isAdmin)
         {
            sendBox({
               channel: channel.id,
               color: colorInfo,
               text:
                  ":negative_squared_cross_mark:  " +
                  "All " + Object.keys(dbAutomatic[key]).length +
                  " automatic translations of  **`" +
                  channel.name +"`**  have been stopped."
            });
            delete dbAutomatic[key];
            return;
         }

         sendBox({
            channel: channel.id,
            color: colorInfo,
            text: text.errAdminOnly
         });
         return;
      }

      //
      // Stop forwarding to other channel or user
      //

      if (stopFor.startsWith("<"))
      {
         if (isManager)
         {
            if (dbAutomatic[key][stopFor.slice(1,-1)])
            {
               sendBox({
                  channel: channel.id,
                  color: colorInfo,
                  text:
                     ":negative_squared_cross_mark:  " +
                     "Automatic translation of  **`" +
                     channel.name +"`**  has been stopped " +
                     "for " + resolveID(stopFor, "name")
               });
               delete dbAutomatic[key][stopFor.slice(1,-1)];
               return;
            }
         }

         else
         {
            sendBox({
               channel: channel.id,
               color: colorInfo,
               text: text.errManagerOnly
            });
            return;
         }
      }
   }
*/
};
