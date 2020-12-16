const fs = require("fs");
const path = require("path");
const commands = require("./commands.js");
const helpers = require("./helpers.js");
const guilds = require("./guilds.js");
const strings = require("./strings.js");
const defer = require("promise-defer");
let bot = require("../bot.js");

//functions
function writeSetting(message, value, setting) {
  let guildSettingsPath = path.join(__dirname, "..", "stores", message.guild.id, "settings.json");
  let guildSettings = helpers.readFile(guildSettingsPath);
  guildSettings[setting] = value;
  message.channel.send("Okay, the value for this server's `" + setting + "` setting has been changed to `" + value + "`");
  helpers.writeGuildSpecific(message.guild.id, guildSettings, "settings");
}

function logId(message) {
  let guildSettingsPath = path.join(__dirname, "..", "stores", message.guild.id, "settings.json");
  let guildSettings = helpers.readFile(guildSettingsPath);
  let calendarId;
  if (message.content.toLowerCase().startsWith(guildSettings.prefix)) {
    calendarId = message.content.split(" ")[1];
  } else if (message.mentions.has(bot.client.user.id)) {
    calendarId = message.content.split(" ")[2];
  }
  if (!calendarId && !guildSettings.calendarID) {
    message.channel.send("Enter a calendar ID using `!id`, i.e. `!id 123abc@123abc.com`");
    return;
  }
  if (!calendarId) {
    message.channel.send("You didn't enter a calendar ID, you are currently using `" + guildSettings["calendarID"] + "`");
    return;
  }
  if (message.content.indexOf("@") === -1) {
    message.channel.send("I don\'t think that\'s a valid calendar ID.. try again");
    return;
  }
  if (guildSettings["calendarID"] !== "") {
    message.channel.send("I've already been setup to use ``" + guildSettings["calendarID"] + "`` as the calendar ID in this server, do you want to overwrite this and set the ID to `" + calendarId + "`? **(y/n)**");
    helpers.yesThenCollector(message).then(() => {
      writeSetting(message, calendarId, "calendarID");
    }).catch((err) => {
      helpers.log(err);
    });
  } else {
    writeSetting(message, calendarId, "calendarID");
  }
}

function logTz(message) {
  let guildSettingsPath = path.join(__dirname, "..", "stores", message.guild.id, "settings.json");
  let guildSettings = helpers.readFile(guildSettingsPath);
  const currentTz = guildSettings["timezone"];
  let tz;
  // parse timezone
  if (message.content.toLowerCase().startsWith(guildSettings.prefix)) {
    tz = message.content.split(" ")[1];
  } else if (message.mentions.has(bot.client.user.id)) {
    tz = message.content.split(" ")[2];
  }
  if (!tz) { // no input
    if (!currentTz) { // no timezone set
      return message.channel.send("Enter a timezone using `!tz`, i.e. `!tz America/New_York` or `!tz UTC+4` or `!tz EST` No spaces in formatting.");
    } else { // timezone set
      return message.channel.send("You didn't enter a timezone, you are currently using `" + currentTz + "`");
    }
  }
  // valid input
  if (helpers.validateTz(tz)) { // passes validation
    if (currentTz) { // timezone set
      message.channel.send("I've already been setup to use `" + currentTz + "`, do you want to overwrite this and use `" + tz + "`? **(y/n)** ");
      // collect yes
      helpers.yesThenCollector(message).then(() => {
        writeSetting(message, tz, "timezone");
      }).catch((err) => {
        helpers.log(err);
      });
    } else { // timezone is not set
      writeSetting(message, tz, "timezone");
    }
  } else { // fails validation
    return message.channel.send("Enter a timezone in valid format `!tz`, i.e. `!tz America/New_York` or `!tz UTC+4` or `!tz EST` No spaces in formatting.");
  }
}

function setPrefix(message) {
  let guildSettingsPath = path.join(__dirname, "..", "stores", message.guild.id, "settings.json");
  let guildSettings = helpers.readFile(guildSettingsPath);
  let newPrefix;
  if (message.content.toLowerCase().startsWith(guildSettings.prefix)) {
    newPrefix = message.content.split(" ")[1];
  } else if (message.mentions.has(bot.client.user.id)) {
    newPrefix = message.content.split(" ")[2];
  }
  if (!newPrefix) {
    return message.channel.send(`You are currently using \`${guildSettings.prefix}\` as the prefix. To change the prefix use \`!prefix <newprefix>\` or \`@ricky prefix <newprefix>\``);
  }
  if (newPrefix) {
    message.channel.send(`Do you want to set the prefix to \`${newPrefix}\` ? **(y/n)**`);
    helpers.yesThenCollector(message).then(() => {
      writeSetting(message, newPrefix, "prefix");
    }).catch((err) => {
      helpers.log(err);
    });
  }
}

function setRoles(message) {
  let guildSettingsPath = path.join(__dirname, "..", "stores", message.guild.id, "settings.json");
  let guildSettings = helpers.readFile(guildSettingsPath);
  let adminRole;
  if (message.content.toLowerCase().startsWith(guildSettings.prefix)) {
    adminRole = message.content.split(" ").slice(1).join(" ");
  } else if (message.mentions.has(bot.client.user.id)) {
    adminRole = message.content.split(" ").slice(2).join(" ");
  }
  let userRoles = message.member.roles.cache.map((role) => role.name);
  if (!adminRole && guildSettings.allowedRoles.length === 0) {
    return message.channel.send(strings.RESTRICT_ROLE_MESSAGE);
  }
  if (!adminRole) {
    return message.channel.send(`The admin role for this discord is \`${guildSettings.allowedRoles}\`. You can change this setting using \`${guildSettings.prefix}admin <ROLE>\`, making sure to spell the role as you've created it. You must have this role to set it as the admin role.\n\ You can allow everyone to use ricky again by entering \`${guildSettings.prefix}admin everyone\``);
  }
  if (adminRole) {
    if (["everyone", "Everyone", "EVERYONE"].includes(adminRole)) {
      message.channel.send("Do you want to allow everyone in this channel/server to use ricky? **(y/n)**");
      helpers.yesThenCollector(message).then(() => {
        writeSetting(message, [], "allowedRoles");
      }).catch((err) => {
        helpers.log(err);
      });
    } else if (!userRoles.includes(adminRole)) {
      return message.channel.send("You do not have the role you're trying to assign. Remember that adding Roles is case-sensitive");
    } else {
      message.channel.send(`Do you want to restrict the use of the calendar to people with the \`${adminRole}\`? **(y/n)**`);
      helpers.yesThenCollector(message).then(() => {
        writeSetting(message, [adminRole], "allowedRoles");
      }).catch((err) => {
        helpers.log(err);
      });
    }
  }
}

exports.run = function(message) {
  if (!helpers.checkPermissions(message)) {
    return helpers.log("no permission to send messages.");
  }
  let guildSettingsPath = path.join(__dirname, "..", "stores", message.guild.id, "settings.json");
  let guildSettings = helpers.readFile(guildSettingsPath);
  let cmd;
  if (message.content.toLowerCase().startsWith(guildSettings.prefix)) {
    cmd = message.content.toLowerCase().substring(guildSettings.prefix.length).split(" ")[0];
  } else if (message.mentions.has(bot.client.user.id)) {
    cmd = message.content.toLowerCase().split(" ")[1];
  }
  // Function Mapping
  let setup = () => message.channel.send(strings.SETUP_MESSAGE);
  let id = () => logId(message);
  let tz = () => logTz(message);
  let init = () => guilds.create(message.guild);
  let prefix = () => setPrefix(message);
  let admin = () => setRoles(message);
  let restricted = () => message.channel.send("You haven't finished setting up! Try `!setup` for details on how to start.");
  let help = () => message.channel.send(strings.SETUP_HELP);

  let cmdFns = {
    setup,
    id,
    tz,
    init,
    prefix,
    admin,
    help,
    "start": setup,
    "display": restricted,
    "clean": restricted,
    "update": restricted,
    "sync": restricted,
    "invite": restricted,
    "stats": restricted,
    "create": restricted,
    "scrim": restricted,
    "delete": restricted,
    "info": restricted
  };

  let cmdFn = cmdFns[cmd];
  if (cmdFn) {
    cmdFn();
  }
};
