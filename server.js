'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Exercise = require('./models/exercise');
const User = require('./models/user');
const {
  user_create,
  users_list,
  exercise_add,
  user_log
} = require('./controllers/controllers')

const app = express();
// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({'extended': false}));

app.use("/public", express.static(process.cwd() + "/public"));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint ...
app.get('/api/hello', (req, res) => {
  res.json({greeting: 'hello API'});
});

app.post('/api/exercise/new-user', user_create);

app.get('/api/exercise/users', users_list);

app.get('/api/exercise/log', user_log);

app.post('/api/exercise/add', exercise_add)

app.listen(port, () => {
  console.log('Node.js listening ...');
});
