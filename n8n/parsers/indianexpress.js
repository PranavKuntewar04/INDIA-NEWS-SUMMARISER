// Parser for Indian Express
const cheerio = require('cheerio');

function parse(html) {
  const $ = cheerio.load(html);
  const articles = [];

  $('.articles, .title').each((i, el) => {
    const titleEl = $(el).find('h2, h3').first();
    const title = titleEl.text().trim();
    
    let url = $(el).find('a').first().attr('href') || '';
    if (url && !url.startsWith('http')) {
      url = 'https://indianexpress.com' + url;
    }

    const snippet = $(el).find('p').first().text().trim() || title;

    if (title && url) {
      articles.push({
        title,
        url,
        snippet: snippet.substring(0, 200),
        publishedAt: new Date().toISOString(),
        source: 'indianexpress.com'
      });
    }
  });

  return articles;
}

module.exports = { parse };
