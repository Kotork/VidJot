const express = require ('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Helper
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea Index Page
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})
    .sort({
      date: 'desc'
    })
    .then( ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });  
});

// Add Idea Form Route
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

// Edit Idea Form Route 
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then( idea => {
    if (idea.user != req.user.id) {
      req.flash('erros_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  });
});

// Process Form Route
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Please add a Title'
    });
  }

  if (!req.body.details) {
    errors.push({
      text: 'Please add some details'
    });
  }

  if (errors.length) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video Idea Added');
        res.redirect('/ideas');
      });
  }
});

// Edit Form Process Route
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then( idea => {
    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then( idea => {
        req.flash('success_msg', 'Video Idea Updated');
        res.redirect('/ideas');
      })
  });
});

// Delete Idea Route
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
  .then( () => {
    req.flash('success_msg', 'Video Idea Deleted');
    res.redirect('/ideas');
  });
});

module.exports = router;