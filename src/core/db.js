const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.cached.Database("./translator.db");
const autoTranslate = require("./auto");
const logger = require("./logger");

// -------------------
// Init/create tables
// -------------------

db.serialize(function()
{
   // Create servers table to store stats and settings

   db.run(`create table if not exists servers (
      id varchar(32) not null primary key,
      lang varchar(8) default "en",
      count integer default 0,
      active boolean default 1
   )`);

   // Create tasks table (for auto translations)

   db.run(`create table if not exists tasks (
      origin varchar(32),
      dest varchar(32),
      reply varchar(16),
      server varchar(32),
      active boolean default 1,
      lang_to varchar(8) default "en",
      lang_from varchar(8) default "en",
      unique(origin, dest)
   )`);

   // Add global server row

   db.run(`insert or replace into servers (id, lang) values ("bot", "en")`);
});

// ---------------
// Result Checker
// ---------------

const results = function(err, res)
{
   if (err)
   {
      return logger("error", err);
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

   return db.serialize(function()
   {
      db.run("begin transaction");
      db.run(sql);
      db.run("update tasks set active = 1 where server = ?", id);
      db.run("end");
   });
};

// ------------------
// Deactivate Server
// ------------------

exports.removeServer = function(id)
{
   return db.serialize(function()
   {
      db.run("begin transaction");
      db.run("update servers set active = 0 where id = ?", id);
      db.run("update tasks set active = 0 where server = ?", id);
      db.run("end");
   });
};
// -------------------
// Update Server Lang
// -------------------

exports.updateServerLang = function(id, lang, cb)
{
   return db.serialize(function()
   {
      db.run(
         `update servers set lang = "${lang}" where id = "${id}"`,
         function(err)
         {
            cb(err);
         }
      );
   });
};

// ------------------
// Get Channel Tasks
// ------------------

exports.channelTasks = function(data)
{
   var id = data.message.channel.id;

   if (data.message.channel.type === "dm")
   {
      id = "@" + data.message.author.id;
   }

   return db.serialize(function()
   {
      db.all(
         `select dest, reply, lang_to, lang_from from tasks` +
         ` where origin = "${id}" and active = "1"`,
         function(err, rows)
         {
            data.err = err;
            data.rows = rows;
            autoTranslate(data);
         }
      );
   });
};

// --------------------------------
// Check if dest is found in tasks
// --------------------------------

exports.checkTask = function(origin, dest, cb)
{
   var destWhere = ` and dest = "${dest}";`;

   if (dest === "all")
   {
      destWhere = ";";
   }

   return db.serialize(function()
   {
      db.all(
         `select active from tasks where ` +
         `origin = "${origin}"` + destWhere,
         function(err, rows)
         {
            cb(err, rows);
         }
      );
   });
};

// --------------------
// Remove Channel Task
// --------------------

exports.removeTask = function(origin, dest, cb)
{
   if (dest === "all")
   {
      return db.serialize(function()
      {
         db.run(
            `delete from tasks where (origin = "${origin}") or` +
            `(dest = "${origin}");`,
            function(err)
            {
               cb(err);
            }
         );
      });
   }

   return db.serialize(function()
   {
      db.run(
         `delete from tasks where (origin = "${origin}" and dest = "${dest}")` +
         `or (origin = "${dest}" and dest = "${origin}");`,
         function(err)
         {
            cb(err);
         }
      );
   });
};

// --------------
// Get Row Count
// --------------

exports.getCount = function(table, row, val, cb)
{
   return db.serialize(function()
   {
      db.get(
         `select count(${row}) from ${table} where ${row} = "${val}"`,
         function(err, row)
         {
            cb(err, row);
         }
      );
   });
};

// ------------------
// Get Servers Count
// ------------------

exports.getServersCount = function(cb)
{
   return db.serialize(function()
   {
      db.get(
         `select count(id) as count from servers`,
         function(err, row)
         {
            cb(err, row);
         }
      );
   });
};

// ---------
// Add Task
// ---------

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

   const reply = task.reply + task.origin.slice(-3);

   const sql =
   `insert or replace into tasks (` +
       `origin, dest, reply, server, active, lang_to, lang_from` +
   `) values (` +
       `"${ids[0]}",` +
       `"${ids[1]}",` +
       `"${reply}",` +
       `"${task.server}",` +
       `"1", "${langs[0]}", "${langs[1]}"` +
   `);`;

   return sql;
};

exports.addTask = function(task)
{
   return db.serialize(function()
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

// ------------
// Update stat
// ------------

exports.increase = function(table, key, val, stat)
{
   return db.serialize(function()
   {
      db.run(
         `update ${table} set ${stat} = ${stat} + 1 where ${key} = "${val}";`
      );
   });
};

// --------------
// Get bot stats
// --------------

exports.getStats = function(cb)
{
   return db.serialize(function()
   {
      db.get(
         `select * from (select sum(count) as "totalCount",` +
         `count(id)-1 as "totalServers" from servers),` +
         `(select count(id)-1 as "activeSrv" from servers where active = 1),` +
         `(select lang as "botLang" from servers where id = "bot"),` +
         `(select count(distinct origin) as "activeTasks"` +
         `from tasks where active = 1),` +
         `(select count(distinct origin) as "activeUserTasks"` +
         `from tasks where active = 1 and origin like "@%");`,
         function(err, row)
         {
            cb(err, row);
         }
      );
   });
};

// ----------------
// Get server info
// ----------------

exports.getServerInfo = function(id, cb)
{
   return db.serialize(function()
   {
      db.get(
         `select * from (select count as "count",` +
         `lang as "lang" from servers where id = "${id}"),` +
         `(select count(distinct origin) as "activeTasks"` +
         `from tasks where server = "${id}"),` +
         `(select count(distinct origin) as "activeUserTasks"` +
         `from tasks where origin like "@%" and server = "${id}");`,
         function(err, row)
         {
            cb(err, row);
         }
      );
   });
};

// ---------
// Close DB
// ---------

exports.close = function()
{
   return db.close();
};
