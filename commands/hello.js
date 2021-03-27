module.exports = {
    "name": "hello",
    "description": "Says hello",
    "usage": "Hello [arg]",
    "args": true,
    execute(message, args) {
        return message.reply(`Hello ${args[0]}`);
    }
}