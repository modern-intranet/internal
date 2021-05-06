/** CONSTANTS */
// const SOCKET_ADDRESS = "http://localhost:8080";
const SOCKET_ADDRESS = "https://www.datcom.site";
const I_AM_INTRANET = "iAmIntranet";
const VALIDATE_COOKIE = "validateCookie";
const GET_DATA = "getData";
const SET_FOOD = "setFood";
const GET_LIST = "getList";
const GET_LIST_ALL = "getListAll";

/** LIBRARIES */
const io = require("socket.io-client");
const cron = require("node-cron");
require("dotenv").config();

/** UTILITIES */
const getCookie = require("./utils/cookie");
const api = require("./utils/api");

/** SOCKET HANDLE */
var socket;

function setupSocket() {
  if (socket) socket.emit("forceDisconnect");

  socket = io.connect(SOCKET_ADDRESS, {
    reconnect: true,
  });

  socket.on("connect", () => {
    socket.emit(I_AM_INTRANET);
    console.log("Socket connected ✓");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected ✓");
  });

  /** SOCKET ACTIONS */
  const errorLog = (action, data) => {
    if (data.statusCode === 200) {
      console.log(`${action} succeed ✓`);
    } else {
      console.log(`${action} failed ⚠`);
      console.log(`- ${data.data}`);
    }
  };

  socket.on(VALIDATE_COOKIE, async (_, ack) => {
    const isSucceed = (await api.validateCookie()) || (await getCookie());
    ack &&
      ack({
        statusCode: isSucceed ? 200 : -1,
        data: isSucceed,
      });
    console.log(`Validate cookie ${isSucceed ? "succeed ✓" : "failed ⚠"}`);
  });

  socket.on(GET_DATA, async (payload, ack) => {
    const data = await api.getData(payload);
    ack && ack(data);
    errorLog("Get data", data);
  });

  socket.on(SET_FOOD, async (payload, ack) => {
    const data = await api.setFood(payload);
    ack && ack(data);
    errorLog("Set food", data);
  });

  socket.on(GET_LIST, async (payload, ack) => {
    const data = await api.getList(payload);
    ack && ack(data);
    errorLog("Get list", data);
  });

  socket.on(GET_LIST_ALL, async (payload, ack) => {
    const data = await api.getListAll(payload);
    ack && ack(data);
    errorLog("Get list all", data);
  });
}

// get new cookie every 30 minutes
cron.schedule("*/30 * * * *", () => {
  console.log("[Cron] Getting new cookie ~");
  getCookie();
});

// reconnect socket every 30 minutes
setupSocket();
cron.schedule("*/30 * * * *", () => {
  console.log("[Cron] Reconnecting socket ~");
  setupSocket();
});
