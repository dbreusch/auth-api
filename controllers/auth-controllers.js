// auth-api: action functions
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { createAndThrowError } = require('../helpers/error');
const { getEnvVar } = require('../helpers/getEnvVar');

// utility functions start here

// return a bcrypt-hashed version of a plain-text password
const createPasswordHash = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  } catch (err) {
    createAndThrowError('auth-api: Failed to create secure password.', 500);
  }
};

// verify a password against its hashed-and-stored version
const verifyPasswordHash = async (password, hashedPassword) => {
  let passwordIsValid;
  try {
    passwordIsValid = await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    createAndThrowError('auth-api: Unable to verify password.', 500);
  }
  if (!passwordIsValid) {
    createAndThrowError('auth-api: Password does not verify.', 401);
  } else {
    return true;
  }
};

// create a new jsonwebtoken (good for 24 hours!)
const createToken = (userId, isAdmin) => {
  try {
    const newToken = jwt.sign(
      {
        uid: userId,
        isAdmin: isAdmin
      },
      getEnvVar('TOKEN_KEY'),
      { expiresIn: '24h' }
    );
    return newToken;
  } catch (err) {
    createAndThrowError('auth-api: Could not create token.', 401);
  }
};

// verify a JWT token against key
const verifyToken = (token) => {
  try {
    const decodedToken = jwt.verify(
      token,
      getEnvVar('TOKEN_KEY')
    );
    return decodedToken;
  } catch (err) {
    createAndThrowError('auth-api: Could not verify token.', 401);
  }
};

// exported functions start here!

// return hashed version of plain-text password
const getHashedPassword = async (req, res, next) => {
  const rawPassword = req.params.password;

  try {
    const hashedPassword = await createPasswordHash(rawPassword);
    res.status(200).json({ hashed: hashedPassword });
  } catch (err) {
    return next(err);
  }
};

// return a new JWT token after verifying user password
const getToken = async (req, res, next) => {
  const userId = req.body.userId;
  const isAdmin = req.body.isAdmin;
  const password = req.body.password;
  const hashedPassword = req.body.hashedPassword;

  try {
    await verifyPasswordHash(password, hashedPassword);
  } catch (err) {
    // console.log('auth-api: password verify failed');
    return next(err);
  }

  const token = createToken(userId, isAdmin);
  res.status(200).json({ token });
};

// return userid from decoded JWT token
const getTokenConfirmation = (req, res, next) => {
  const token = req.body.token;

  try {
    const decodedToken = verifyToken(token);
    res.status(200).json({ uid: decodedToken.uid });
  } catch (err) {
    return next(err);
  }
};

// return "home" page
const getIndex = (req, res, next) => {
  res.sendFile(process.cwd() +"/public/index.html");
}

exports.getHashedPassword = getHashedPassword;
exports.getToken = getToken;
exports.getTokenConfirmation = getTokenConfirmation;
exports.getIndex = getIndex;
