/*eslint-disable*/
//
// Buffer resolved async promises
//

exports.buffer = function(arg, data = false)
{
   const bufferArgs = {
      "len": function()
      {
         return bufferQueue.length;
      },
      "arr": function()
      {
         return bufferQueue;
      },
      "push": function()
      {
         bufferQueue.push(data);
      },
      "reset": function()
      {
         bufferQueue = [];
      }
   };
   if (bufferArgs.hasOwnProperty(arg))
   {
      return bufferArgs[arg]();
   }
};
