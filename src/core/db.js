const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL, {
  logging: null,
});
const autoTranslate = require("./auto");
const logger = require("./logger");

const Servers = db.define('servers', {
  id: {
    type: Sequelize.STRING(32),
    primaryKey: true,
		unique: true,
    allowNull: false,
	},
  lang: {
		type: Sequelize.STRING(8),
		defaultValue: "en",
	},
  count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	},
  active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
});

const Tasks = db.define('tasks', {
  origin: Sequelize.STRING(32),
  dest: Sequelize.STRING(32),
  reply: Sequelize.STRING(16),
  server: Sequelize.STRING(32),
  active: {
		type: Sequelize.BOOLEAN,
		defaultValue: 1,
	},
  lang_to: {
    type: Sequelize.STRING(8),
    defaultValue: "en",
  },
  lang_from: {
    type: Sequelize.STRING(8),
    defaultValue: "en",
  }
},
{
    indexes: [
        {
            unique: true,
            fields: ['origin', 'dest']
        }
    ]
});

// module.exports = {
//   Servers,
//   Tasks
// }

// -------------------
// Init/create tables
// -------------------

exports.initializeDatabase = function() {
  Servers.sync();
  Tasks.sync();

  // Add global server row
  Servers.upsert({ id: "bot", lang: "en" });
}

// ---------------
// Result Checker
// ---------------

// const results = function(err, res)
// {
//    if (err)
//    {
//       return logger("error", err);
//    }
//    return res;
// };

// -----------------------
// Add Server to Database
// -----------------------

exports.addServer = function(id, lang)
{

// try {
    // equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?);
    return Servers.create({
        id: id,
        lang: lang
    });
//     return logger("addServer", `Server ${new_server.id} added.`);
// }
// catch (e) {
//     if (e.name === 'SequelizeUniqueConstraintError') {
//         return logger("error", `Server ${new_server.id} already exists.`);
//     }
//     return logger("error", 'Something went wrong with adding a server.');
// }

};

// ------------------
// Deactivate Server
// ------------------

exports.removeServer = function(id)
{

  return Servers.update({ active: 0 }, { where: { id: id } }).complete( 
    function (err, result) {
      logger("error", err);
  });
  // if (serverRows < 1) {
  //   return logger("error", `Could not find a server with id: ${id} in the servers table.`);
  // }
  // const taskRows = await Tasks.update({ active: 0 }, { where: { server: id } });
  // if (taskRows < 1) {
  //   return logger("error", `Could not find server ${id} in the tasks table.`);
  // }

  // return logger("removeServer", `Server ${id} was deactivated.`);

};
// -------------------
// Update Server Lang
// -------------------

exports.updateServerLang = function(id, lang, cb)
{

  return Servers.update({ lang: lang }, { where: { id: id } }).complete( 
    function (err, result) {
      logger("error", err);
  });
  // if (serverRows < 1) {
  //   return logger("error", `Could not find a server with id: ${id} in the servers table.`);
  // }
  // return logger("updateServerLang", `Server ${id} language was changed to ${lang}.`);

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

  return Tasks.findAll({ where: { origin: id, active: 1 } }, {raw:true}).complete(
    function (err, result) {
      data.err = err;
      data.rows = result;
      autoTranslate(data);
  });

};

// --------------------------------
// Check if dest is found in tasks
// --------------------------------

exports.checkTask = function(origin, dest, cb)
{

   if (dest === "all") {
        return Tasks.findAll({ where: { origin: origin } }, {raw:true}).complete(
          function (err, result) {
            cb(err, result);
          });
    }

    return Tasks.findAll({ where: { origin: origin, dest: dest } }, {raw:true}).complete(
      function (err, result) {
        cb(err, result);
      });

};

// --------------------
// Remove Channel Task
// --------------------

exports.removeTask = function(origin, dest, cb)
{
   if (dest === "all")
   {
     // const deletedCount =
       return Tasks.destroy({ where: { [Op.or]: [{ origin: origin },{ dest: origin }] } }).complete(
         function (err, result) {
           cb(err);
         });;

       // if (!deletedCount) return logger("error", `Unable to stop all tasks for ${origin}`);
       //
       // return logger("removeTask", `Stopped all tasks for ${origin}`);

   }

   return Tasks.destroy({ where: { [Op.or]: [{ origin: origin, dest: dest },{ origin: dest, dest: origin }] } }).complete(
     function (err, result) {
       cb(err);
     });;

};

// --------------
// Get Task Count
// --------------

exports.getTasksCount = function(origin, cb)
{

  return Tasks.count({ where: {'origin': origin }}).then(c => {
    cb('', c);
  });

};

// ------------------
// Get Servers Count
// ------------------

exports.getServersCount = function(cb)
{

  return Servers.count().then(c => {
    cb('', c);
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


   Tasks.upsert({
     orign: ids[0],
     dest: ids[1],
     reply: task.reply + task.origin.slice(-3),
     server: task.server,
     active: 1,
     lang_to: langs[0],
     lang_from: langs[1],
   });

};

exports.addTask = function(task)
{

      task.dest.forEach(dest =>
      {
         taskSQL(task, dest), function(err)
         {
            results(err, this);
         }
         taskSQL(task, dest, true), function(err)
         {
            results(err, this);
         }
      });

};

// ------------
// Update stat
// ------------

exports.increaseServers = function(id)
{
  return Servers.increment('count', { where: { id: id }});
};

// --------------
// Get bot stats
// --------------

exports.getStats = function(cb)
{

  return db.query(`select * from (select sum(count) as "totalCount",` +
  `count(id)-1 as "totalServers" from servers),` +
  `(select count(id)-1 as "activeSrv" from servers where active = 1),` +
  `(select lang as "botLang" from servers where id = "bot"),` +
  `(select count(distinct origin) as "activeTasks"` +
  `from tasks where active = 1),` +
  `(select count(distinct origin) as "activeUserTasks"` +
  `from tasks where active = 1 and origin like "@%");`, { type: sequelize.QueryTypes.SELECT}).complete(
      function(err, result) {
        cb(err, result);
      }
    );

};

// ----------------
// Get server info
// ----------------

exports.getServerInfo = function(id, cb)
{

  return db.query( `select * from (select count as "count",` +
   `lang as "lang" from servers where id = ?),` +
   `(select count(distinct origin) as "activeTasks"` +
   `from tasks where server = ?),` +
   `(select count(distinct origin) as "activeUserTasks"` +
   `from tasks where origin like "@%" and server = ?);`, { replacements: [ id, id, id], type: sequelize.QueryTypes.SELECT}).complete(
      function(err, result) {
        cb(err, result);
      }
    );

};

// ---------
// Close DB
// ---------

exports.close = function()
{
   return db.close();
};
