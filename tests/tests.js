const index = require('../routes/index');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', index);

test('index route works', (done) => {
  request(app).get('/').expect();
});
