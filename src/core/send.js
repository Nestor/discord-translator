const setStatus = require("./status");
const colors = require("./colors");
const fn = require("./helpers");

//
// Send Data to Channel
//

const sendBox = function(data)
{
   if (data.author)
   {
      data.author = {
         name: data.author.username,
         //eslint-disable-next-line camelcase
         icon_url: data.author.displayAvatarURL
      };
   }

   data.channel.send({
      embed: {
         author: data.author,
         color: colors.get(data.color),
         description: data.text,
         footer: data.footer
      }
   }).catch(console.error);

   //
   // Resend embeds from original message
   // Only if content is forwared to another channel
   //

   if (data.forward && data.embeds && data.embeds.length > 0)
   {
      const maxEmbeds = data.config.maxEmbeds;

      if (data.embeds.length > maxEmbeds)
      {
         sendBox({
            channel: data.channel,
            text: `:warning:  Cannot embed more than ${maxEmbeds} links.`,
            color: "warn"
         });

         data.embeds = data.embeds.slice(0, maxEmbeds);
      }

      for (var i = 0; i < data.embeds.length; i++)
      {
         data.channel.send(data.embeds[i].url);
      }
   }

   return setStatus(data.bot, "stopTyping", data.channel);
};

//
// Analyze Data and determine sending style (system message or author box)
//

//eslint-disable-next-line complexity
module.exports = function(data)
{
   var sendData = {
      config: data.config,
      channel: data.message.channel,
      color: data.color,
      text: data.text,
      footer: data.footer,
      embeds: data.message.embeds,
      forward: data.forward,
      bot: data.bot
   };

   //
   // Notify server owner if bot cannot write to channel
   //

   if (!data.canWrite)
   {
      const writeErr =
         ":no_entry:  **Translate bot** does not have permission to write at " +
         `the **${sendData.channel.name}** channel on your server **` +
         `${sendData.channel.guild.name}**. Please fix.`;

      return sendData.channel.guild.owner.send(writeErr).catch(console.error);
   }

   if (data.forward)
   {
      const forwardChannel = data.client.channels.get(data.forward);

      if (forwardChannel)
      {
         //
         // Check if bot can write to destination channel
         //

         var canWriteDest = true;

         if (forwardChannel.type === "text")
         {
            canWriteDest = fn.checkPerm(
               forwardChannel.guild.me, forwardChannel, "SEND_MESSAGES"
            );
         }

         if (canWriteDest)
         {
            sendData.channel = forwardChannel;
         }

         //
         // Error if bot cannot write to dest
         //

         else
         {
            sendData.footer = null;
            sendData.embeds = null;
            sendData.color = "error";
            sendData.text =
               ":no_entry:  Bot does not have permission to write at the " +
               `<#${forwardChannel.id}> channel.`;

            return sendBox(sendData);
         }
      }

      //
      // Error on invalid forward channel
      //

      else
      {
         sendData.footer = null;
         sendData.embeds = null;
         sendData.color = "error";
         sendData.text = ":warning:  Invalid channel.";
         return sendBox(sendData);
      }
   }

   if (data.showAuthor)
   {
      sendData.author = data.message.author;
   }

   return sendBox(sendData);
};
