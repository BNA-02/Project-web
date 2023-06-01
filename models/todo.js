const mongoose = require('mongoose');

// Définir le schéma du modèle Todo
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Créer le modèle Todo à partir du schéma
const Todo = mongoose.model('Todo', todoSchema);

// Exporter le modèle Todo pour pouvoir l'utiliser dans d'autres fichiers
module.exports = Todo;
