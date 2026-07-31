const { chromium } = require("playwright");

async function scrapeGoogleJobs(url) {
    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "domcontentloaded"
    });

    // Wait until the page loads
    await page.waitForSelector("h2.p1N2lc");


    // Company
const company = await page.locator("text=Google").first().textContent();

// Job Title
const title = await page.locator("h2.p1N2lc").textContent();

// Job Description
const description = await page.locator("main").innerText();

console.log({
    company,
    title,
    description
});

    await browser.close();
}

scrapeGoogleJobs(
    "https://www.google.com/about/careers/applications/jobs/results/104939995780784838-ux-program-manager-search-ai"
);