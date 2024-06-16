const express = require('express')
const { connectToMongoDB } = require('./connect')
const urlRoute = require('./routes/url')
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb+srv://joaovslopesz:l25lD10A01Rhjofr@bancoshortlink.iptf7z8.mongodb.net/?retryWrites=true&w=majority&appName=BancoShortLink').then(() => 
    console.log('Mongodb connected')
);

app.use("/url", urlRoute);

app.listen(PORT, () => console.log('Server started at PORT:${PORT}'))