// Parser for India Today
const cheerio = require('cheerio');

function parse(html) {
  const $ = cheerio.load(html);
  const articles = [];

  $('article, .story-list, .story__grid').each((i, el) => {
    const titleEl = $(el).find('h2, h3, a[title]').first();
    const title = titleEl.text().trim() || $(el).attr('title') || '';
    
    let url = $(el).find('a').first().attr('href') || '';
    if (url && !url.startsWith('http')) {
      url = 'https://www.indiatoday.in' + url;
    }

    const snippet = $(el).find('p').first().text().trim() || title;

    if (title && url) {
      articles.push({
        title,
        url,
        snippet: snippet.substring(0, 200),
        publishedAt: new Date().toISOString(),
        source: 'indiatoday.in'
      });
    }
  });

  return articles;
}

module.exports = { parse };
