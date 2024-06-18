const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;


connectToMongoDB("mongodb+srv://joaovslopesz:l25lD10A01Rhjofr@bancoshortlink.iptf7z8.mongodb.net/?retryWrites=true&w=majority&appName=BancoShortLink")
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.error("Mongodb connection error:", err));


app.use(express.json());


app.use("/url", urlRoute);


app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  if (entry) {
    res.redirect(entry.redirectURL);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
