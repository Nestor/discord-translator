const text = require("../i18n/en");
const setStatus = require("./status");
const colors = require("./colors");
const colorThief = require("color-thief-jimp");
const jimp = require("jimp");

//
// Send Data to Channel
//

const sendBox = function(data)
{
   (function()
   {
      if (data.author)
      {
         data.author = {
            name: data.author.username,
            //eslint-disable-next-line camelcase
            icon_url: data.author.displayAvatarURL
         };
      }
   })();

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
   // Limited to 5 embeds
   //

   if (data.forward && data.embeds.length > 0)
   {
      if (data.embeds.length > 5)
      {
         sendBox({
            channel: data.channel,
            text: text.errMaxEmbeds(5),
            color: "warn"
         });
      }

      for (var i = 0; i < 5; i++)
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
      channel: data.message.channel,
      color: data.color,
      text: data.text,
      footer: data.footer,
      embeds: data.message.embeds,
      forward: data.forward,
      bot: data.bot
   };

   //
   // Use jimp and colorTheif to get color from user avatar
   //

   if (data.showAuthor)
   {
      if (data.buffer)
      {
         /*jimp.read(data.author.displayAvatarURL).then(function(image)
         {
            data.color = colors.rgb2dec(colorThief.getColor(image));
            fn.buffer("push", data);

            if (fn.buffer("len") === data.buffer)
            {
               var sorted = fn.sortByKey(fn.buffer("arr"), "order");
               fn.buffer("reset");

               // Send translation to channel

               sorted.forEach(function(chain)
               {
                  channel.send({
                     embed:
                     {
                        color: chain.color,
                        author:
                        {
                           name: chain.author.username,
                           //url: link,
                           //eslint-disable-next-line camelcase
                           icon_url: chain.author.displayAvatarURL
                        },
                        description: chain.text,
                        footer: data.footer
                     }
                  });
               });
               return botStatus("online", channel);
            }
         }).catch(function(err)
         {
            console.error(err);
         });
         */

         return;
      }

      jimp.read(data.message.author.displayAvatarURL).then(function(image)
      {
         sendData.color = colors.rgb2dec(colorThief.getColor(image));
         sendData.author = data.message.author;
         sendBox(sendData);
      }).catch(function(err)
      {
         console.log(err);
      });

      return;
   }

   //
   // Send Simple RichEmbed with custom color
   //

   return sendBox(sendData);
};
