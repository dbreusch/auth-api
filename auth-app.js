// auth-api: main app
const express = require('express');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth-routes');

// define port from environment or default to 8080
dotenv.config();
const port = process.env.PORT || 8080;

// initialize express
const app = express();

// convert POST/PUT requests to JSON
app.use(express.json());

// handle CORS
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});
// define routes
app.use(authRoutes);

// generic error handler
app.use((err, req, res, next) => {
  console.log(err);
  let code = 500;
  let message = 'auth-app: Something went wrong.';
  if (err.code) {
    code = err.code;
  }

  if (err.message) {
    message = err.message;
  }
  res.status(code).json({ message: message });
});

// start listening!
console.log(`Listening on port ${port}`);
app.listen(port);
