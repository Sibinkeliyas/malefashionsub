

const mongodb = require("mongodb");

const db = "mongodb://0.0.0.0:27017/"

const MongoClient = mongodb.MongoClient;

const mongoDbUrl = db;


let _db;

const connect = (callback) => {
  if (_db) {
    console.log("Database is already initialized!");
    return callback(null, _db);
  }
  MongoClient.connect(mongoDbUrl)
    .then((client) => {
      _db = client.db("malefashion");
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};


const get = () => {
  if (!_db) {
    throw Error("Database not initialzed");
  }
  return _db;
};

module.exports = {
  connect,
  get,
};