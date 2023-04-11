console.log('This script will populate sample game cards, users, and types');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async');
const mongoose = require('mongoose');
const Users = require('./models/users');
const Cards = require('./models/cards');
const Types = require('./models/types');
const Comments = require('./models/comments');

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

const users = [];
const types = [];
const cards = [];
const comments = [];

// function to create users
function userCreate(
  card_id,
  username,
  firstname,
  password,
  membershipstatus,
  isAdmin,
  account_created_date,
  cb
) {
  const userDetail = {
    card_id,
    username,
    firstname,
    password,
    membershipstatus,
    isAdmin,
    account_created_date,
  };
  const user = new Users(userDetail);

  user.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New user: ${user}`);
    users.push(user);
    cb(null, user);
  });
}

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

// function to create comments for cards
function commentCreate(user_id, body, comment_date, cb) {
  const commentDetail = {
    user_id,
    body,
    comment_date,
  };
  const comment = new Comments(commentDetail);

  comment.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New comment: ${comment}`);
    comments.push(comment);
    cb(null, comment);
  });
}

// function to create cards
function cardCreate(
  name,
  hp,
  type,
  // image,
  description,
  attack_1,
  attack_1_description,
  damage_1,
  cost_1,
  attack_2,
  attack_2_description,
  damage_2,
  cost_2,
  weakness,
  resistance,
  retreat_cost,
  created_date,
  comments,
  cb
) {
  const cardDetail = {
    name,
    hp,
    type,
    // image,
    description,
    attack_1,
    cost_1,
    attack_2,
    created_date,
    comments,
  };
  // handle fields that aren't required
  if (attack_1_description !== false) {
    cardDetail.attack_1_description = attack_1_description;
  }
  if (damage_1 !== false) {
    cardDetail.damage_1 = damage_1;
  }
  if (damage_2 !== false) {
    cardDetail.damage_2 = damage_2;
  }
  if (attack_2_description !== false) {
    cardDetail.attack_2_description = attack_2_description;
  }
  if (cost_2 !== false) {
    cardDetail.cost_2 = cost_2;
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

function createData(cb) {
  async.series(
    [
      //  ADD FAKE TYPE DATA
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
        typeCreate('Grass', callback);
      },
      function (callback) {
        typeCreate('Electric', callback);
      },
      function (callback) {
        typeCreate('Ice', callback);
      },
      function (callback) {
        typeCreate('Fighting', callback);
      },
      function (callback) {
        typeCreate('Poison', callback);
      },
      function (callback) {
        typeCreate('Ground', callback);
      },
      function (callback) {
        typeCreate('Flying', callback);
      },
      function (callback) {
        typeCreate('Psychic', callback);
      },
      function (callback) {
        typeCreate('Bug', callback);
      },
      function (callback) {
        typeCreate('Rock', callback);
      },
      function (callback) {
        typeCreate('Ghost', callback);
      },
      function (callback) {
        typeCreate('Dark', callback);
      },
      function (callback) {
        typeCreate('Dragon', callback);
      },
      function (callback) {
        typeCreate('Steel', callback);
      },
      function (callback) {
        typeCreate('Fairy', callback);
      },
      function (callback) {
        typeCreate('Energy', callback);
      },
      function (callback) {
        userCreate(
          [cards[3], cards[1]], // card_id
          'Admin&Member', // username,
          'John', // firstname
          'AdminMember!', // password
          true, // membershipstatus
          true, // isAdmin
          new Date(), // account_created_date
          callback
        );
      },
      function (callback) {
        userCreate(
          [cards[0]], // card_id
          'Member', // username,
          'Sally', // firstname
          'Member!', // password
          true, // membershipstatus
          false, // isAdmin
          new Date(), // account_created_date
          callback
        );
      },
      function (callback) {
        userCreate(
          [cards[2]], // card_id
          'JSdude', // username,
          'Todd', // firstname
          'random!', // password
          false, // membershipstatus
          false, // isAdmin
          new Date(), // account_created_date
          callback
        );
      },
      // Add fake comments
      function (callback) {
        commentCreate(
          users[0], // user_id
          'Cool card!', // comment
          new Date(), // comment_date
          callback
        );
      },
      function (callback) {
        commentCreate(
          users[1],
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          new Date(),
          callback
        );
      },
      //  ADD FAKE CARD DATA
      function (callback) {
        cardCreate(
          'Charmander', // name
          50, // hp
          types[0], // type
          // 'https://static.wikia.nocookie.net/sonicpokemon/images/e/e0/Charmander_AG_anime.png/revision/latest/scale-to-width-down/177?cb=20130714191911',
          'Obviously prefers hot places', // description
          'Scratch', // attack 1
          null, // attack 1 description
          10, // damage 1
          [types[1]], // cost 1
          'Ember', // attack 2
          null, // attack 2 description
          30, // damage 2
          [types[0]], // cost 2
          [types[0]], // weakeness
          [types[0], types[1]], // resistance
          [types[0]], // retreat cost
          new Date(), // created date
          [], //comments
          callback
        );
      },
      function (callback) {
        cardCreate(
          'Pikachu', // name
          60, // hp
          types[4], // type
          // 'https://static.wikia.nocookie.net/sonicpokemon/images/e/e0/Charmander_AG_anime.png/revision/latest/scale-to-width-down/177?cb=20130714191911',
          'Its nature is to store up electricity', // description
          'Meal Time', // attack 1
          null, // attack 1 description
          10, // damage 1
          [types[4]], // cost 1
          'Gnaw', // attack 2
          null, // attack 2 description
          20, // damage 2
          [types[4], types[18]], // cost 2
          [types[2]], // weakeness
          [types[4]], // resistance
          [types[18], types[18]], // retreat cost
          new Date(), // created date
          [comments[0], comments[1]], //comments
          callback
        );
      },
      function (callback) {
        cardCreate(
          'Squirtle', // name
          50, // hp
          types[2], // type
          // 'https://static.wikia.nocookie.net/sonicpokemon/images/e/e0/Charmander_AG_anime.png/revision/latest/scale-to-width-down/177?cb=20130714191911',
          'After birth, its back swells and hardens into a shell', // description
          'Bubble', // attack 1
          'Flip a coin. If heads, the defending creature is now paralyzed', // attack 1 description
          10, // damage 1
          [types[2]], // cost 1
          'Withdraw', // attack 2
          "Flip a coin. If heads, prevent all damage done to Squirtle during your opponent's next turn. Any other effects of attacks still happen", // attack 2 description
          null, // damage 2
          [types[2], types[18]], // cost 2
          [types[4]], // weakeness
          [], // resistance
          [types[18]], // retreat cost
          new Date(), // created date
          [comments[0], comments[1]], //comments
          callback
        );
      },
      function (callback) {
        cardCreate(
          'Bulbasaur', // name
          60, // hp
          types[3], // type
          // 'https://static.wikia.nocookie.net/sonicpokemon/images/e/e0/Charmander_AG_anime.png/revision/latest/scale-to-width-down/177?cb=20130714191911',
          'For some time after its birth, it grows by gaining nourishment from the seed on its back', // description
          'Shake Vine', // attack 1
          'The defending creature is now asleep', // attack 1 description
          null, // damage 1
          [], // cost 1
          'Bullet Seed', // attack 2
          'Flip 4 coins. This attack does 10 damage times the number of heads', // attack 2
          10, // damage 2
          [types[3], types[18]], // cost 2
          [types[1]], // weakeness
          [types[2]], // resistance
          [types[18]], // retreat cost
          new Date(), // created date
          [comments[0], comments[1]], //comments
          callback
        );
      },
    ],
    cb
  );
}

// function createComments(cb) {
//   async.series(
//     [
//       // Add fake comments
//       function (callback) {
//         commentCreate(
//           user[0], // user_id
//           'Cool card!', // comment
//           new Date(), // comment_date
//           callback
//         );
//       },
//       function (callback) {
//         commentCreate(
//           user[1],
//           'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//           new Date(),
//           callback
//         );
//       },
//     ],
//     cb
//   );
// }

async.series([createData], (err) => {
  if (err) {
    console.log(`Final err: ${err}`);
  }
  mongoose.connection.close();
});
