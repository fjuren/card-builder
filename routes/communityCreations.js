const express = require('express');

const router = express.Router();
const cardsController = require('../controllers/cardsController');

// GET Homepage (Community Creations page)
router.get('/', cardsController.index);

// GET request for viewing individual cards
router.get('/cards/:id', cardsController.card_details);

// GET request for creating a new card

// POST request for creatign a new card

// GET request for deleteing a card

// POST request for deleting a card

// GET request for editing a card

// POST request for editing a card

module.exports = router;
