const request = require('supertest');
const index = require('../routes/index');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

describe('GET /', () => {
  describe('When submitting a get request to the home route', () => {
    test('Page should redirect to /cards', (done) => {
      request(app).get('/').expect('Location', '/cards').expect(302, done);
    });
  });
});
