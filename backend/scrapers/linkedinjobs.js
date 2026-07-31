const { chromium } = require("playwright");

async function scrapeLinkedIn(url) {
    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: "domcontentloaded"
    });

    // Wait for the page to load
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
        title = pageTitle.split(" hiring ")[1]?.split(" in ")[0] || pageTitle;
    }

    // Job Description
    const description = await page
        .locator(".show-more-less-html__markup")
        .innerText();

    console.log({
        company: company.trim(),
        title: title.trim(),
        description: description.trim()
    });

    await browser.close();
}

scrapeLinkedIn(
    "https://www.linkedin.com/jobs/view/4442463352/?alternateChannel=search&eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=3I6E4PtaH1uU37gZGonfFQ%3D%3D&trackingId=Xcg5dwvYm7mL3k9Qe4rZKQ%3D%3D"
);