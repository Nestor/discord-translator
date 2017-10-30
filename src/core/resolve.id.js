// -----------
// ID Helpers
// -----------

exports.idPrefix = function(id)
{
   const prefix = id.charAt(0);

   if (isNaN(prefix))
   {
      return prefix;
   }
   return null;
};

exports.idPure = function(id)
{
   if (module.exports.idPrefix(id))
   {
      return id.substring(1);
   }
   return id;
};

exports.getChName = function(channel)
{
   if (channel.type === "dm")
   {
      return channel.recipient.username;
   }
   return channel.name;
};

// ----------------------------------------------------------
// Convert IDs to prefixed names (for google-translate link)
// ----------------------------------------------------------

exports.idConvert = function(string)
{
   var regex = (/<([@#]\d*)>/gm);
   var output = string.replace(regex, function(match, contents)
   {
      return module.exports.main(contents, "prefixed");
   });
   return output;
};

// ------------
// ID Resolver
// ------------

exports.main = function(client, id, output = null)
{
   var resolved = {
      id: id,
      prefix: module.exports.idPrefix(id),
      pure: module.exports.idPure(id),
      name: null,
      obj: null
   };

   const prefixMap =
   {
      "@": function()
      {
         resolved.obj = client.users.get(resolved.pure);
         resolved.name = resolved.obj.username;
      },
      "#": function()
      {
         resolved.obj = client.channels.get(resolved.pure);
         resolved.name = module.exports.getChName(resolved.obj);
      }
   };

   if (resolved.prefix && prefixMap.hasOwnProperty(resolved.prefix))
   {
      prefixMap[resolved.prefix]();
   }
   else
   {
      resolved.obj = client.channels.get(id);
      resolved.name = module.exports.getChName(resolved.obj);
      resolved.prefix = "#";
   }

   const idOutputMap =
   {
      "name": function()
      {
         return resolved.name;
      },
      "prefixed": function()
      {
         return resolved.prefix + resolved.pure;
      },
      "type": function()
      {
         return resolved.prefix;
      }
   };

   if (output && idOutputMap.hasOwnProperty(output))
   {
      return idOutputMap[output]();
   }
   return resolved.obj;
};
