var Nedb = require('nedb');
var Promise = require('promise');
var slice = Array.prototype.slice;
var dbList = {};

/**
 * Class for database.
 * 
 * @param fileName
 * @returns
 */
function Database(filename) {
  this.promise = new Promise(function(res, rej) {
    var db = new Nedb({filename: process.env.DB_PATH + '/' + filename});
    db.loadDatabase(function(error) {
      if (error) {
        delete dbList[filename];
        return rej(error);
      }
      res(db);
    });
  });
}

/**
 * Execute given command on database. 
 */
Database.prototype.exec = function(onExec) {
  this.promise.then(function(val) {
    onExec(null, val);
  }, function(err) {
    onExec(err, null);
  });
};

/**
 * Loads database requested.
 * 
 * @param request
 * @returns promise.
 */
function loadDatabase(filename) {
  if (!dbList[filename]) {
    dbList[filename] = new Database(filename);
  }
  return dbList[filename];
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
  loadDatabase(request.fileName).exec(function(err, db) {
    if (err) {
      return callback(err);
    }
    request.data.push(callback);
    db[request.methodType].apply(db, request.data);    
  });
}

exports.processRequest = processRequest;