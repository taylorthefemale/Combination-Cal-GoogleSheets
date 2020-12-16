
let settings = require("./settings.js");

const { ShardingManager } = require("discord.js");
const manager = new ShardingManager("./bot.js", { token: settings.secrets.bot_token });

manager.spawn() // spawn auto
manager.on("shardCreate", (shard) => {
  console.log(`Spawned shard ${shard.id}`);
});











/*
* Todo:
* - Can buy from store (subtract points from themselves)
* - People can buy emotes in exchange for points
* - Once 3 people have purchased an emote, then its available for everyone
* - Sassy responses for anyone who tries to abuse the system
* - Be able to add new cheevos names
*/


