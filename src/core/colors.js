// -------
// Colors
// -------

const colors = {
   info: 41215,
   warn: 16764928,
   error: 13107200,
   ok: 5299300
};

// ----------
// Get color
// ----------

exports.get = function(color)
{
   if (colors.hasOwnProperty(color))
   {
      return colors[color];
   }
   return color;
};

// ------------------------------------
// Convert RGB color to decimal number
// ------------------------------------

exports.rgb2dec = function(rgb)
{
   return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
};
