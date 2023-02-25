console.log('This script will populate sample game cards, users, and types');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async');
// const Users = require('./models/users');
const mongoose = require('mongoose');
const Cards = require('./models/cards');
const Types = require('./models/types');

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

const types = [];
const cards = [];
// const users = []

// function to create types
function typeCreate(typeName, cb) {
  const typeDetail = { type: typeName };

  const type = new Types(typeDetail);

  type.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New type: ${type}`);
    types.push(type);
    cb(null, type);
  });
}

// function to create cards
function cardCreate(
  name,
  hp,
  type,
  //   image,
  description,
  attack_1,
  damage_1,
  cost_1,
  attack_2,
  damage_2,
  cost_2,
  weakness,
  resistance,
  retreat_cost,
  created_date,
  cb
) {
  const cardDetail = {
    name,
    hp,
    type,
    // image,
    description,
    attack_1,
    damage_1,
    cost_1,
    attack_2,
    damage_2,
    created_date,
  };
  // handle fields that aren't required
  if (cost_2 !== false) {
    cardDetail.cost2 = cost_2;
  }
  if (weakness !== false) {
    cardDetail.weakness = weakness;
  }
  if (resistance !== false) {
    cardDetail.resistance = resistance;
  }
  if (retreat_cost !== false) {
    cardDetail.retreat_cost = retreat_cost;
  }

  const card = new Cards(cardDetail);

  card.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New card: ${card}`);
    cards.push(card);
    cb(null, card);
  });
}

// function createCards(cb) {
//   async.parallel(
//     [
//       function (callback) {
//         cardCreate(
//           'Charmander',
//           50,
//           types[0],
//           //   'https://static.wikia.nocookie.net/sonicpokemon/images/e/e0/Charmander_AG_anime.png/revision/latest/scale-to-width-down/177?cb=20130714191911',
//           'Obviously prefers hot places',
//           'Scratch',
//           10,
//           types[1],
//           'Ember',
//           30,
//           types[0],
//           types[0],
//           types[0],
//           types[0],
//           new Date(),
//           callback
//         );
//       },
//     ],
//     cb
//   );
// }

function createTypeCards(cb) {
  async.series(
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
      function (callback) {
        cardCreate(
          'Charmander', // name
          50, // hp
          [types[0]], // type
          //   'https://static.wikia.nocookie.net/sonicpokemon/images/e/e0/Charmander_AG_anime.png/revision/latest/scale-to-width-down/177?cb=20130714191911',
          'Obviously prefers hot places', // description
          'Scratch', // attack 1
          10, // damage 1
          [types[1]], // cost 1
          'Ember', // attack 2
          30, // damage 2
          [types[0]], // cost 2
          [types[0]], // weakeness
          [types[0], types[1]], // resistance
          [types[0]], // retreat cost
          new Date(), // created date
          callback
        );
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

async.series([createTypeCards], (err, results) => {
  if (err) {
    console.log(`Final err: ${err}`);
  }
  mongoose.connection.close();
});
