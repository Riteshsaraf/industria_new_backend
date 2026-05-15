require('reflect-metadata');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');

const projectsController =
  require('./projects/projects.controller');

const app = express();

app.use(bodyParser.json());

/*
|--------------------------------------------------------------------------
| CORS FIX
|--------------------------------------------------------------------------
*/

app.use(function(req, res, next) {

  res.header(
    'Access-Control-Allow-Origin',
    '*'
  );

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();

});

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use('/projects', projectsController);

sequelize.sync()
  .then(() => {

    console.log('MySQL connected');

    app.listen(4000, () => {

      console.log(
        'Server running on port 3000'
      );

    });

  })
  .catch(err => {

    console.log(err);

  });