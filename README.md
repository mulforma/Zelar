<p align="center">
  <a href="https://x.vvx.bar/nt/inv">
    <img src="/docs/logo.png" height="96" width="96" style="border-radius: 9999px" />
    <h2 align="center">
        𝗧𝗛𝗘 𝗡𝗜𝗡𝗧𝗢𝗗 𝗣𝗥𝗢𝗝𝗘𝗖𝗧
    </h2>
  </a>
  <p align="center">
    A simple, open-source, and free, fast, secure, and reliable discord bot. <br>
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

## Why nintod?

Because it's open-source! We are currently working on a lot of features (but we are also working on a lot of bugs too).
Nintod is also **free** and have **no premium tiers**. Who still have to pay for a bot? It's also **easy to use**. with a simple command.
The source code is well documented and easy to understand (Because we write comments in the code, all lines).
You can help us by contributing to the project. Because we love open-source, isn't that right?

## Where can I find support server?

If you want to talk about the bot development, Please go to [this discord server](https://x.vvx.bar/nt/sup) and solve Wick's challenge.
If you just want to talk with me, Just go to that same link.

# How can I contribute?

You can contribute to the project by [fork](https://github.com/thevvx/Nintod/fork) the repository, and make a [pull request](https://github.com/thevvx/Nintod/pulls).
Minors contributions are welcome. But please, don't spam us. We are not a spamming community. We are a friendly community.

## How can I host the bot?

You can host the bot on your own server, or you can host it on any cloud provider (such as [Amazon Web Services](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/), [Google Cloud Platform](https://cloud.google.com/), [Digital Ocean](https://www.digitalocean.com/) and countless others) . Make sure you have the following
installed:

- [Node.js (v16.6.0 or above)](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/) (preferred over npm) or other node package manager
- [Python 3.6](https://www.python.org/) or above (For `@discordjs/opus` library)
- [Database (CockroachDB or Postgres)](https://www.cockroachlabs.com/), You can get a free account on [CockroachDB](https://www.cockroachlabs.com/) choosing serverless options.
- [Docker](https://www.docker.com/) (Optional)

Then install the required dependencies by running this:

```bash
$ pnpm install
```

Also don't forget to change `.env.example` to `.env` and insert your data. Then deploy the command by running

```bash
$ node deploy
```

And run the bot

```bash
$ pnpm start # pnpm run dev for development
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
- `short` - Shorten a link (Unavailable now)
