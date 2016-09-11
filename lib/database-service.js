var Datastore = require('nedb');
var Promise = require('promise');
var slice = Array.prototype.slice;
var dbList = {};

/**
 * Loads database requested.
 * 
 * @param request
 * @returns promise.
 */
function loadDatabase(fileName) {
  var db = dbList[fileName];
  if (db) {
    return Promise.resolve(db);
  }
  
  return new Promise(function(resolve, reject) {
    db = new Datastore({ filename: process.env.DB_PATH + '/' + fileName });
    db.loadDatabase(function(err) {
      if (err)
        return reject(err);
      
      dbList[fileName] = db;
      resolve(db);
    });
  });
}

/**
 * Process unified request from server.
 */
function processRequest(request, callback) {
  callOperation(request, function(/*arguments*/) {
    var response = {
        data: slice.call(arguments),
        methodType: request.methodType
    };
    
    callback(response);
  });
}

/**
 * Calls database operation which is requested.
 */
function callOperation(request, callback) {
  loadDatabase(request.fileName).then(function(db) {
    request.data.push(callback);
    db[request.methodType].apply(db, request.data);    
  }).catch(callback);
}

exports.processRequest = processRequest;