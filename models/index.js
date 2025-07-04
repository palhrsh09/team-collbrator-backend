const mongoose = require("mongoose");
const redis = require("redis");

const db = {};
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: function (retries) {
      if (retries > 5) {
        return new Error("Too many retries.");
      } else {
        return retries * 200;
      }
    },
  },
});
redisClient

db.mongoose = mongoose;
db.redis = redisClient;
db.user = require("./user.model")
db.role = require("./role.model")
db.userToken= require('./userToken.model')

module.exports = db;