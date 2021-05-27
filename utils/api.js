const axios = require("axios");
const https = require("https");
const FormData = require("form-data");

const CONSTANT = require("../constant");
const { crawlOrderPage, crawlListPage } = require("./crawl");

/* Ignore security for testing */
const request = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

/* Check if cookie is still valid */
async function validateCookie(department) {
  try {
    const response = await request.get(CONSTANT.INTRANET_ORDER, {
      headers: {
        Cookie: `${process.env[`${department}_INTRANET_COOKIE_NAME`]}=${
          process.env[`${department}_INTRANET_COOKIE_VALUE`]
        };`,
      },
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

/* Get menu data of next date */
async function getData(department) {
  try {
    const response = await request.get(CONSTANT.INTRANET_ORDER, {
      headers: {
        Cookie: `${process.env[`${department}_INTRANET_COOKIE_NAME`]}=${
          process.env[`${department}_INTRANET_COOKIE_VALUE`]
        };`,
      },
    });
    return {
      statusCode: response.status,
      data: crawlOrderPage(response.data),
    };
  } catch (err) {
    return {
      statusCode: err.response ? err.response.status : -1,
      data: err.message,
    };
  }
}

/* Order food for a user on a date */
async function setFood(data, department) {
  try {
    const formData = new FormData();
    for (let field in data) {
      formData.append(field, data[field]);
    }
    const response = await request.post(
      CONSTANT.INTRANET_ORDER,
      formData.getBuffer(),
      {
        headers: {
          ...formData.getHeaders(),
          Cookie: `${process.env[`${department}_INTRANET_COOKIE_NAME`]}=${
            process.env[`${department}_INTRANET_COOKIE_VALUE`]
          };`,
        },
      }
    );
    return {
      statusCode: response.status,
      data: response.data,
    };
  } catch (err) {
    return {
      statusCode: err.response ? err.response.status : -1,
      data: err.message,
    };
  }
}

/* Get list of ordered food on a date */
async function getList(data, department) {
  try {
    const formData = new FormData();
    for (let field in data) {
      formData.append(field, data[field]);
    }
    const response = await request.post(
      CONSTANT.INTRANET_LIST,
      formData.getBuffer(),
      {
        headers: {
          ...formData.getHeaders(),
          Cookie: `${process.env[`${department}_INTRANET_COOKIE_NAME`]}=${
            process.env[`${department}_INTRANET_COOKIE_VALUE`]
          };`,
        },
      }
    );
    return {
      statusCode: response.status,
      data: crawlListPage(response.data),
    };
  } catch (err) {
    return {
      statusCode: err.response ? err.response.status : -1,
      data: err.message,
    };
  }
}

/* Get list of ordered food on all dates */
async function getListAll(department) {
  return await getList({ date: "", department });
}

module.exports = {
  validateCookie,
  getData,
  setFood,
  getList,
  getListAll,
};
