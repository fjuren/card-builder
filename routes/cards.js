const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cardsController');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET Homepage (Community Creations page)
router.get('/', cardsController.index);

// GET request for viewing individual cards
router.get('/card/:id', cardsController.card_details);

// GET request for creating a new card
router.get('/create-card', cardsController.card_create_get);

// POST request for creatign a new card (with uploaded file to db)
router.post(
  '/create-card',
  upload.single('uploaded_card_file'),
  cardsController.card_create_post
);

// GET request for deleteing a card

// POST request for deleting a card
router.post('/card/:id', cardsController.card_delete_post);

// GET request for editing a card
router.get('/card/:id/edit', cardsController.card_edit_get);

// POST request for editing a card
router.post('/card/:id/edit', cardsController.card_edit_post);

module.exports = router;
