var Datastore = require('nedb');
var promise = require('promise');

/**
 * Loads database requested.
 * 
 * @param request
 * @returns
 */
function loadDatabase(request) {
  return new promise(function(res, rej) {
    var databaseName = request.dbName;
    var db = new Datastore({ filename: process.env.DB_PATH + '/' + databaseName });
    db.loadDatabase(function(err) {
      if (err)
        return rej(err);
      res(db);
    });
  });
}

/**
 * Inserts doc into database.
 */
exports.insert = function(request, callback) {
  loadDatabase(request).then(function(db) {    
    db.insert(request.data, callback);
  }).catch(callback);
}

/**
 * Finds documents from selected database.
 */
exports.find = function(query, callback) {
  db.find(query, callback);
}

/**
 * 
 */
exports.ensureIndex = function(query, callback) {
  db.find(query, callback);
}

/**
 * 
 */
exports.removeIndex = function(query, callback) {
  db.find(query, callback);
}

/**
 * 
 */
exports.update = function(query, callback) {
  db.find(query, callback);
}

/**
 * 
 */
exports.remove = function(query, callback) {
  db.find(query, callback);
}

/**
 * 
 */
exports.count = function(query, callback) {
  db.find(query, callback);
}
