//Skipped

// NOTE:
// Wellfound uses DataDome anti-bot protection.
// Automated requests are redirected to a CAPTCHA page,
// Playwright accessed CAPTCHA page's HTML instead of the job content.

const { chromium } = require("playwright");

async function scrapeWellfound(url) {
    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "domcontentloaded"
    });

    await page.waitForTimeout(5000);

    console.log(await page.content());

    console.log(await page.title());
    console.log(page.url());

    // Wait until the title loads
    await page.waitForSelector("h1.inline.text-xl.font-semibold.text-black");

    // Company
    const company = await page.locator("span.text-sm.font-semibold.text-black").textContent();

    // Job Title
    const title = await page.locator("h1.inline.text-xl.font-semibold.text-black").textContent();

    // Description
    const description = await page.locator("div#job-description").innerText();

    console.log({
        company: company.trim(),
        title: title.trim(),
        description: description.trim()
    });

    await browser.close();
}

scrapeWellfound("https://wellfound.com/jobs/4506899-software-engineer");