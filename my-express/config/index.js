require('dotenv').config();

module.exports = {
  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
  PORT: process.env.PORT || 4000
};
