const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("translator.db");

// -------------------
// Init/create tables
// -------------------

db.serialize(function()
{
   // Create servers table to store stats and settings

   db.run(`create table if not exists servers (
      id varchar(32) not null primary key,
      lang varchar(8),
      count integer,
      active boolean
   )`);

   // Create tasks table (for auto translations)

   db.run(`create table if not exists tasks (
      origin varchar(32),
      dest varchar(32),
      server varchar(32),
      active varchar,
      lang_to varchar(8),
      lang_from varchar(8),
      unique(origin, dest)
   )`);
});

// -------------------
// Result Checker
// -------------------

const results = function(err, res)
{
   if (err)
   {
      return console.error(err);
   }
   return res;
};

// -----------------------
// Add Server to Database
// -----------------------

exports.addServer = function(id, lang)
{
   const sql =
      `insert or replace into servers (id, lang, count, active) values (` +
      `"${id}",` +
      `coalesce((select lang from servers where id = "${id}"), "${lang}"),` +
      `coalesce((select count from servers where id = "${id}"), 0),` +
      `1 );`;

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
      db.run("update `servers` set active = 0 where `id` = ?", id);
   });
};

// ------------------
// Add Task
// ------------------

const taskSQL = function(task, dest, flip = false)
{
   var ids = [task.origin, dest];
   var langs = [task.to, task.from];

   if (task.origin === dest)
   {
      langs = [langs[0], langs[1]];
   }

   if (flip && task.origin !== dest)
   {
      ids.reverse();
      langs.reverse();
   }

   const sql =
   `insert or replace into tasks (` +
       `origin, dest, server, active, lang_to, lang_from` +
   `) values (` +
       `"${ids[0]}",` +
       `"${ids[1]}",` +
       `"${task.server}",` +
       `"1", "${langs[0]}", "${langs[1]}"` +
   `);`;

   return sql;
};

exports.addTask = function(task)
{
   db.serialize(function()
   {
      db.run("begin transaction");
      task.dest.forEach(dest =>
      {
         db.run(taskSQL(task, dest), function(err)
         {
            results(err, this);
         });
         db.run(taskSQL(task, dest, true), function(err)
         {
            results(err, this);
         });
      });
      db.run("end");
   });
};

//db.close();
