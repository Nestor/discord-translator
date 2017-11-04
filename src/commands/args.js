const langCheck = require("../core/lang.check");
const fn = require("../core/helpers");

// ---------------------------------------
// Extract a parameter's value with regex
// ---------------------------------------

const extractParamVal = function(key, str, allowArray = false)
{
   const rgx = new RegExp(`${key}\\s*((?:(?:\\S*\\s*,\\s*)+\\S*)|\\S*)`, "m");

   const match = rgx.exec(str);

   if (match)
   {
      if (allowArray)
      {
         return fn.removeDupes(match[1].replace(/\s/igm, "").split(","));
      }
      return match[1];
   }
   return "default";
};

// --------------------
// Extract number param
// --------------------

const extractNum = function(str)
{
   const rgx = new RegExp("(?:^\\s*(-?\\d+))|(?:[^,]\\s*(-?\\d+))", "im");

   const match = rgx.exec(str);

   if (match)
   {
      if (match[1])
      {
         return match[1];
      }
      return match[2];
   }
   return null;
};

// ------------------
// Check for content
// ------------------

const checkContent = function(msg, output)
{
   const hasContent = (/([^:]*):(.*)/).exec(msg);

   if (hasContent)
   {
      output.main = hasContent[1].trim();
      output.content = hasContent[2].trim();
   }
};

// ------------------
// Get main arg
// ------------------

const getMainArg = function(output)
{
   const sepIndex = output.main.indexOf(" ");

   if (sepIndex > -1)
   {
      output.params = output.main.slice(sepIndex + 1);
      output.main = output.main.slice(0, sepIndex);
   }
};

// --------------------------------------
// Analyze arguments from command string
// --------------------------------------

module.exports = function(msg)
{
   var output = {
      main: msg,
      params: null
   };

   checkContent(msg, output);

   getMainArg(output);

   if (output.main === "channel")
   {
      output.auto = output.main;
      output.main = "auto";
   }

   output.to = langCheck(extractParamVal("to", output.params, true));

   output.from = langCheck(extractParamVal("from", output.params));

   output.for = extractParamVal("for", output.params, true);

   output.num = extractNum(output.params);

   console.log(output);
   return output;
};
