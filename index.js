const express = require('express');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const dbSelector = require('./middleware/dbSelector');

const app = express();
const PORT = 8001;

connectToMongoDB().then(() =>
  console.log('MongoDB connected')
);

app.use(express.json());
app.use(dbSelector); // Usar o middleware para selecionar o banco de dados

app.use('/url', urlRoute); // Rota para manipular URLs

app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const URL = req.db.model('URL', new mongoose.Schema({
    title: { type: String, required: true },
    shortId: { type: String, required: true, unique: true },
    redirectURL: { type: String, required: true },
    visitHistory: [{ timestamp: { type: Date, default: Date.now } }],
  }));

  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );

  if (!entry) {
    return res.status(404).send('URL not found');
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
