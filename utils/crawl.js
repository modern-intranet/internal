const cheerio = require("cheerio");
const CONSTANT = require("../constant");

function crawlOrderPage(data) {
  /* Stimulate html document */
  const $ = cheerio.load(data);

  /* Get all date options */
  const dates = [];
  $("#date>option").each((_, ele) =>
    dates.push({
      value: ele.attribs.value,
      label: ele.children[0].data,
    })
  );

  /* Get all user options */
  const users = [];
  $("#user_id>option").each(
    (_, ele) =>
      +ele.attribs.value &&
      users.push({
        value: ele.attribs.value,
        label: ele.children[0].data,
      })
  );

  /* Get all dish option */
  const dishes = [];
  $("#food>option").each((_, ele) => {
    +ele.attribs.value &&
      dishes.push({
        value: ele.attribs.value,
        label: ele.children[0].data.replace(/(\r\n|\n|\r)/gm, "").trim(),
      });
  });

  return { dates, users, dishes };
}

function crawlListPage(data) {
  /* Stimulate html document */
  const $ = cheerio.load(data);

  /* Get raw table content */
  const table = $("#cbUserTable").html();

  /* Convert to json data */
  const convertTableHtmlToList = ($) => {
    const list = [];

    /* Get all rows of table */
    const listTr = $("#cbUserTable tr");

    /* Parse data from those rows */
    listTr.each(function (_, tr) {
      const listTd = $(this).find("td");
      const record = {};

      listTd.each(function (i) {
        if (i === 0) record.index = $(this).text().trim();
        if (i === 1) record.date = $(this).text().trim();
        if (i === 2) record.username = $(this).text().trim();
        if (i === 3) record.dish = $(this).text().trim();
        if (i === 4) record.time = $(this).text().trim();
      });

      if (Object.keys(record).length === 5) list.push(record);
    });

    return list;
  };

  return { table, list: convertTableHtmlToList($) };
}

function crawlUserInfoPage(data, targetEmail) {
  /* Stimulate html document */
  const $ = cheerio.load(data);

  /* Get raw table content */
  const table = $("#cbUserTable").html();

  /* Convert to json data */
  const convertTableHtmlToListUser = ($) => {
    const list = [];

    /* Get all rows of table */
    const listTr = $("#cbUserTable tr");

    /* Parse data from those rows */
    listTr.each(function (_, tr) {
      const listTd = $(this).find("td");
      const record = {};

      listTd.each(function (i) {
        if (i === 3) {
          const userInfoLink = $(this).find("a");
          if (userInfoLink) {
            record.name = $(this).text().trim();
            record.id = +userInfoLink.attr("href").split("/").reverse()[0];
          }
        }
        if (i === 4) {
          const department = CONSTANT.DEPARTMENTS.find(
            (dept) =>
              dept.localeCompare($(this).text().replace(/\s+/g, ""), "en", {
                sensitivity: "base",
              }) === 0
          );
          if (department) record.department = department;
        }
        if (i === 6) record.email = $(this).text().trim();
      });

      if (Object.keys(record).length === 4) list.push(record);
    });

    return list;
  };

  return convertTableHtmlToListUser($).find(
    (user) => user.email === targetEmail
  );
}

module.exports = {
  crawlOrderPage,
  crawlListPage,
  crawlUserInfoPage,
};
