const mongoose = require('mongoose');
const dbConnections = {}; // Armazenar conexões de banco de dados

const dbSelector = async (req, res, next) => {
  const host = req.hostname; // Obter o domínio da requisição

  if (!dbConnections[host]) {
    // Conectar ao banco de dados específico do domínio do cliente
    const dbName = `db_${host.replace(/\./g, '_')}`; // Nome do banco de dados baseado no domínio
    const dbUri = `mongodb+srv://username:password@cluster.mongodb.net/${dbName}?retryWrites=true&w=majority`;

    try {
      dbConnections[host] = await mongoose.createConnection(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Database connection error' });
    }
  }

  req.db = dbConnections[host]; // Adicionar a conexão do banco de dados à requisição
  next();
};

module.exports = dbSelector;
