console.log('This script will populate sample game cards, users, and types');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async');
const mongoose = require('mongoose');
// const Users = require('./models/users');
// const Cards = require('./models/cards');
const Types = require('./models/types');

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

// const cards = [];
const types = [];
// const users = []

// create the types
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

async.series([createTypes], (err, results) => {
  if (err) {
    console.log(`Final err: ${err}`);
  }
  mongoose.connection.close();
});
