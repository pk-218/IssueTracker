const axios = require("axios");

module.exports = {
    name: 'issues',
    description: "Shows the open issues of a repo",
    usage: 'issues <repo_owner_name> <repo_name>',
    args: true,
    async execute(message, args) {
        owner = args[0];
        repo = args[1];
        try {
            const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`,
                {
                    headers: {
                        Accept: "application/vnd.github.v3+json"
                    }
                }
            )
            // Why did we do this? https://docs.github.com/en/rest/reference/issues#list-repository-issues
            const data = response.data.filter((issue) => !(issue.hasOwnProperty("pull_request")))
            if (data.length > 0) {
                message.channel.send(`Okay, showing all open issues from ${repo} owned by ${owner}`);
                for (let i = 0; i < data.length; i += 1) {
                    message.channel.send(data[i].html_url);
                }
            } else {
                message.channel.send(`Sorry, looks like the repository ${owner}/${repo} has no open issues`);
            }

        } catch (error) {
            const statusCode = error.response.status;
            switch (statusCode) {
                case 404:
                    message.channel.send(`Sorry, looks like the repository ${owner}/${repo} doesn't exist`);
                    break;
                case 301:
                    message.channel.send(`Sorry, looks like the repository ${owner}/${repo} has moved permanently`);
                    break;
                case 422:
                    message.channel.send(`Sorry, this is an unprocessable entity`);
                    break;
            }
        }

    }
}