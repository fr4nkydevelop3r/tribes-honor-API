const express = require('express');
const Member = require('../models/member');
const User = require('../models/user');
exports.getMembers = async (req, res) => {
  try {
    const { idTribe } = req.query;
    const members = await Member.find({ idTribe: idTribe });
    const idsUsers = members.map((member) => member.idUser);
    let users = await User.find({ _id: { $in: idsUsers } });
    users = users.map((user) => {
      return {
        name: user.name,
        photo: user.photo,
      };
    });
    //console.log(users);
    res.json(users);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
};
