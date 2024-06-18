const shortid = require('shortid');

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: 'url is required' });
  if (!body.title) return res.status(400).json({ error: 'title is required' });

  const shortID = body.id || shortid.generate();
  const URL = req.db.model('URL', new mongoose.Schema({
    title: { type: String, required: true },
    shortId: { type: String, required: true, unique: true },
    redirectURL: { type: String, required: true },
    visitHistory: [{ timestamp: { type: Date, default: Date.now } }],
  }));

  const existingURL = await URL.findOne({ shortId: shortID });
  if (existingURL) {
    return res.status(400).json({ error: 'ID already exists' });
  }

  await URL.create({
    title: body.title,
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const URL = req.db.model('URL', new mongoose.Schema({
    title: { type: String, required: true },
    shortId: { type: String, required: true, unique: true },
    redirectURL: { type: String, required: true },
    visitHistory: [{ timestamp: { type: Date, default: Date.now } }],
  }));

  const result = await URL.findOne({ shortId });
  if (!result) {
    return res.status(404).json({ error: 'ID not found' });
  }

  return res.json({
    title: result.title,
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
