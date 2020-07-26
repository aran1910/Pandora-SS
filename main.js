//Made by YeahDudeThatsNarly#6969 on discord.

// Important Varibles
const Discord = require('discord.js');
const roblox = require('noblox.js');
const client = new Discord.Client();


// Config Varibles
const token = 'Enter your discord bot token here'; // The token that the bot uses to login to Discord
const prefix = ';'; // The prefix that bot listens to when it listens for commands
const cookie = 'Enter roblox account cookie';
const username = 'Enter roblox account username'; // The username that the bot uses to login to Roblox, only used if the cookie isn't valid
const password = 'enter roblox account password'; // The password that the bot uses to login to Roblox, only used if the cookie isn't valid
const groupid = 7121097; // The group that the bot manages. Change 1 to your group id
const maximumRank = 25; // The maximum rank that the bot can rank to. Change 1 to your maxium rank
const command = 'Command that whitelisted user here'; // The command that the bot listens to. This must be lowercase
const whitelistedRole = 'Role that can whitelist themself' // The role the can use the command

// Main code (DO NOT EDIT UNLESS YOU KNOW WHAT YOUR DOING)

async function cookieLogin() {
    try {
        await roblox.cookieLogin(cookie);
    } catch (err) {
        login();
        return console.log('There was an error while logging into the account with the cookie: ' + err + ' Attempting to login with username and password...');
    }
    return console.log('Logged in!');
}

async function login() {
    try {
        await roblox.login(username, password); // I know login sometimes throws a captcha, but that only happens when you spam it!
    } catch (err) {
        return console.log('There was an error while loggin in to the account with the username and password: ' + err);
    }
    return console.log('Logged in!');
}

function isCommand(command, message){
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}

client.on('ready', async () => {
    await cookieLogin();
});

client.on('message', async message => {
    if(message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    if(isCommand(command, message)) {
        if(!message.member.roles.cache.some(role =>[whitelistedRole].includes(role.name))) {
            return message.channel.send("You don't have permission to run this command!");
        }
        let username = args[1];
        if(!username) {
            return message.channel.send("Please Enter A Second Argument");
        }
        let id;
        try {
            id = await roblox.getIdFromUsername(username);
        } catch {
            return message.channel.send("This isn't a valid username!");
        }
        let oldRankId = await roblox.getRankInGroup(groupid, id);
        if(oldRankId == 0) {
            return message.channel.send("This user isn't in the group!");
        }
        if(oldRankId >= maximumRank) {
            return message.channel.send("I can't manage this user!");
        }
        let oldRankName = await roblox.getRankNameInGroup(groupid, id);
        try {
            await roblox.setRank(groupid, id, 2);
            message.member.roles.add('736296002570682378')
  .then(console.log)
  .catch(console.error);
            
        } catch (err) {
            return message.channel.send("There was an error while ranking this user: " + err);
        }
        return message.channel.send('Success! You Have Been Ranked Enjoy.');
    }
});

client.login(token);