require('dotenv').config();
let discord = require("discord.js");
let client = new discord.Client();
exports.discord = discord;
exports.client = client;
const path = require("path");
const users = require("./stores/users.json");
let settings = require("./settings.js");
let commands = require("./handlers/commands.js");
let guilds = require("./handlers/guilds.js");
let init = require("./handlers/init.js");
let helpers = require("./handlers/helpers.js");
let restricted = require("./handlers/nopermissions.js");
let dm = require("./handlers/dm.js");
let checks = require("./handlers/createMissingAttributes.js");
const Discord = require('discord.js');
//const client = new Discord.Client();
const fs = require('fs');

const PREFIX = 'ricky';

function addMissingGuilds(availableGuilds) {
  //Create databases for any missing guilds
  const knownGuilds = Object.keys(helpers.getGuildDatabase());
  const unknownGuilds = availableGuilds.filter(x => !knownGuilds.includes(x));
  unknownGuilds.forEach((guildId) => {
    helpers.log("unknown guild found; creating");
    guilds.create(client.guilds.cache.get(guildId));
  })
}
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) { // Setup each command for client
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//client.once('ready', () => {
  //console.log(`Logged in as ${client.user.tag}!`)
//});

client.login(settings.secrets.bot_token);

client.on("ready", () => {
  helpers.log(`Bot is logged in. Shard: ${client.shard.ids}`);
  client.user.setStatus("online");
  // fetch all guild cache objects
  client.shard.fetchClientValues("guilds.cache")
      .then(results => {
        const shardGuilds = [];
        results.forEach(function (item) { // iterate over shards
          item.forEach(function (item) { // iterate over servers
            shardGuilds.push(item.id); // add server id to shardGuilds
          });
        })
        addMissingGuilds(shardGuilds); // start adding missing guilds
        helpers.log("all shards spawned"); // all shards spawned
      })
      .catch((err) => {
        if (err.name === "Error [SHARDING_IN_PROCESS]") {
          console.log("spawning shards ..."); // send error to console - still sharding
        }
      });
    });

client.on("guildCreate", (guild) => {
  guilds.create(guild);
});

client.on("guildDelete", (guild) => {
  guilds.delete(guild);
});

client.on("message", (message) => {
  if (message.author.bot) {
    return;
  }
  if (message.channel.type === "dm") {
    try {
      dm.run(message);
    } catch (err) {
      helpers.log("error in dm channel" + err);
    }
    return;
  }
  //only load guild settings after checking that message is not direct message.
  let guildSettingsPath = path.join(__dirname, "stores", message.guild.id, "settings.json");
  try {
    var guildSettings = helpers.readFile(guildSettingsPath);
  } catch (err) {
    return helpers.log(err);
  }
  //Check that there is a prefix - need more robust check of database files.
  try {
    (guildSettings.prefix);
  } catch (err) {
    guilds.create(message.guild);
    message.channel.send("Sorry, I've had to re-create your database files, you'll have to run the setup process again :(");
    return helpers.log("settings file not created properly in guild: " + message.guild.id + ". Attempted re-creation");
  }
  //Check calendar file becoming corrupted.
  try {
    let calendarID = guildSettings.calendarID;
    let calendarPath = path.join(__dirname, "stores", message.guild.id, "calendar.json");
    let calendar = helpers.readFile(calendarPath);
    (calendar.day0);
  } catch (err) {
    guilds.create(message.guild);
    message.channel.send("Sorry, the database for this server had to be re-created, you'll have to run the setup process again :(");
    return helpers.log("calendar file not created properly in guild: " + message.guild.id + ". Attempted re-creation");
  }
  //Check if the database structure is up to date.
  try {
    if (checks.allowedRoles(message)) {
      return message.channel.send("Sorry, I just had to update your database files. Please try again.");
    }
  } catch (err) {
    return helpers.log(err);
  }
  //Ignore messages that dont use guild prefix or mentions.
  if (!message.content.toLowerCase().startsWith(guildSettings.prefix) && !message.mentions.has(client.user.id)) {
    return;
  }
  //Ignore if the command isn't one of the commands.
  let cmd;
  if (message.content.toLowerCase().startsWith(guildSettings.prefix)) {
    cmd = message.content.toLowerCase().substring(guildSettings.prefix.length).split(" ")[0];
  } else if (message.mentions.has(client.user.id)) {
    cmd = message.content.toLowerCase().split(" ")[1];
  }
  if (!restricted.allCommands.includes(cmd)) {
    return;
  } else {
    helpers.log(`${helpers.fullname(message.author)}:${message.content} || guild:${message.guild.id} || shard:${client.shard.ids}`);
  }
  if (!helpers.checkPermissions(message) && (!users[message.author.id] || users[message.author.id].permissionChecker === "1" || !users[message.author.id].permissionChecker)) {
    if (restricted.allCommands.includes(cmd)) {
      if (!helpers.checkRole(message)) {
        return message.channel.send("You must have the `" + guildSettings.allowedRoles[0] + "` role to use ricky in this server");
      }
      try {
        restricted.run(message);
      } catch (err) {
        helpers.log("error in restricted permissions " + err);
      }
      return;
    }
  } else if (!helpers.checkPermissions(message)) {
    return;
  }
  if (!guildSettings.calendarID || !guildSettings.timezone) {
    try {
      if (!helpers.checkRole(message)) {
        return message.channel.send("You must have the `" + guildSettings.allowedRoles[0] + "` role to use ricky in this server")
      }
      init.run(message);
    } catch (err) {
      helpers.log("error running init messages in guild: " + message.guild.id + ": " + err);
      return message.channel.send("I'm having issues with this server - please try kicking me and re-inviting me!");
    }
  } else {
    try {
      if (!helpers.checkRole(message)) {
        return message.channel.send("You must have the `" + guildSettings.allowedRoles[0] + "` role to use ricky in this server")
      }
      commands.run(message);
    } catch (err) {
      return helpers.log("error running main message handler in guild: " + message.guild.id + ": " + err);
    }
  }
});
client.on('message', msg => {
  const content = msg.content;
  const parts = content.split(' ');
  const humans = ['first', 'last', 'age', 'year'];

  if (parts[0] != PREFIX) { return; }
  if (parts.length === 1) { msg.reply("If you ain\'t first, you\'re last!"); }

  if (msg.content === 'ricky list names') {
    client.commands.get('showNames').execute(msg);
  }
  /**else if (parts[1] === 'list' && humans.some(v => content.includes(v))) {
    if (parts[2] === 'first')
      client.commands.get('ageYear').execute(msg)
    else if (parts[2] === 'last')
      client.commands.get('lastName').execute(msg)
    else if (parts[2] === 'age')
      client.commands.get('personAge').execute(msg)
    else if (parts[2] === 'year')
      client.commands.get('yearBorn').execute(msg);
    }
  else if (parts[1] === 'list' && humans.some(v => content.includes(v))) {
  if (parts.indexOf('first') === 2)
    client.commands.get('ageYear').execute(msg)
  else if (parts.indexOf('first') === 3)
    client.commands.get('ageYear').execute(msg)
  else if (parts.indexOf('first') === 4)
    client.commands.get('ageYear').execute(msg)
    else if (parts.indexOf('last') === 2)
      client.commands.get('lastName').execute(msg)
    else if (parts.indexOf('last') === 3)
      client.commands.get('lastName').execute(msg)
    else if (parts.indexOf('last') === 4)
      client.commands.get('lastName').execute(msg)
    else if (parts.indexOf('age') === 2)
      client.commands.get('personAge').execute(msg)
    else if (parts.indexOf('age') === 3)
      client.commands.get('personAge').execute(msg)
    else if (parts.indexOf('age') === 4)
      client.commands.get('personAge').execute(msg)
    else if (parts.indexOf('year') === 2)
      client.commands.get('yearBorn').execute(msg)
    else if (parts.indexOf('year') === 3)
      client.commands.get('yearBorn').execute(msg)
    else if (parts.indexOf('year') === 4)
      client.commands.get('yearBorn').execute(msg)
  }
  else if (parts[1] === 'list' && humans.some(v => content.includes(v))) {
    content.forEach(function (item, index) {
      console.log(item, index)
    });
  }*/
  else if (parts[1] === 'add' && parts[2] != null
    && parts[3] === 'to' && parts[4] != null) {
    client.commands.get('addScore').execute(msg, (parts[2]), parts[4]);
  }
  else if (parts[1] === 'subtract' && parts[2] != null
    && parts[3] === 'to' && parts[4] != null) {
    client.commands.get('subtractScore').execute(msg, parseInt(parts[2]), parts[4]);
  }
  else if (parts[1] === 'add' && parts[2] === 'member' && parts[3] != null) {
    client.commands.get('addMember').execute(msg, parts[3]);
  }
  else if (parts[1] === 'remove' && parts[2] === 'member' && parts[3] != null) {
    client.commands.get('removeMember').execute(msg, parts[3]);
  }

})
// ProcessListeners
process.on("uncaughtException", (err) => {
  helpers.log("uncaughtException error" + err);
  process.exit();
});

process.on("SIGINT", () => {
  client.destroy();
  process.exit();
});

process.on("exit", () => {
  client.destroy();
  process.exit();
});

process.on("unhandledRejection", (err) => {
  helpers.log("Promise Rejection: " + err);
  // watch for ECONNRESET
  if (err.code === "ECONNRESET") {
    helpers.log("Connection Lost, Signalling restart");
    process.exit();
  }
});
//client.login(process.env.BOT_TOKEN)
