const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
let randomNum;

// options
const startOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "O'yin o'ynash", callback_data: "/game" }]],
  }),
};

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: 1, callback_data: 1 },
        { text: 2, callback_data: 2 },
        { text: 3, callback_data: 3 },
      ],
      [
        { text: 4, callback_data: 4 },
        { text: 5, callback_data: 5 },
        { text: 6, callback_data: 6 },
      ],
      [
        { text: 7, callback_data: 7 },
        { text: 8, callback_data: 8 },
        { text: 9, callback_data: 9 },
      ],
      [{ text: 0, callback_data: 0 }],
    ],
  }),
};

const restartOptions = {
  reply_markup: JSON.stringify({ inline_keyboard: [[{ text: "Qayta o'ynash", callback_data: "/again" }]] }),
};

// functions
const startGame = async chatId => {
  await bot.sendMessage(chatId, "0 dan 9 gacha bo'lgan sonlardan birini tanlang", gameOptions);
  const random = Math.trunc(Math.random() * 10);
  randomNum = random;
};

const botStart = () => {
  bot.setMyCommands([
    { command: "/start", description: "Botni ishga tushirish" },
    { command: "/game", description: "O'yin o'ynash" },
  ]);

  bot.on("message", async msg => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const name = msg.from.first_name;

    if (text === "/start") return bot.sendMessage(chatId, `Assalomu aleykum ${name}, xush kelibsiz!`, startOptions);
    else if (text === "/game") return startGame(chatId);
    else return bot.sendMessage(chatId, "Noma'lum buyruq!, /start dan foydalaning");
  });

  bot.on("callback_query", async msg => {
    const chatId = msg.message.chat.id;
    const data = msg.data;

    if (data === "/game" || data === "/again") return startGame(chatId);
    else if (+data === randomNum && !!randomNum)
      return bot.sendMessage(chatId, `Siz yutdingiz! javob chindan ham ${data} edi✅`, restartOptions);
    else if (+data !== randomNum && !!randomNum)
      return bot.sendMessage(chatId, `Siz yutqazdingiz! aslida javob ${randomNum} edi🙂`, restartOptions);
  });
};

botStart();
