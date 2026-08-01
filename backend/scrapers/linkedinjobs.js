const { chromium } = require("playwright");

async function scrapeLinkedIn(url) {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Wait until the job page loads
  await page.waitForSelector("h1, .show-more-less-html__markup");

  // Company
  const company = await page
    .locator('a[href*="/company/"]')
    .first()
    .textContent();

  // Job Title
  let title;

  try {
    title = await page.locator("h1").first().textContent();
  } catch {
    const pageTitle = await page.title();
    title =
      pageTitle.split(" hiring ")[1]?.split(" in ")[0] || pageTitle;
  }

  // Job Description
  const description = await page
    .locator(".show-more-less-html__markup")
    .innerText();

  await browser.close();

  return {
    company: company.trim(),
    title: title.trim(),
    description: description.trim(),
  };
}

module.exports = scrapeLinkedIn;