const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const app = express();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ]
});

app.get('/', (req, res) => {
  res.send('Bot is awake!');
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

console.log('Token:', process.env.TOKEN ? 'Loaded' : 'Missing');

// === STICKY MESSAGE SETUP ===
const STICKY_SETTINGS = [
  {
    channelId: '1399895624475738173',
    messageContent: '[use this to leave a review *!*](https://canary.discord.com/channels/1398472440329277471/1399895624475738173/1399907579794161877)',
  },
  {
    channelId: '1399994237306802340',
    messageContent: '[use this to leave a review *!*](https://canary.discord.com/channels/1398472440329277471/1399994237306802340/1400003558673219644)',
  },
  {
    channelId: '1400006320651763786',
    messageContent: '[use this to leave a review *!*](https://canary.discord.com/channels/1398472440329277471/1400006320651763786/1400006844788903978)',
  },
];

const lastStickyMessages = {};

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const stickyConfig = STICKY_SETTINGS.find(c => c.channelId === message.channel.id);
  if (!stickyConfig) return;

  try {
    setTimeout(async () => {
      if (lastStickyMessages[message.channel.id]) {
        await lastStickyMessages[message.channel.id].delete().catch(() => {});
      }

      const sent = await message.channel.send(stickyConfig.messageContent);
      lastStickyMessages[message.channel.id] = sent;
    }, 1000); // 1 second delay
  } catch (err) {
    console.error('Sticky error:', err);
  }
});


// === LOGIN ===
client.login(process.env.TOKEN);

client.on('messageCreate', async (message) => {
  if (message.content === '.reviewguide') {
    if (message.author.bot) return;

    const embed = {
      title: 'review guide',
      description: `

**﹒✧  ︵‿︵‿୨♡୧‿︵‿︵  ✧﹒**


> **Long reviews** ⋆ 4-5 sentences  
> **Medium reviews** ⋆ 3-4 sentences  
> **Short reviews** ⋆ 1-2 sentences  
> **Simple rating** ⋆ use format below



-# Make sure you have read what type of review you need to leave for your chosen plan.`,
      color: 0xffffff,
      thumbnail: {
        url: 'https://i.pinimg.com/736x/8a/16/72/8a16728b7d8aa75f7910fd38683720db.jpg'
      },
      footer: {
        text: 'open a ticket if you are confused !',
      }  // <-- Closing footer brace added here
    };   // <-- Closing embed brace added here

    await message.channel.send({ embeds: [embed] });
  }
});

client.on('messageCreate', async (message) => {
  if (message.content === '.reviewguidepaid') {
    if (message.author.bot) return;

    const embed = {
      title: 'review guide',
      description: `

**﹒✧  ︵‿︵‿୨♡୧‿︵‿︵  ✧﹒**


> **Long reviews** ⋆ 4-5 sentences  
> **Medium reviews** ⋆ 3-4 sentences  
> **Short reviews** ⋆ 1-2 sentences  



-# Make sure you have read what type of review you need to leave for your chosen plan.`,
      color: 0xffffff,
      thumbnail: {
        url: 'https://i.pinimg.com/736x/8a/16/72/8a16728b7d8aa75f7910fd38683720db.jpg'
      },
      footer: {
        text: 'open a ticket if you are confused !',
      }  
    };   

    await message.channel.send({ embeds: [embed] });
  }
});


// === DIVIDER AFTER EACH MESSAGE (TWO CHANNELS) ===
const DIVIDER_CHANNELS = [
  '1400006320651763786', 
  '1399994237306802340'  
];

const DIVIDER_TEXT = '[⠀](https://64.media.tumblr.com/d3e908095c7865c0369fb5a83a905460/1a7499e8ed08e8b1-c9/s1280x1920/c56ae02fc3478bc19d7dcfc01a998fe7f717406c.pnj)';

client.on('messageCreate', async (message) => {
  if (!DIVIDER_CHANNELS.includes(message.channel.id)) return;
  if (message.author.bot) return;

  try {
    await message.channel.send(DIVIDER_TEXT);
  } catch (err) {
    console.error('Divider send error:', err);
  }
});

