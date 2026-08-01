// Parser for Times of India
const cheerio = require('cheerio');

function parse(html) {
  const $ = cheerio.load(html);
  const articles = [];

  $('.list5, .w_tle').each((i, el) => {
    const titleEl = $(el).find('a').first();
    const title = titleEl.attr('title') || titleEl.text().trim();
    
    let url = titleEl.attr('href') || '';
    if (url && !url.startsWith('http')) {
      url = 'https://timesofindia.indiatimes.com' + url;
    }

    const snippet = title; // TOI lists often don't have snippets on the main page

    if (title && url) {
      articles.push({
        title,
        url,
        snippet: snippet.substring(0, 200),
        publishedAt: new Date().toISOString(),
        source: 'timesofindia.indiatimes.com'
      });
    }
  });

  return articles;
}

module.exports = { parse };
