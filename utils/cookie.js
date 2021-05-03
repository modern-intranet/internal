const puppeteer = require("puppeteer");

async function getCookie() {
  console.log("Getting cookie ~");

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    // not load image for better speed
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.resourceType() === "image") request.abort();
      else request.continue();
    });

    // set first google cookies and goto intranet
    await page.setCookie({
      name: process.env.COOKIE_1_NAME,
      value: process.env.COOKIE_1_VALUE,
      domain: process.env.COOKIE_DOMAIN_GOOGLE,
    });
    await page.goto(process.env.INTRANET_URL);

    // set second google cookies
    await page.setCookie({
      name: process.env.COOKIE_2_NAME,
      value: process.env.COOKIE_2_VALUE,
      domain: process.env.COOKIE_DOMAIN_GOOGLE,
    });

    // login google
    await page.type("input", process.env.ACCOUNT);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    await page.type("input", process.env.PASSWORD);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();

    // goto intranet again
    await page.goto(process.env.INTRANET_URL);

    // get new cookie
    const intranetCookie = (await page.cookies()).find(
      (c) => c.domain === process.env.COOKIE_DOMAIN_INTRANET
    );
    process.env.COOKIE_INTRANET_NAME = intranetCookie && intranetCookie.name;
    process.env.COOKIE_INTRANET_VALUE = intranetCookie && intranetCookie.value;

    // close browser
    await browser.close();

    // log result
    if (!!intranetCookie) {
      console.log(`New cookie is ${process.env.COOKIE_INTRANET_VALUE} ✓`);
      return true;
    } else {
      console.log("Get cookie failed ⚠");
      return false;
    }
  } catch (err) {
    console.log(`Login failed ${err.message}`);
    return false;
  }
}

module.exports = getCookie;
