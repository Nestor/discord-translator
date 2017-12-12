const setStatus = require("./status");
const colors = require("./colors");

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
   });

   //
   // Resend embeds from original message
   // Only if content is forwared to another channel
   //

   const maxEmbeds = data.config.maxEmbeds;

   if (data.forward && data.embeds.length > 0)
   {
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

   if (data.forward)
   {
      const forwardChannel = data.client.channels.get(data.forward);

      if (forwardChannel)
      {
         sendData.channel = forwardChannel;
      }

      else
      {
         return;
      }
   }

   if (data.showAuthor)
   {
      sendData.author = data.message.author;
   }

   return sendBox(sendData);
};
