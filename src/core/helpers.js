// =================
// Helper Functions
// =================

//
// Buffer end checker
//

exports.bufferEnd = function(arrOriginal, arrFinal)
{
   if (arrOriginal.length === arrFinal.length)
   {
      return true;
   }
   return false;
};

//
// Check user permission
//

exports.checkPerm = function(member, channel, perm)
{
   return channel.permissionsFor(member).has(perm);
};

//
// Get key name of object by its value
//

exports.getKeyByValue = function (object, value)
{
   return Object.keys(object).find(key => object[key] === value);
};

//
// Remove duplicates from array
//

exports.removeDupes = function (array)
{
   return Array.from(new Set(array));
};

//
// Replace all matches in string
//

exports.replaceAll = function(str, search, replacement)
{
   return str.replace(new RegExp(search, "g"), replacement);
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
// Split string to chunks
//

exports.chunkString = function(str, len)
{
   var _size = Math.ceil(str.length/len);
   var _ret = new Array(_size);
   var _offset;

   for (var _i=0; _i<_size; _i++)
   {
      _offset = _i * len;
      _ret[_i] = str.substring(_offset, _offset + len);
   }

   return _ret;
};
