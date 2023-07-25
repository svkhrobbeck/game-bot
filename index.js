const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const { gameOptions, restartOptions, startOptions } = require("./options");

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
let randomNum;

// functions
const startGame = async chatId => {
  await bot.sendMessage(chatId, "0 dan 9 gacha bo'lgan sonlardan birini tanlang", gameOptions);
  const random = Math.trunc(Math.random() * 10);
  randomNum = random;
};

const botStart = () => {
  bot.setMyCommands([
    { command: "/start", description: "Botni ishga tushirish" },
    { command: "/game", description: "O'yinni boshlash" },
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
