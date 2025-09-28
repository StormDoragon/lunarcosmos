const Parser = require('rss-parser');

module.exports = async (req, res) => {
  try {
    const parser = new Parser({ timeout: 8000 });
    // Example: Universe Today feed (titles + links)
    const feed = await parser.parseURL('https://www.universetoday.com/feed/');
    const items = (feed.items || []).slice(0, 8).map(it => ({
      title: it.title || "",
      url: it.link || "",
      publishedAt: it.isoDate || it.pubDate || "",
      source: "Universe Today",
      excerpt: (it.contentSnippet || it.summary || "").slice(0, 220) + "…"
    }));
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400');
    res.status(200).json(items);
  } catch (e) {
    // If RSS fails, return empty list; your page will handle it gracefully.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    res.status(200).json([]);
  }
};
