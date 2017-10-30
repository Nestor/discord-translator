const translate = require("google-translate-api");
const resolveID = require("./resolve.id");
const setStatus = require("./status");
const botSend = require("./send");
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
   return `[:heavy_check_mark:](${link})   `;
};

// ----------------
// Run translation
// ----------------

module.exports = function(data)
{
   //
   // Report invalid languages
   //

   (function()
   {
      if (data.translate.to.invalid.length > 0)
      {
         data.text = "Langs not supported: " + data.translate.to.invalid;
         data.color = "warn";
         botSend(data);
      }
   })();

   //
   // Set default `from` language
   //

   var from = "auto";

   (function()
   {
      if (data.translate.from && data.translate.from.valid.length === 1)
      {
         from = data.translate.from.valid[0];
      }
   })();

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
   // Multi-translate same message
   //

   var translateBuffer = {};

   //
   // Multi-translate same message
   //

   if (data.translate.multi)
   {
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
               botSend(data);
            }
         }
      };

      data.translate.to.valid.forEach(lang =>
      {
         translate(data.translate.original, {to: lang.iso}).then(res =>
         {
            const title = `\`\`\`LESS\n ${lang.name} (${lang.native}) \`\`\`\n`;
            const link = googleLink(data.translate.original, "auto", lang.iso);
            translateBuffer[bufferID].update(
               title + link + translateFix(res.text) + "\n ",
               data
            );
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

   translate(data.translate.original, opts).then(res =>
   {
      setStatus(data.bot, "startTyping", data.message.channel);
      data.color = 0;
      data.text = googleLink(data.translate.original, opts.from, opts.to);
      data.text += translateFix(res.text);
      data.showAuthor = true;
      return botSend(data);
   });
};
