// auth-api: main app
const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');

const HttpError = require('./helpers/http-error');
const authRoutes = require('./routes/auth-routes');

dotenv.config();

// define port from environment or default to 8080
const port = process.env.PORT || 8080;

// initialize express
const app = express();

// parse incoming POST requests with JSON payloads (default type application/json)
app.use(express.json());

// handle CORS
app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    '*'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS'
  );
  next();
});

// define routes
app.use(authRoutes);

// this function only runs if nothing else responded first
app.use((req, res, next) => {
  const error = new HttpError('auth-api: Could not find this route.', 404);
  throw error;
});

// generic error handler (because there are FOUR args)
app.use((err, req, res, next) => {
  if (res.headerSent) { // just return/goto next if a response already exists
    return next(err);
  }

  console.log(`Generic error handler: err.code = ${err.code}`);
  console.log(`  err.code = ${err.code}`);
  console.log(`  err.message = ${err.message}`);
  // res.status(err.code || 500);
  res.status(500);
  res.json({ message: err.message || 'auth-app/generic error handler: Something went wrong.' });
});


// Create an HTTPS listener that points to the express app
// Use a callback fn to tell when the server is created
// console.log(`Environment is ${process.env.NODE_ENV}`)
if (process.env.NODE_ENV === 'production') {
  // start listening!
  console.log(`Listening on port ${port}`);
  app.listen(port);

} else {
  https
    .createServer(
      // Provide the private and public key to the server by reading each
      // file's content using readFileSync
      {
        key: fs.readFileSync('ssl/key.pem'),
        cert: fs.readFileSync('ssl/cert.pem')
      },
      app
    )
    .listen(port, () => {
      console.log(`HTTPS server is running at port ${port}`);
    });
}
