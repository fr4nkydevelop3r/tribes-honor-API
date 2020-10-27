const express = require('express');
const Tribe = require('../models/tribe');
const Category = require('../models/category');
const User = require('../models/user');
const Member = require('../models/member');
const Master = require('../models/master');

exports.getTribes = async (req, res) => {
  try {
    const tribes = await Tribe.find({}).lean();
    const categories = await Category.find({}).exec();

    let tribesInfo = tribes.map(async (tribe) => {
      //Add cagegory to tribe
      let category = categories.filter(
        (cat) =>
          JSON.stringify(cat._id) ===
          JSON.stringify(tribe.idCategory),
      );
      tribe.category = category[0].name;

      let members = await Member.find({
        idTribe: tribe._id,
      }).lean();

      //Add members to tribe
      let membersInfo = members.map(async (member) => {
        let user = await User.findById(
          member.idUser,
          '-_id name photo',
        );
        return user;
      });

      //membersInfo is an array of promises
      let m = Promise.all(membersInfo)
        .then((membersInfo) => {
          return membersInfo;
        })
        .catch((e) => console.error(e.message));

      //wait until the array of promises (members) is resolved and then add the members to the tribe
      await m
        .then((data) => {
          tribe.members = data;
        })
        .catch((e) => console.error(e.message));

      let masters = await Master.find({
        idTribe: tribe._id,
      }).exec();

      //Add masters to tribe
      let mastersInfo = masters.map(async (master) => {
        let user = await User.findById(
          master.idUser,
          '-_id name photo',
        );
        return user;
      });

      //mastersInfo is an array of promises
      let mas = Promise.all(mastersInfo)
        .then((mastersInfo) => {
          return mastersInfo;
        })
        .catch((e) => console.error(e.message));

      //wait until the array of promises (masters) is resolved and then add the masters to the tribe
      await mas
        .then((data) => {
          tribe.masters = data;
        })
        .catch((e) => console.error(e.message));

      return tribe;
    });

    //tribesInfo is an array of promises
    Promise.all(tribesInfo)
      .then((tribes) => {
        if (tribes.length > 0) {
          res.json(tribes);
        } else {
          return res.status(404).json({
            error: 'No tribes were found',
          });
        }
      })
      .catch((err) => console.log(err));
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
};
