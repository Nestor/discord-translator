const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("translator.db");

// -------------------
// Init/create tables
// -------------------

db.serialize(function()
{
   // Create servers table to store stats and settings

   db.run(`CREATE TABLE IF NOT EXISTS servers (
      id VARCHAR(32) NOT NULL PRIMARY KEY,
      lang VARCHAR(8),
      count INTEGER,
      active BOOLEAN
   )`);

   // Create tasks table (for auto translations)

   db.run(`CREATE TABLE IF NOT EXISTS tasks (
      origin VARCHAR(32),
      dest VARCHAR(32),
      server VARCHAR(32),
      active BOOLEAN,
      lang_to VARCHAR(8),
      lang_from VARCHAR(8)
   )`);
});

// -----------------------
// Add Server to Database
// -----------------------

exports.addServer = function(id, lang)
{
   const sql =
      "INSERT OR REPLACE INTO servers (id, lang, count, active) VALUES (" +
      `"${id}",` +
      `COALESCE((SELECT lang FROM servers WHERE id = "${id}"), "${lang}"),` +
      `COALESCE((SELECT count FROM servers WHERE id = "${id}"), 0),` +
      "1 );";

   db.serialize(function()
   {
      db.run(sql);
   });
};

// ------------------
// Deactivate Server
// ------------------

exports.removeServer = function(id)
{
   db.serialize(function()
   {
      db.run("UPDATE servers SET active = 0 WHERE id = ?", id);
   });
};

//db.close();
