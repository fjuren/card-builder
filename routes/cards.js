const express = require('express');
const router = express.Router();
const isAuth = require('../routes/isAuth').isAuth;
const isMember = require('../routes/isAuth').isMember;
const isAdmin = require('../routes/isAuth').isAdmin;
const cardsController = require('../controllers/cardsController');

// const upload = multer({ dest: './assets/pic_upload/' });

// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './assets/pic_upload/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now());
//   },
// });
// const upload = multer({ storage: storage });
// Guide: https://codedec.com/tutorials/image-uploading-to-mongodb-in-nodejs/

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// GET Homepage (Community Creations page)
router.get('/', cardsController.index);

// GET request for viewing individual cards
router.get('/card/:id', cardsController.card_details);

// GET request for creating a new card
router.get(
  '/create-card',
  isAuth,
  isMember || isAdmin,
  cardsController.card_create_get
);

// POST request for creatign a new card (with uploaded file to db)
router.post(
  '/create-card',
  isAuth,
  isMember || isAdmin,
  // upload.single('uploaded_card_file'),
  cardsController.card_create_post
);

// POST request for deleting a card from card details page
router.post(
  '/card/:id',
  isAuth,
  isMember || isAdmin,
  cardsController.card_delete_post
);

// POST request for deleting a card from the main page
router.post('/', isAuth, isMember || isAdmin, cardsController.card_delete_post);

// GET request for editing a card
router.get(
  '/card/:id/edit',
  isAuth,
  isMember || isAdmin,
  cardsController.card_edit_get
);

// POST request for editing a card
router.post(
  '/card/:id/edit',
  isAuth,
  isMember || isAdmin,
  cardsController.card_edit_post
);

module.exports = router;
