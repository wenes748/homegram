const { io } = require("socket.io-client");
const readline = require('readline');

const socket = io('https://homegram.onrender.com', { transports: ['websocket'] });
const SECRET = 'homegram_super_secret_2026';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'Homegram> ' });

console.log('\n=========================================');
console.log('👑 КОНСОЛЬ АДМИНИСТРАТОРА');
console.log('=========================================');
console.log('Команды:');
console.log('  get (ник) stars (кол-во)     — выдать звёзды');
console.log('  get (ник) crystals (кол-во)  — выдать кристаллы');
console.log('  get (ник) premium (дни)      — выдать премиум (0 = навсегда)');
console.log('  get (ник) nft (id)           — выдать NFT (pepe, galaktika, dragon...)');
console.log('=========================================\n');

socket.on('connect', () => rl.prompt());

socket.on('admin:terminal-result', (res) => {
  console.log('\n' + res.msg + '\n');
  rl.prompt();
});

rl.on('line', (line) => {
  const args = line.trim().split(' ');
  if (args[0] === 'exit') process.exit(0);
  else if (args[0] === 'get' && args.length >= 4) {
    const username = args[1].replace('@', '');
    const action = args[2];
    const arg1 = args[3];
    console.log(`⏳ Отправка команды...`);
    socket.emit('admin:terminal', { secret: SECRET, action, targetUsername: username, arg1 });
  } else {
    console.log('❌ Неверный формат. Пример: get ivan stars 1000');
    rl.prompt();
  }
});