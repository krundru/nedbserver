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
    db.persistence.setAutocompactionInterval(process.env.DB_COMPACTION_SEC * 1000);
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
    if (db[request.methodType]) {
      db[request.methodType].apply(db, request.data);
    } else { // findplus.
      // remove callback from data.
      var query = request.data.pop();
      query = request.data[0];
      var find = db.find.apply(db, query.args);
      find = query.sort ? find.sort.apply(find, query.sort) : find;
      find = query.projection? find.projection.apply(find, query.projection) : find;
      find = query.skip ? find.skip.apply(find, query.skip) : find;
      find = query.limit ? find.limit.apply(find, query.limit) : find;      
      find.exec(callback);
    }
  });
}

exports.processRequest = processRequest;