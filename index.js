const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
client.config = {
  channel: null,
  adminRole: null,
  blacklist: [],
  monsters: [],
};

// Load or initialize data
const dataFilePath = './data.json';
if (fs.existsSync(dataFilePath)) {
  client.config = JSON.parse(fs.readFileSync(dataFilePath));
} else {
  saveData();
}

function saveData() {
  fs.writeFileSync(dataFilePath, JSON.stringify(client.config, null, 2));
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'config-channel') {
    if (!interaction.member.roles.cache.has(client.config.adminRole)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }
    const channel = interaction.options.getChannel('channel');
    client.config.channel = channel.id;
    saveData();
    return interaction.reply({ content: `Channel set to ${channel.name}` });
  }

  // Other commands implementation...

  if (commandName === 'panel_monster_create') {
    if (!interaction.member.roles.cache.has(client.config.adminRole)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }
    const name = interaction.options.getString('name');
    const emoji = interaction.options.getString('emoji');
    const rarity = interaction.options.getString('rarity');
    client.config.monsters.push({ name, emoji, rarity });
    saveData();
    return interaction.reply({ content: `Monster ${name} created!` });
  }
});

client.login('YOUR_BOT_TOKEN');
