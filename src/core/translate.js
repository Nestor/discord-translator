const translate = require("google-translate-api");
const colorThief = require("color-thief-jimp");
const jimp = require("jimp");

const db = require("./db");
const resolveID = require("./resolve.id");
const setStatus = require("./status");
const botSend = require("./send");
const colors = require("./colors");
const fn = require("./helpers");
const logger = require("./logger");

// ------------------------------------------
// Fix broken Discord tags after translation
// (Emojis, Mentions, Channels)
// ------------------------------------------

const translateFix = function(string)
{
   return fn.replaceAll(
      string, /(<[:@#])\s?(&)?\s?(\w+:?)\s?(\w+>)/igm, "$1$2$3$4"
   );
};

// -----------------------------------------------
// Generate Google Translate URL (for suggestion)
// -----------------------------------------------

const googleLink = function(original, from, to, client, guild)
{
   var resolved = resolveID.idConvert(original, client, guild);
   var google = "https://translate.google.com/?ref=discord-translator#";
   var link = google + `${from}/${to}/` + encodeURIComponent(resolved);
   return `   [:heavy_check_mark:](${link})`;
};

// ----------------------------------------
// Get user color with jimp and colorThief
// ----------------------------------------

function getUserColor(data, callback)
{
   const fw = data.forward;
   const txt = data.text;
   const ft = data.footer;

   jimp.read(data.author.displayAvatarURL).then(function(image)
   {
      data.forward = fw;
      data.text = txt;
      data.footer = ft;
      data.color = colors.rgb2dec(colorThief.getColor(image));
      callback(data);
   }
   ).catch(err => logger("error", err));
}

// --------------------------
// Translate buffered chains
// --------------------------

const bufferSend = function(arr, data)
{
   const sorted = fn.sortByKey(arr, "time");
   sorted.forEach(msg =>
   {
      setStatus(data.bot, "startTyping", data.message.channel, data.canWrite);

      data.text = msg.text;
      data.color = msg.color;
      data.showAuthor = true;

      botSend(data);
   });
};

const bufferChains = function(data, from, guild)
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
         const link = googleLink(
            chainMsgs, from, to, data.client, guild
         );
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

// ---------------------
// Invalid lang checker
// ---------------------

const invalidLangChecker = function(obj, callback)
{
   if (obj && obj.invalid && obj.invalid.length > 0)
   {
      return callback();
   }
};

// --------------------
// Update server stats
// --------------------

const updateServerStats = function(message)
{
   var id = "bot";

   if (message.channel.type === "text")
   {
      id = message.channel.guild.id;
   }

   db.increase("servers", "id", id, "count");
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

   invalidLangChecker(data.translate.from, function()
   {
      data.color = "warn";
      data.text = ":warning:  Cannot translate from `" +
                  data.translate.from.invalid.join("`, `") + "`.";
      botSend(data);
   });

   invalidLangChecker(data.translate.to, function()
   {
      data.color = "warn";
      data.text = ":warning:  Cannot translate to `" +
                  data.translate.to.invalid.join("`, `") + "`.";
      botSend(data);
   });

   //
   // Stop if there are no valid languages
   //

   if (
      data.translate.to.valid.length < 1 ||
      data.translate.from.valid && data.translate.from.valid.length < 1
   )
   {
      return setStatus(
         data.bot, "stopTyping", data.message.channel, data.canWrite
      );
   }

   //
   // Handle value of `from` language
   //

   var from = data.translate.from;

   if (from !== "auto")
   {
      from = data.translate.from.valid[0].iso;
   }

   //
   // Send friendly suggestion for improvement / `Did You Know` message
   //

   if (Math.random() < 0.01)
   {
      const originalFt = data.footer;
      data.footer = null;
      data.color = "info";

      data.text =
         ":bulb:  **Did you know?**\n" +
         "You can suggest translation improvements by " +
         "clicking on the check mark icon (:heavy_check_mark:) in translated " +
         "messages. You may also join the [Google Translate Community]" +
         "(https://translate.google.com/community).";

      botSend(data);
      data.footer = originalFt;
   }

   //
   // Get guild data
   //

   var guild = null;

   if (data.message.channel.type === "text")
   {
      guild = data.message.channel.guild;
   }

   //
   // Translate multiple chains (!translate last n)
   //

   if (data.bufferChains)
   {
      return bufferChains(data, from, guild);
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

      setStatus(data.bot, "startTyping", data.message.channel, data.canWrite);

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
            const link = googleLink(
               data.translate.original, from, lang.iso, data.client, guild
            );
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

   if (!data.forward)
   {
      setStatus(data.bot, "startTyping", data.message.channel, data.canWrite);
   }

   const fw = data.forward;
   const ft = data.footer;

   //
   // Split long messages
   //

   const textArray = fn.chunkString(data.translate.original, 500);

   textArray.forEach(chunk =>
   {
      translate(chunk, opts).then(res =>
      {
         updateServerStats(data.message);
         data.forward = fw;
         data.footer = ft;
         data.color = 0;
         data.text = translateFix(res.text);
         data.text += googleLink(
            chunk, opts.from, opts.to, data.client, guild
         );
         data.showAuthor = true;
         return getUserColor(data, botSend);
      });
   });
   return;
};
