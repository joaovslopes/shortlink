const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://joaovslopesz:l25lD10A01Rhjofr@bancoshortlink.iptf7z8.mongodb.net/?retryWrites=true&w=majority&appName=BancoShortLink', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = { connectToMongoDB };
