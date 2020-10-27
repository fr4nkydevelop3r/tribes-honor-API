const mongoose = require('mongoose');

const TribeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  idCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mision: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  rank: {
    type: String,
    required: true,
  },
});

module.exports = Tribe = mongoose.model('tribe', TribeSchema);
