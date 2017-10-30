// =================
// Helper Functions
// =================

//
// Check user permission
//

exports.checkPerm = function(member, channel, perm)
{
   return channel.permissionsFor(member).has(perm);
};

//
// Check if item is inside array
//

exports.inArray = function(item, array)
{
   return array.indexOf(item) > -1;
};

//
// Get key name of object by its value
//

exports.getKeyByValue = function (object, value)
{
   return Object.keys(object).find(key => object[key] === value);
};

//
// Push to array as callback
//

exports.pushToArray = function(data, array)
{
   array.push(data);
};

//
// Remove duplicates from array
//

exports.removeDupes = function (array)
{
   return Array.from(new Set(array));
};

//
// Convert first letter in string to uppercase
//

exports.capitalize = function(string)
{
   return string.charAt(0).toUpperCase() + string.slice(1);
};

//
// Replace all matches in string
//

exports.replaceAll = function(str, search, replacement)
{
   return str.replace(new RegExp(search, "g"), replacement);
};

//
// Check for object type
//

exports.isObject = function(data)
{
   return !!data && data.constructor === Object;
};

//
// Extract unixtime from string
//

exports.getTimeFromStr = function(str)
{
   return (/\s*?\\?n?\[(\d*)\]/i).exec(str)[1];
};

//
// Remove unixtime from string
//

exports.remTimeFromStr = function(str, timestamp)
{
   return str.replace(`[${timestamp}]`, "");
};

//
// Sort array by specific key
//

exports.sortByKey = function(array, key)
{
   return array.sort(function(a, b)
   {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
   });
};

//
// Split string to array if not array
//

exports.arraySplit = function(input, sep)
{
   if (input.constructor === Array && input.length > 0)
   {
      return input;
   }
   return input.split(sep);
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


