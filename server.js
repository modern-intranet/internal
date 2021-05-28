const io = require("socket.io-client");
const cron = require("node-cron");
const cookie = require("./utils/cookie");
const setupSocket = require("./socket");

/* Load env variables */
require("dotenv").config();

/* Setup socket */
setupSocket(io);

/* Get new cookies every 30 minutes */
cron.schedule("*/30 * * * *", async () => {
  console.info("[Cron] Getting new cookies");
  await cookie.getAllCookies();
});

/* Reconnect socket every 30 minutes */
cron.schedule("*/30 * * * *", () => {
  console.info("[Cron] Reconnecting socket");
  setupSocket(io);
});
