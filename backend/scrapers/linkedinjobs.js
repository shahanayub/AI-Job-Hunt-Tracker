const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeLinkedIn(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(data);

    const company =
      $('a[href*="/company/"]').first().text().trim() ||
      $(".topcard__org-name-link").first().text().trim() ||
      "Unknown Company";

    const title =
      $("h1").first().text().trim() ||
      $("h1.top-card-layout__title").text().trim() ||
      "Unknown Title";

    const description =
      $(".show-more-less-html__markup").text().trim() ||
      $(".description__text").text().trim() ||
      "No description found";

    return { company, title, description };
  } catch (error) {
    console.error("LinkedIn Scrape Error:", error.message);
    throw new Error(`Failed to scrape LinkedIn job page: ${error.message}`);
  }
}

module.exports = scrapeLinkedIn;