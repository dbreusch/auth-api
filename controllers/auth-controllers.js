// auth-api: action functions
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { createAndThrowError } = require('../helpers/error');

// return a bcrypt-hashed version of a plain-text password
const createPasswordHash = async (password) => {
  try {
    // console.log(password);
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  } catch (err) {
    createAndThrowError('Failed to create secure password.', 500);
  }
};

// verify a password against its hashed-and-stored version
const verifyPasswordHash = async (password, hashedPassword) => {
  let passwordIsValid;
  try {
    passwordIsValid = await bcrypt.compare(password, hashedPassword);
    // console.log(passwordIsValid, password, hashedPassword);
  } catch (err) {
    createAndThrowError('Failed to verify password.', 500);
  }
  if (!passwordIsValid) {
    createAndThrowError('Failed to verify password.', 401);
  }
};

// create a new jsonwebtoken
const createToken = (userId) => {
  return jwt.sign({ uid: userId }, process.env.TOKEN_KEY, {
    expiresIn: '6h',
  });
};

// verify a JWT token against key
const verifyToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    return decodedToken;
  } catch (err) {
    createAndThrowError('Could not verify token.', 401);
  }
};

// return hashed version of plain-text password
const getHashedPassword = async (req, res, next) => {
  const rawPassword = req.params.password;
  try {
    const hashedPassword = await createPasswordHash(rawPassword);
    res.status(200).json({ hashed: hashedPassword });
  } catch (err) {
    next(err);
  }
};

// return a new JWT token after verifying user password
const getToken = async (req, res, next) => {
  const userId = req.body.userId;
  const password = req.body.password;
  const hashedPassword = req.body.hashedPassword;
  // console.log(`auth-controller:getToken ${userId}`)
  try {
    await verifyPasswordHash(password, hashedPassword);
  } catch (err) {
    return next(err);
  }

  const token = createToken(userId);
  // console.log(`auth-controller:getToken ${token}`)

  res.status(200).json({ token });
};

// return a decoded JWT token
const getTokenConfirmation = (req, res) => {
  const token = req.body.token;

  const decodedToken = verifyToken(token);

  res.status(200).json({ uid: decodedToken.uid });
};

exports.getHashedPassword = getHashedPassword;
exports.getToken = getToken;
exports.getTokenConfirmation = getTokenConfirmation;
