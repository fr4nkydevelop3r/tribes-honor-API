const express = require('express');
const Tribes = require('../models/tribes');

exports.getTribes = async (req, res) => {
  try {
    const tribes = await Tribes.find({}).exec();
    console.log(tribes);

    if (tribes.length > 0) {
      res.json(tribes);
    } else {
      return res.status(404).json({
        error: 'No tribes were found',
      });
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
};
