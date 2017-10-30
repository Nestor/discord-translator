exports.user = function(data)
{
   if (!data.channel.type === "dm")
   {
      data.isAdmin =
         data.member.permissions.has("ADMINISTRATOR");

      data.isManager =
         data.channel.permissionFor(data.member).has("MANAGE_CHANNELS");
   }
};

//
// Check user permission
//

exports.check = function(member, channel, perm)
{
   return channel.permissionsFor(member).has(perm);
};

//
// Check if channel is a Private/Direct Conversation
//

exports.isDM = function(channel)
{
   if (channel.type === "dm")
   {
      return true;
   }
   return false;
};
