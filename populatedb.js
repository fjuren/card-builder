console.log('This script will populate sample game cards, users, and types');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async');
const mongoose = require('mongoose');
// const Users = require('./models/users');
const Cards = require('./models/cards');
const Types = require('./models/types');

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

const cards = [];
const types = [];
// const users = []

// function to create cards
function cardCreate(
  name,
  hp,
  type,
  //   image,
  description,
  attack1,
  damage1,
  cost1,
  attack2,
  damage2,
  cost2,
  weakness,
  resistance,
  retreatCost,
  createdDate,
  cb
) {
  const cardDetail = {
    name,
    hp,
    type,
    // image,
    description,
    attack1,
    damage1,
    cost1,
    attack2,
    damage2,
    cost2,
    weakness,
    resistance,
    retreatCost,
    createdDate,
  };

  const card = new Cards(cardDetail);

  card.save((err) => {
    if (err) {
      cb(err, null);
    }
    console.log(`New card: ${card}`);
    cards.push(card);
    cb(null, card);
  });
}

// function to create types
function typeCreate(typeName, cb) {
  const typeDetail = { type: typeName };

  const type = new Types(typeDetail);

  type.save((err) => {
    if (err) {
      cb(err, null);
    }
    console.log(`New type: ${type}`);
    types.push(type);
    cb(null, type);
  });
}

function createCards(cb) {
  async.parallel(
    [
      function (callback) {
        cardCreate(
          'Charmander',
          50,
          types[0],
          //   'https://static.wikia.nocookie.net/sonicpokemon/images/e/e0/Charmander_AG_anime.png/revision/latest/scale-to-width-down/177?cb=20130714191911',
          'Obviously prefers hot places',
          'Scratch',
          10,
          types[1],
          'Ember',
          30,
          types[0],
          types[0],
          types[0],
          types[0],
          new Date(),
          callback
        );
      },
    ],
    cb
  );
}

function createTypes(cb) {
  async.parallel(
    [
      function (callback) {
        typeCreate('Normal', callback);
      },
      function (callback) {
        typeCreate('Fire', callback);
      },
      function (callback) {
        typeCreate('Water', callback);
      },
      //   function (callback) {
      //     typeCreate('Grass', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Electric', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Ice', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Fighting', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Poison', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Ground', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Flying', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Psychic', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Bug', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Rock', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Ghost', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Dark', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Dragon', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Steel', callback);
      //   },
      //   function (callback) {
      //     typeCreate('Fairy', callback);
      //   },
    ],
    cb
  );
}

async.series([createTypes, createCards], (err, results) => {
  if (err) {
    console.log(`Final err: ${err}`);
  }
  mongoose.connection.close();
});
