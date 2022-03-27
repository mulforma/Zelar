<p align="center">
  <a href="https://x.vvx.bar/XVlBzg/">
    <img src="/docs/logo.png" height="96" width="96" style="border-radius: 9999px" />
    <h2 align="center">
      𝗧𝗛𝗘 𝗡𝗜𝗡𝗧𝗢𝗗 𝗣𝗥𝗢𝗝𝗘𝗖𝗧
    </h2>
  </a>
  <p align="center">
    A simple, open-source, free, fast, secure, and reliable discord bot. <br>
  </p>
  <div style="display: flex; flex-wrap: wrap; justify-items: center; justify-content: center">
    <img src="https://wakatime.com/badge/user/5cb7cd14-ac7e-4fc0-9f81-6036760cb6a3/project/43c4defc-5916-4bc2-aca5-0683f99c9e2d.svg" />
    <a href="https://github.com/tinvv/Nintod/pulse"><img src="https://img.shields.io/github/commit-activity/m/badges/shields" /></a>
    <a href="https://www.codefactor.io/repository/github/thevvx/nintod"><img src="https://www.codefactor.io/repository/github/thevvx/nintod/badge" /></a>
    <img src="https://img.shields.io/node/v/discord.js?style=plastic" />
    <img src="https://img.shields.io/github/license/thevvx/nintod" />   
    <img src="https://img.shields.io/github/languages/top/thevvx/nintod" />
    <a href="https://tinvv.tech/discord/"><img src="https://img.shields.io/discord/828842616442454066" /></a>
    <a href="https://deepsource.io/gh/thevvx/Nintod/?ref=repository-badge}" target="_blank"><img alt="DeepSource" title="DeepSource" src="https://deepsource.io/gh/thevvx/Nintod.svg/?label=active+issues&show_trend=true&token=QMU7qTxWjqwrQ5m1G50_SD5C"/></a>
    <a href="https://deepsource.io/gh/thevvx/Nintod/?ref=repository-badge}" target="_blank"><img alt="DeepSource" title="DeepSource" src="https://deepsource.io/gh/thevvx/Nintod.svg/?label=resolved+issues&show_trend=true&token=QMU7qTxWjqwrQ5m1G50_SD5C"/></a>
  </div>
</p>

## Why should I use it?

It has **a lot** of functionality and commands! We are currently working on a lot of features (but we are also working on a lot of bugs too).
Not only that, Nintod is also **Free** and also **Open Source**. Who still have to pay for a bot? It's also **Easy To Use**. with a simple command.
The source code is well-documented and easy to understand (Because we write comments in the code, all lines).
Because of Nintod is community driven, people like **You** can help us to improve the bot or even make up your own commands!
And giving that Nintod is **Open Source**, that means, more functionality and commands can be added in the future! 
It's just like killing two birds with one stone! You can help us by contributing to the project. Because we love open-source, isn't that right?
Some command uses vvx services like `short` command that use [XURLShortener](https://github.com/thevvx/xurlsh) which is also **Open Source**. 
What that means is that you can also edit the 3rd party code and it *may* improve the bot performance.

## Is there a community or support server?

Surely the community is the most important thing in **Open Source** thingy. If we don't have a community, the Open Source thing will be useless.
That's why we have a Discord server! You can join it and ask questions, share your ideas, and help us to improve the bot.
If you want to join the server, you can join it at [HERE](https://x.vvx.bar/XVlBzg/). You can send a bug issues or report in 
`#bug-report` channel, but don't send a serious security issue to the server. Because it is a public server, and
it is not safe to send a security issue to the server. You would have to send a mail to `contact@vvx.bar` ASAP to not impact any servers or users that use the bot. 

## How can I contribute?

You can contribute to the project by [fork](https://github.com/thevvx/Nintod/fork) the repository, and make a [pull request](https://github.com/thevvx/Nintod/pulls).
Major and minor changes are welcome! It is our goal to make the bot better and more stable. No matter who you are, you can help us!
But make sure you follow the [Code of Conduct](/.github/CODE_OF_CONDUCT.md) and [Contributing](/.github/CONTRIBUTING.md) guidelines.
Please don't send any security issue to the server as stated above. We use [DeepSource](https://deepsource.io/) and [CodeFactor](https://codefactor.io/) to monitor the quality of the code.
If all the test is pass, it is more likely your pull request will get merge to the main branch first.

## How can I host the bot?

You can host the bot on your own server. You can host it on your own server, and it will be free to host. But
if you don't want to open your server 24/7, you can host it on a cloud services. Just like us! We use [Microsoft Azure](https://azure.microsoft.com/en-us/services/app-service/).
for hosting the current version of the bot. You also have another options rather than azure, too. There are many major
cloud services provider like [Amazon Web Services](https://aws.amazon.com/), [Google Cloud](https://cloud.google.com/), [Digital Ocean](https://www.digitalocean.com/),
and [Heroku](https://www.heroku.com/).
Amazon has a free instance (t2.micro) for a year that is enough for the bot.
Google Cloud Platform also has a free forever instance (f1-micro) that you can use for hosting the bot. However, you need
to add billing to your Google Cloud account.
And Microsoft Azure that we are using, offers a free credits ($100 for students, $300 for users that have verified with their credit card). And students pack
has free B1s instance for a year.

- [Node.js (v16.6.0 or above)](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/) (preferred over npm) or other node package manager
- [Python 3.6](https://www.python.org/) or above. This will usually come with node installer for windows if you accept to install **Tools for native modules** (For `@discordjs/opus` library)
- [Visual Studio C++ Build Tools](https://www.visualstudio.com/en-us/products/visual-studio-code) This will usually come with node installer for windows if you accept to install **Tools for native modules** (For `@discordjs/opus` library)
- [Database (CockroachDB or Postgres)](https://www.cockroachlabs.com/), You can get a free account on [CockroachDB](https://www.cockroachlabs.com/) choosing serverless options.
- [Docker](https://www.docker.com/) (This is purely optional, but recommended for those who already have Docker installed)

Then install the required dependencies by running this:

```bash
$ pnpm install # It will install all the dependencies
```

Then you have to build the typescript files first

```bash
$ pnpm run build && pnpm run postbuild # This will build the typescript file and copy the files to the `dist` folder
```

If you don't want to run script every time you make a change, you could run this instead
```bash
$ pnpm run build:watch # It will watch for changes and build the typescript file
```

After that, you could cd to the `dist` directory

```bash
$ cd dist # Change to the `dist` directory
```

Also don't forget to change `.env.example` to `.env` and insert your data. Then deploy the command by running

```bash
$ node deploy # This will deploy the bot commands
```

And run the bot

```bash
$ pnpm start # You can use pnpm dev for development (Recommended if you also use build:watch too)
```

## License

This project is licensed under the [Apache 2.0](/LICENSE) license.

## Commands
 
#### Economics
- `balance` - Check your balance
- `buy` - Buy a item
- `daily` - Get your daily reward
- `item` - Get item information
- `sell` - Sell an item
- `send` - Send an item to someone
- `shop` - Get shop information
- `weekly` - Get your weekly reward
- `work` - Work and earn money

#### Fun
- `fast` - Answer with fast responses
- `meme` - Get a random meme
- `tic-tac-toe` - Play a game of tic-tac-toe
- `word` - Play a word game!
- `xkcd` - Get a random xkcd comic

#### Game
- `bet` - Choose a number between 1 - 10 and bet on it
- `coin-flip` - Flip a coin
- `fishing` - Catch a fish
- `rob` - Rob someone
- `rps` - Play a game of rock-paper-scissors
- `trivia` - Play a game of trivia

#### Image
- `beautiful` - How beautiful are you in percentage?
- `deepfry` - Deepfry an image
- `handsome` - How handsome are you in percentage?
- `magik` - Make an image distort
- `triggered` - Make an image triggered

#### Miscellaneous
- `avatar` - Get your avatar
- `bot-stats` - Get bot information and statistics
- `help` - Get help
- `info` - Get information about the server or user
- `ping` - Get the bots ping

#### Moderation
- `ban` - Ban a user
- `channel` - Create or remove a channel
- `kick` - Kick a user
- `role` - Add or remove a role from a user
- `timeout` - Timeout a user
- `unban` - Unban a user

#### Music
- `loop` - Set the loop mode
- `now-playing` - Get the current song
- `pause` - Pause the music
- `play` - Play a song
- `progress` - Get the progress of the music
- `queue` - Get the queue
- `remove` - Remove a song from the queue
- `resume` - Resume the music
- `skip` - Skip the current song

#### NSFW
- `danbooru` - Get a random image from Danbooru
- `hentai` - Get a random hentai image
- `rule34` - Get a random image from Rule34.xxx

#### Profile
- `inventory` - Get your inventory
- `jobs` - Get your jobs info or apply for a job
- `leaderboard` - Get the money leaderboard
- `profile` - Get your profile

#### Search
- `dictionary` - Get a definition from the dictionary
- `reddit` - Get a random post from selected subreddit
- `search` - Search for a specific item

#### Utility Tools
- `delete` - Delete a message
- `short` - Shorten a link
