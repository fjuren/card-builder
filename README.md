# Card Builder

This project was a blast to build. I created this site mainly to practice backend development rather than frontend where I let myself try new things and learn.

Hope you have fun poking around!

:point_right: [Live demo](https://card-builder-production.up.railway.app/cards) :point_left:

_note: Because I wanted anyone to try this out, you can use any fake email you want :) _

## Features

### Users

- Authentication (sign up / log in / log out)
- Gain more access when logging in to do things like creating your own cards
- Update permissions to become a community member and/or site admin
  - Password for membership: MasterMember2023
  - Password for admin: MasterAdmin2023

### Cards

- View cards created by the community
- View card details and associated comments
- Create simple cards for fun! Add
- If a user is logged in:
  - Post comments to cards
- If a user is logged in & has a membership:
  - Same feature as just a logged in user
  - Gains access to a 'My cards' page to view cards created by the logged in user
  - Create / edit / update / delete cards created by the logged in user
- If a user is logged in & is admin:
  - Same features as a logged in user
  - Delete any created cards

### Comments

- Post comments to cards created by the community! Give people tips on how to improve their cards (let's assume people will draw their cards to battle it out for victory!)

## Main technologies used

- NodeJS
- Express
- EJS

## Getting started

### Clone repository

```
git clone https://github.com/fjuren/card-builder.git
cd card-builder
```

### Setup your MongoDB

- If you don't have an account, create a free one!
- create cluster
- create collection
- Note down the URL to connect to your db

### Set up env variables

```
mongoURL="your mongo url with username & password"
Session_Secrete="pokesecrets"
memberPassword="MasterMember2023"
adminPassword="MasterAdmin2023"
```

### Install packages and start client

```
npm i
npm run start
```

If you'd like to populate your community page with fake data quickly, run the following script:

```
node populatedb <myMongoDBURL>
```

_note: if you're on windows, add quotes around your "myMongoDBURL". Also don't forget to include your mongo username & password!_
