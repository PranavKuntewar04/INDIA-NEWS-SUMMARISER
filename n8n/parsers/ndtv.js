// Parser for NDTV
const cheerio = require('cheerio');

function parse(html) {
  const $ = cheerio.load(html);
  const articles = [];

  $('.news_Ede, .story__content').each((i, el) => {
    const titleEl = $(el).find('h2, h3, .newsHdng').first();
    const title = titleEl.text().trim();
    
    let url = $(el).find('a').first().attr('href') || '';
    if (url && !url.startsWith('http')) {
      url = 'https://www.ndtv.com' + url;
    }

    const snippet = $(el).find('p, .newsCont').first().text().trim() || title;

    if (title && url) {
      articles.push({
        title,
        url,
        snippet: snippet.substring(0, 200),
        publishedAt: new Date().toISOString(),
        source: 'ndtv.com'
      });
    }
  });

  return articles;
}

module.exports = { parse };
