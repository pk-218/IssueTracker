const dotenv = require("dotenv").config();
const discord = require("discord.js");
const fs = require("fs");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const client = new discord.Client();
client.commands = new discord.Collection();
const prefix = process.env.PREFIX;
client.login(process.env.DISCORD_BOT_TOKEN);

client.on("ready", async () => {
    channel = await client.channels.fetch(process.env.CHANNEL_NUMBER);
    console.log("The client is running");
});

let channel;

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("message", (message) => {
    console.log(message);
    if (message.author.bot || !message.content.startsWith(prefix)) {
        return;
    }
    args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName))
        return msg.reply('No such command. Use `!help` to find more info');

    const command = client.commands.get(commandName);

    // check if required args are provided
    if (command.args && !args.length) {
        return message.reply("No arguments provided :(");
    }
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.on("githubMessage", (body) => {
    console.log(body);
    const action = body.action;
    const issueURL = body.issue.html_url;
    if (action == "opened") {
        const message = `New issue created: ${issueURL}`;
        channel.send(message);
    }
})


app.post("/github", async (req, res) => {
    console.log(req.body);
    client.emit("githubMessage", req.body);
    res.status(200).json({ result: "success" });
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})