// auth-api: main app
const express = require('express');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth-routes');

// define port from environment or default to 8080
dotenv.config();
const port = process.env.PORT || 8080;

// initialize express
const app = express();

// parse incoming POST requests with JSON payloads (default type application/json)
app.use(express.json());

// handle CORS
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

// this function only runs if nothing else responded first
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

// generic error handler (because there are FOUR args)
app.use((err, req, res, next) => {
  if (res.headerSent) { // just return/goto next if a response already exists
    return next(err);
  }

  res.status(err.code || 500);
  res.json({ message: err.message || 'auth-app/generic error handler: Something went wrong.' });
});

// start listening!
console.log(`Listening on port ${port}`);
app.listen(port);
