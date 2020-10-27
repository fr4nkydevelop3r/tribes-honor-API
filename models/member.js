const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
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

module.exports = Member = mongoose.model('member', MemberSchema);
