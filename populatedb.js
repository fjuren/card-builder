console.log('This script will populate sample game cards, users, and types');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async');
const mongoose = require('mongoose');
const Users = require('./models/users');
const Cards = require('./models/cards');
const Types = require('./models/types');

mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));
