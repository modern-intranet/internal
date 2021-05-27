const puppeteer = require("puppeteer");
const envfile = require("envfile");
const { promises: fs } = require("fs");
const CONSTANT = require("../constant");

/* Stimulate browser to generate cookie */
async function getCookie(department) {
  console.log(`Getting cookie of ${department}...`);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    /* Skip image request */
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.resourceType() === "image") request.abort();
      else request.continue();
    });

    /* Set first google cookie and go to intranet */
    await page.setCookie({
      name: CONSTANT.GOOGLE_COOKIE_SMSV,
      value: process.env[`${department}_GOOGLE_COOKIE_SMSV_VALUE`],
      domain: CONSTANT.GOOGLE_DOMAIN,
    });
    await page.goto(CONSTANT.INTRANET);

    /* Set second google cookie */
    await page.setCookie({
      name: CONSTANT.GOOGLE_COOKIE_GAPS,
      value: process.env[`${department}_GOOGLE_COOKIE_GAPS_VALUE`],
      domain: CONSTANT.GOOGLE_DOMAIN,
    });

    /* Login google */
    await page.type("input", process.env[`${department}_GOOGLE_EMAIL`]);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    await page.type("input", process.env[`${department}_GOOGLE_PASSWORD`]);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();

    /* Go to intranet again */
    await page.goto(CONSTANT.INTRANET);

    /* Get new cookie */
    const intranetCookie = (await page.cookies()).find(
      ({ domain }) => domain === CONSTANT.INTRANET_DOMAIN
    );
    process.env[`${department}_INTRANET_COOKIE_NAME`] =
      intranetCookie && intranetCookie.name;
    process.env[`${department}_INTRANET_COOKIE_VALUE`] =
      intranetCookie && intranetCookie.value;

    /* Close browser */
    await browser.close();

    /* Log result */
    if (intranetCookie) {
      console.log(`New cookie of ${department} ✓`);
      console.log(`- ${intranetCookie.value}`);
    } else {
      console.log("Get cookie failed ⚠");
    }
    return !!intranetCookie;
  } catch (err) {
    console.log(`Login failed ${err.message} ⚠`);
    return false;
  }
}

/* Get cookie of all departments */
async function getAllCookies() {
  for (let department of CONSTANT.DEPARTMENTS) {
    if (process.env[`${department}_GOOGLE_EMAIL`]) {
      await getCookie(department);
    }
  }

  /* Update to env file */
  try {
    const file = await fs.readFile(__dirname + "./../.env", "utf8");
    const envObj = envfile.parse(file);

    /* Update with current env variables */
    for (let name in envObj) {
      envObj[name] = process.env[name];
    }

    /* Write back to file */
    await fs.writeFile(__dirname + "./../.env", envfile.stringify(envObj));

    console.log(`Update env succeed ✓`);
  } catch (err) {
    console.log(`Update env failed ${err.message} ⚠`);
  }
}

module.exports = {
  getCookie,
  getAllCookies,
};
