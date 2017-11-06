const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("discord_translator");

module.exports = function()
{
   return console.log(db);
};
