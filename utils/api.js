const axios = require("axios");
const https = require("https");
const FormData = require("form-data");
const { parseData, parseTableList } = require("./parses");

const request = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

async function validateCookie() {
  try {
    const response = await request.get(process.env.INTRANET_FOOD_URL, {
      headers: {
        Cookie: `${process.env.COOKIE_INTRANET_NAME}=${process.env.COOKIE_INTRANET_VALUE};`,
      },
    });
    return response.status === 200;
  } catch (err) {
    return false;
  }
}

async function getData() {
  try {
    const response = await request.get(process.env.INTRANET_FOOD_URL, {
      headers: {
        Cookie: `${process.env.COOKIE_INTRANET_NAME}=${process.env.COOKIE_INTRANET_VALUE};`,
      },
    });
    return {
      statusCode: response.status,
      data: parseData(response.data),
    };
  } catch (err) {
    return {
      statusCode: err.response ? err.response.status : -1,
      data: err.message,
    };
  }
}

async function setFood(body) {
  try {
    const formData = new FormData();
    for (let key in body) {
      formData.append(key, body[key]);
    }
    const response = await request.post(
      process.env.INTRANET_SET_FOOD_URL,
      formData.getBuffer(),
      {
        headers: {
          ...formData.getHeaders(),
          Cookie: `${process.env.COOKIE_INTRANET_NAME}=${process.env.COOKIE_INTRANET_VALUE};`,
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

async function getList(body) {
  try {
    const formData = new FormData();
    for (let key in body) {
      formData.append(key, body[key]);
    }
    const response = await request.post(
      process.env.INTRANET_LIST_URL,
      formData.getBuffer(),
      {
        headers: {
          ...formData.getHeaders(),
          Cookie: `${process.env.COOKIE_INTRANET_NAME}=${process.env.COOKIE_INTRANET_VALUE};`,
        },
      }
    );
    return {
      statusCode: response.status,
      data: parseTableList(response.data),
    };
  } catch (err) {
    return {
      statusCode: err.response ? err.response.status : -1,
      data: err.message,
    };
  }
}

async function getListAll() {
  return await getList({
    date: "",
  });
}

module.exports = {
  validateCookie,
  getData,
  setFood,
  getList,
  getListAll,
};
