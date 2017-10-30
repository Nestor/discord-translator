// ----------------------
// Initiate cache checks
// ----------------------

exports.init = function(channel, db)
{
   if (!(channel.id in db.messages))
   {
      db.messages[channel.id] = [];
   }

   if (!(channel.id in db.chains))
   {
      db.chains[channel.id] = [];
   }

   if (!(channel.id in db.lastAuthor))
   {
      db.lastAuthor[channel.id] = "";
   }
};

// --------------------------------------
// Add current message to messages cache
// --------------------------------------

var lastTimestamp = 0;

exports.update = function(data, db)
{
   db.messages[data.channel.id].push(data.id); //check how this works o_OOO

   //
   // Chain messages by same author in one group
   //

   if (data.author.id === db.lastAuthor[data.channel.id])
   {
      db.chains[data.channel.id][0].push(db.messages[data.channel.id].length);

      //
      // Reset if same author wrote message after 30 seconds (ms*sec*min)
      // Or if author wrote more than 10 messages at the same time
      //

      const timeDiff = data.createdTimestamp - lastTimestamp;

      if (timeDiff > 5000 || db.chains[data.channel.id][0].length > 10)
      {
         db.chains[data.channel.id][0].pop();
         db.chains[data.channel.id].unshift(
            [db.messages[data.channel.id].length]
         );
      }
   }
   else
   {
      db.chains[data.channel.id].unshift([db.messages[data.channel.id].length]);
   }

   //
   // Update values for next message event
   //

   db.lastAuthor[data.channel.id] = data.author.id;
   lastTimestamp = data.createdTimestamp;
};
