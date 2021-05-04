const cron = require("node-cron");
const getCookie = require("./utils/cookie");

cron.schedule("*/30 * * * *", getCookie);

module.exports = {};
