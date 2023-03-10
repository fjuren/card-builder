const express = require('express');

const router = express.Router();
const cardsController = require('../controllers/cardsController');

// GET Homepage (Community Creations page)
router.get('/', cardsController.index);

// GET request for viewing individual cards
router.get('/card/:id', cardsController.card_details);

// GET request for creating a new card
router.get('/create-card', cardsController.card_create_get);

// POST request for creatign a new card
router.post('/create-card', cardsController.card_create_post);

// GET request for deleteing a card

// POST request for deleting a card

// GET request for editing a card
router.get('/card/:id/edit', cardsController.card_edit_get);

// POST request for editing a card
router.post('/card/:id/edit', cardsController.card_edit_post);

module.exports = router;
