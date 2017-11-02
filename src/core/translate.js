const translate = require("google-translate-api");
const colorThief = require("color-thief-jimp");
const jimp = require("jimp");

const resolveID = require("./resolve.id");
const setStatus = require("./status");
const botSend = require("./send");
const colors = require("./colors");
const fn = require("./helpers");

// ------------------------------------------
// Fix broken Discord tags after translation
// (Emojis, Mentions, Channels)
// ------------------------------------------

const translateFix = function(string)
{
   return fn.replaceAll(string, /(<[:@#])\s?(\w+:?)\s?(\w+>)/igm, "$1$2$3");
};

// -----------------------------------------------
// Generate Google Translate URL (for suggestion)
// -----------------------------------------------

const googleLink = function(original, from, to)
{
   var resolved = resolveID.idConvert(original);
   var google = "https://translate.google.com/?ref=discord-translator#";
   var link = google + `${from}/${to}/` + encodeURIComponent(resolved);
   return `   [:heavy_check_mark:](${link})`;
};

// ----------------------------------------
// Get user color with jimp and colorThief
// ----------------------------------------

function getUserColor(data, callback)
{
   jimp.read(data.author.displayAvatarURL).then(function(image)
   {
      data.color = colors.rgb2dec(colorThief.getColor(image));
      callback(data);
   }
   ).catch(function(err)
   {
      console.log(err);
   });
}

// --------------------------
// Translate buffered chains
// --------------------------

const bufferSend = function(arr, data)
{
   const sorted = fn.sortByKey(arr, "time");
   sorted.forEach(msg =>
   {
      setStatus(data.bot, "startTyping", data.message.channel);

      botSend({
         message: {
            channel: data.message.channel,
            author: msg.author
         },
         text: msg.text,
         bot: data.bot,
         color: msg.color,
         showAuthor: true
      });
   });
};

const bufferChains = function(data, from)
{
   var translatedChains = [];

   data.bufferChains.forEach(chain =>
   {
      const chainMsgs = chain.msgs.join("\n");
      const to = data.translate.to.valid[0].iso;

      translate(chainMsgs, {
         to: to,
         from: from
      }).then(res =>
      {
         const link = googleLink(chainMsgs, from, to);
         const output = translateFix(res.text) + link;

         getUserColor(chain, function()
         {
            translatedChains.push({
               color: chain.color,
               time: chain.time,
               author: chain.author,
               text: output
            });

            fn.bufferEnd(data.bufferChains, translatedChains, bufferSend, data);
         });
      });
   });
};

// ----------------
// Run translation
// ----------------

module.exports = function(data) //eslint-disable-line complexity
{
   //
   // Get message author
   //

   data.author = data.message.author;

   //
   // Report invalid languages
   //

   if (data.translate.from && data.translate.from.invalid.length > 0)
   {
      data.color = "warn";
      data.text =
         "Translating from these langs is not supported: " +
         data.translate.from.invalid;

      botSend(data);
   }

   if (data.translate.to.invalid && data.translate.to.invalid.length > 0)
   {
      data.color = "warn";
      data.text =
         "Translating to these langs is not supported: " +
         data.translate.to.invalid;

      botSend(data);
   }

   //
   // Set default `from` language
   //

   var from = "auto";

   if (data.translate.from && data.translate.from.valid.length === 1)
   {
      from = data.translate.from.valid[0].iso;
   }

   //
   // Stop if there are no valid languages
   //

   if (data.translate.to.valid.length < 1)
   {
      return setStatus(data.bot, "stopTyping", data.message.channel);
   }

   //
   // Send friendly suggestion for improvement / `Did You Know` message
   //

   if (Math.random() < 0.05)
   {
      setStatus(data.bot, "startTyping", data.message.channel);
      data.text = "Did you know?";
      data.color = "info";
      botSend(data);
   }

   //
   // Translate multiple chains (!translate last n)
   //

   if (data.bufferChains)
   {
      return bufferChains(data, from);
   }

   //
   // Multi-translate same message
   //

   var translateBuffer = {};

   if (data.translate.multi && data.translate.to.valid.length > 1)
   {
      //
      // Stop if user requested too many languages
      //

      if (data.translate.to.valid.length > 6)
      {
         data.text = "Too many languages specified";
         data.color = "error";
         return botSend(data);
      }

      //
      // Buffer translations
      //

      setStatus(data.bot, "startTyping", data.message.channel);

      const bufferID = data.message.createdTimestamp;

      data.color = null;

      data.text = "";

      translateBuffer[bufferID] = {
         count: 0,
         len: data.translate.to.valid.length,
         text: "",
         update: function(newMsg, data)
         {
            this.count++;
            this.text += newMsg;

            if (this.count === this.len)
            {
               data.text = this.text;
               data.color = 0;
               data.showAuthor = true;
               getUserColor(data, botSend);
            }
         }
      };

      data.translate.to.valid.forEach(lang =>
      {
         translate(data.translate.original, {
            to: lang.iso,
            from: from
         }).then(res =>
         {
            const title = `\`\`\`LESS\n ${lang.name} (${lang.native}) \`\`\`\n`;
            const link = googleLink(data.translate.original, from, lang.iso);
            const output = "\n" + title + translateFix(res.text) + link + "\n";
            return translateBuffer[bufferID].update(output, data);
         });
      });
      return;
   }

   //
   // Send single translation
   //

   const opts =
   {
      to: data.translate.to.valid[0].iso,
      from: from
   };

   setStatus(data.bot, "startTyping", data.message.channel);

   translate(data.translate.original, opts).then(res =>
   {
      data.color = 0;
      data.text = translateFix(res.text);
      data.text += googleLink(data.translate.original, opts.from, opts.to);
      data.showAuthor = true;
      return getUserColor(data, botSend);
   });
};
