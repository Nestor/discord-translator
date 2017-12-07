const translate = require("./translate");

module.exports = function(data)
{
   if (data.err)
   {
      return console.error(data.err);
   }

   if (data.rows.length > 0)
   {
      console.log("channel in db - rows:" + data.rows.length);

      data.rows.forEach(row =>
      {
         console.log(row);

         //
         // Set forward channel for sender
         //

         if (row.dest !== data.message.channel.id)
         {
            data.forward = row.dest;
            data.embeds = data.message.embeds;

            //
            // Add footer to forwarded messages
            //

            if (data.message.channel.type === "text")
            {
               data.footer = {
                  text: `via #${data.message.channel.name}`,
                  //eslint-disable-next-line camelcase
                  icon_url: data.message.guild.iconURL
               };
            }

            if (data.message.channel.type === "dm")
            {
               data.footer = {
                  text: `via DM`
               };
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

         if (row.dest.startsWith("@"))
         {
            data.client.users.get(row.dest.slice(1)).createDM().then(dm =>
            {
               data.forward = dm.id;
               data.footer.text += `  ‹  ${data.message.guild.name}`;
               translate(data);
            }).catch(console.error);
         }

         else
         {
            translate(data);
         }
      });
   }
};
