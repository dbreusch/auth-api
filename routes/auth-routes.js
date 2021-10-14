// auth-api: define app routes
const express = require('express');

const authControllers = require('../controllers/auth-controllers');

// initialize router
const router = express.Router();

// define available routes

// /hashed-pw: return hashed version of plain-text password
router.get('/hashed-pw/:password', authControllers.getHashedPassword);

// /token: return a new JWT token after verifying user password
router.post('/token', authControllers.getToken);

// /verify-token: return a decoded JWT token
router.post('/verify-token', authControllers.getTokenConfirmation);

module.exports = router;
