// Simple utility function to create then throw an error using
// a specific message and code.
const createAndThrowError = (message, code) => {
  const error = new Error(message);
  error.code = code;
  throw error;
};

exports.createAndThrowError = createAndThrowError;
