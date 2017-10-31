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
   })();

   //
   // Set default `from` language
   //

   var from = "auto";

   (function()
   {
      if (data.translate.from && data.translate.from.valid.length === 1)
      {
         from = data.translate.from.valid[0].iso;
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

   (function()
   {
      if (Math.random() < 0.05)
      {
         setStatus(data.bot, "startTyping", data.message.channel);
         data.text = "Did you know?";
         data.color = "info";
         botSend(data);
      }
   })();

   //
   // Multi-translate same message
   //

   var translateBuffer = {};

   if (data.translate.multi)
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
               botSend(data);
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
            const output = title + link + translateFix(res.text) + "\n";
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
