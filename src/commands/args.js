const langCheck = require("../core/lang.check");

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
         return match[1].replace(/\s/igm, "").split(",");
      }
      return match[1];
   }
   return null;
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

   const hasContent = (/([^:]*):(.*)/).exec(msg);

   if (hasContent)
   {
      output.main = hasContent[1].trim();
      output.content = hasContent[2].trim();
   }

   const sepIndex = output.main.indexOf(" ");

   if (sepIndex > -1)
   {
      output.params = output.main.slice(sepIndex + 1);
      output.main = output.main.slice(0, sepIndex);
   }

   if (output.main.startsWith("<"))
   {
      output.auto = output.main.slice(1,-1);
      output.main = "auto";
   }

   output.to = langCheck(extractParamVal("to", output.params, true));

   output.from = langCheck(extractParamVal("from", output.params));

   output.for = extractParamVal("for", output.params, true);

   console.log(output);
   return output;
};
