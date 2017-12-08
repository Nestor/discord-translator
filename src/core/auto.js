const translate = require("./translate");

// -----------------
// Get data from db
// -----------------

module.exports = function(data)
{
   if (data.err)
   {
      return console.error(data.err);
   }

   if (data.rows.length > 0)
   {
      data.proccess = true;

      for (var i = 0; i < data.rows.length; i++)
      {
         analyzeRows(data, i);
      }
   }
};

// ---------------------
// Analyze rows in loop
// ---------------------

const analyzeRows = function(data, i)
{
   const row = data.rows[i];

   //
   // Set forward channel for sender
   //

   if (row.dest !== data.message.channel.id)
   {
      data.forward = row.dest;
      data.embeds = data.message.embeds;

      if (data.message.channel.type === "dm")
      {
         const replyIndex = data.message.content.indexOf(":");
         const reply = data.message.content.slice(0, replyIndex);
         const replyCon = data.message.content.slice(replyIndex + 1);

         if (reply === row.reply)
         {
            data.proccess = true;
            data.message.content = replyCon;
         }
         else
         {
            data.proccess = false;
         }
      }
   }

   //
   // Set translation options
   //

   data.translate = {
      original: data.message.content,
      to: { valid: [{iso: row.lang_to}] },
      from: { valid: [{iso: row.lang_from}] }
   };

   //
   // Start translation
   //

   startTranslation(data, i, row);
};


// ------------------
// Start translation
// ------------------

const startTranslation = function(data, i, row)
{
   const replyID = row.reply;

   //
   // Add footer to forwarded messages
   //

   data.footer = {
      text: "via "
   };

   if (data.message.channel.type === "text")
   {
      data.footer.text += "#" + data.message.channel.name;
   }

   if (data.message.channel.type === "dm")
   {
      data.footer.text += "DM";
   }

   const footerOriginal = data.footer;

   const footerExtra = {
      text: data.footer.text +
      ` ‹ ${data.message.guild.name} | reply with ${replyID}:`,
      //eslint-disable-next-line camelcase
      icon_url: data.message.guild.iconURL
   };

   //
   // Sending to user/DM
   //

   if (row.dest.startsWith("@"))
   {
      data.client.users.get(row.dest.slice(1)).createDM().then(dm =>
      {
         data.footer = footerExtra;
         data.forward = dm.id;
         sendTranslation(data);
      }).catch(console.error);
   }

   //
   // Sending to other channel
   //

   else
   {
      data.footer = footerOriginal;
      sendTranslation(data);
   }
};

// --------------
// Proccess task
// --------------

const sendTranslation = function(data)
{
   if (data.proccess)
   {
      return translate(data);
   }
};
