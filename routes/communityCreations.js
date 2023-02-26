const express = require('express');

const router = express.Router();
const cardsController = require('../controllers/cardsController');

// GET Homepage (Community Creations page)
router.get('/', cardsController.index);

module.exports = router;
