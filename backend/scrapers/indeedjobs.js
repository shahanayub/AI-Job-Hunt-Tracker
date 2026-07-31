
//Skipped
// NOTE:
// Indeed blocks automated browser requests.
// The scraper receives a "Blocked - Indeed.com" page
// instead of the actual job listing.
const { chromium } = require("playwright");

async function scrapeIndeed(url) {
    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "domcontentloaded"
    });

    console.log(await page.title());
    console.log(page.url());

    await page.waitForTimeout(5000);

    console.log(await page.content());
    
    // Company
    const company = await page.locator("a[aria-label]").first().textContent();

    // Job Title
    const title = await page.locator("span").filter({ hasText: "job post" }).first().textContent();

    // Description
    const description = await page.locator("#jobDescriptionText").innerText();

    console.log({
        company: company.trim(),
        title: title.replace("- job post", "").trim(),
        description: description.trim()
    });

    await browser.close();
}

scrapeIndeed("https://pk.indeed.com/jobs?q=software+engineer&l=Islamabad&from=searchOnHP%2Cwhereautocomplete&vjk=2887019426cb0b41");