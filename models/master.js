const mongoose = require('mongoose');

const MasterSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  idTribe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tribes',
    required: true,
  },
});

module.exports = Master = mongoose.model('master', MasterSchema);
