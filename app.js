require('reflect-metadata');

require('./associations');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');

const path = require('path');

const projectsController =
  require('./projects/projects.controller');

const categoriesController =
  require('./categories/categories.controller');  

const clientsController =
  require('./clients/clients.controller');  

const companyController =
  require('./company/company.controller');  

const userController =
  require('./user/user.controller');  

  
const app = express();

// increase limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());
// serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/*
|--------------------------------------------------------------------------
| CORS FIX
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://reactfront.industriamovies.com"
];


app.use(function(req, res, next) {

   const origin = req.headers.origin;

  // check if request origin is allowed
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }


  res.header(
    "Access-Control-Allow-Credentials",
    "true"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
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
app.use('/categories', categoriesController);
app.use('/clients', clientsController);
app.use('/company', companyController);
app.use('/user', userController);

sequelize.sync()
  .then(() => {

    console.log('MySQL connected');

    app.get('/', (req, res) => {
      res.send('Hello World!'); 
    });

    app.listen(4000, () => {

      console.log(
        'Server running on port 4000'
      );

    });

  })
  .catch(err => {

    console.log(err);

  });