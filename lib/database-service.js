var Datastore = require('nedb');
var db = new Datastore({ filename: process.env.DB_PATH + 'collection' });
db.loadDatabase();

/**
 * Inserts doc into database.
 */
exports.insert = function(doc, callback) {
  db.insert(doc, callback);
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
