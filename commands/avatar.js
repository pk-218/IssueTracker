module.exports = {
    "name": "avatar",
    "description": "Displays the message author's avatar",
    "usage": "avatar",
    execute(message, args) {
        return message.reply(message.author.displayAvatarURL());
    }
}