// auth-api: define app routes
const express = require('express');

const authActions = require('../controllers/auth-controllers');

// initialize router
const router = express.Router();

// add routes
router.get('/hashed-pw/:password', authActions.getHashedPassword);

router.post('/token', authActions.getToken);

router.post('/verify-token', authActions.getTokenConfirmation);

module.exports = router;
