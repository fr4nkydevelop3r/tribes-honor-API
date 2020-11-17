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

      console.log(members);

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

exports.getTribe = async (req, res) => {
  try {
    const { idTribe } = req.query;
    const tribe = await Tribe.findOne({
      _id: idTribe,
    }).lean();
    if (tribe) {
      const category = await Category.findOne({
        _id: tribe.idCategory,
      });
      tribe.category = category.name;
      res.json(tribe);
    } else {
      return res.status(404).json({
        error: 'No tribe was found',
      });
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
};

exports.addTribe = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      mision,
      outcome,
      location,
      video,
    } = req.body;

    let categoryId = await Category.findOne({
      name: category,
    }).lean();
    if (!categoryId) {
      //create new category and get the id of the new category
      let newCategory = new Category({ name: category });
      let cat = await newCategory.save();
      categoryId = cat._id;
    }

    console.log(categoryId);

    let tribe = new Tribe({
      name,
      idCategory: categoryId,
      createdAt: new Date(),
      description,
      mision,
      outcome,
      videoMaster: video,
      location,
    });

    tribe.save((err, data) => {
      if (err) {
        console.log('ERROR SAVING THE TRIBE', err);
        return res.status(400).json({
          error: 'Error saving the tribe',
        });
      }
      res.json({
        message: `Great! You got a lot of power on your hands.`,
      });
    });

    //if search of category is true, get the id of the category and add it to tribe,
    //if not create a new category and return the id

    //when you have the id of the category ready add the tribe
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
};
