const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeGoogleJobs(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(data);

    const title = $("h2.p1N2lc").first().text().trim() || "Google Job Title";
    const company = "Google";
    const description = $("main").text().trim() || "No description found";

    return { company, title, description };
  } catch (error) {
    console.error("Google Jobs Scrape Error:", error.message);
    throw new Error(`Failed to scrape Google job page: ${error.message}`);
  }
}

module.exports = scrapeGoogleJobs;