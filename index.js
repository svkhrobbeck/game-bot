require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const chats = {};

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "1", callback_data: 1 },
        { text: "2", callback_data: 2 },
        { text: "3", callback_data: 3 },
      ],
      [
        { text: "4", callback_data: 4 },
        { text: "5", callback_data: 5 },
        { text: "6", callback_data: 6 },
      ],
      [
        { text: "7", callback_data: 7 },
        { text: "8", callback_data: 8 },
        { text: "9", callback_data: 9 },
      ],
      [{ text: "0", callback_data: 0 }],
    ],
  }),
};

const againOptions = {
  reply_markup: JSON.stringify({ inline_keyboard: [[{ text: "Qayta boshlash", callback_data: "/again" }]] }),
};

bot.setMyCommands([
  {
    command: "/start",
    description: "Botni ishga tushirish",
  },
  {
    command: "/info",
    description: "Bot haqida ma'lumot",
  },
  {
    command: "/game",
    description: "O'yin o'ynash",
  },
]);

const startGame = async chatId => {
  await bot.sendMessage(chatId, "0 dan 9 gacha bo'lgan sonlardan birini tanlang", gameOptions);
  const randomNum = Math.trunc(Math.random() * 10);
  chats.chatId = randomNum;
};

const start = () => {
  bot.on("message", async msg => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") return bot.sendMessage(chatId, `Assalomu aleykum ${msg.chat.first_name}, botimizga xush kelibsiz!`);
    else if (text === "/game") return startGame(chatId);
    else return bot.sendMessage(chatId, "Mavjud bo'lmagan buyruq!, /start buyrug'idan foydalaning");
  });
};

start();

bot.on("callback_query", async msg => {
  const chatId = msg.message.chat.id;
  const data = msg.data;
  if (data === "/again") return startGame(chatId);
  else if (+data === chats.chatId && !!chats.chatId)
    return bot.sendMessage(chatId, `Tabriklaymiz siz yutdingiz, javob chindan ham ${data} edi!✅👌`);
  else return bot.sendMessage(chatId, `Yutqazdingiz! javob ${chats.chatId} edi!🙂`, againOptions);
});
