// config/db.js
// Ce fichier gère la connexion à MongoDB via Mongoose
// On l'appelle une seule fois au démarrage du serveur

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(` MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(` Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1); // On arrête le serveur si la base est inaccessible
  }
};

module.exports = connectDB;