const cheerio = require("cheerio");

function parseData(data) {
  // stimulate html document
  const $ = cheerio.load(data);

  // get all date options
  const dates = [];
  $("#date>option").each((_, ele) =>
    dates.push({
      value: ele.attribs.value,
      label: ele.children[0].data,
    })
  );

  // get all user options
  const users = [];
  $("#user_id>option").each(
    (_, ele) =>
      +ele.attribs.value &&
      users.push({
        value: ele.attribs.value,
        label: ele.children[0].data,
      })
  );

  // get all dish option
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

function convertTableHtmlToList($) {
  const list = [];

  // get all rows of table
  const listTr = $("#cbUserTable tr");

  // parse data from those rows
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
}

function parseTableList(data) {
  // stimulate html document
  const $ = cheerio.load(data);

  // get table content
  const table = $("#cbUserTable").html();
  const list = convertTableHtmlToList($);

  return { table, list };
}

module.exports = {
  parseData,
  parseTableList,
  convertTableHtmlToList,
};
