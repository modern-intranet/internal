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

function parseTableList(data) {
  // stimulate html document
  const $ = cheerio.load(data);

  // get table content
  const table = $("#cbUserTable").html();

  return table;
}

module.exports = {
  parseData,
  parseTableList,
};
