const { chromium } = require("playwright");

async function scrapeGoogleJobs(url) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector("h2.p1N2lc");

  const company = await page.locator("text=Google").first().textContent();
  const title = await page.locator("h2.p1N2lc").textContent();
  const description = await page.locator("main").innerText();

  await browser.close();

  return {
    company: company.trim(),
    title: title.trim(),
    description: description.trim(),
  };
}

module.exports = scrapeGoogleJobs;