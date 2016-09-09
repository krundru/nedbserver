var nssocket = require('nssocket');
var database = require('./database-service');

/**
 * Socket handler. 
 * 
 * @param socket
 */
function socketHandler(socket) {
  // Socket events.
  
  
  // Database events.
  socket.data(['ensureIndex'], function(request) {
    var eventId = request.eventId;
    database.ensureIndex(request, function(err, result) {
      socket.send(['cb_' + eventId], {error:err, result: result});
    });
  });
  
  socket.data(['removeIndex'], function(request) {
    var eventId = request.eventId;
    database.removeIndex(request, function(err, result) {
      socket.send(['cb_' + eventId], {error:err, result: result});
    });
  });
  
  socket.data(['insert'], function (request) {
    var eventId = request.eventId;
    database.insert(request, function(err, result) {
      socket.send(['cb_' + eventId], {error:err, result: result});
    });
  });
  
  socket.data(['update'], function(request) {
    var eventId = request.eventId;
    database.update(request, function(err, result) {
      socket.send(['cb_' + eventId], {error:err, result: result});
    });
  });

  socket.data(['remove'], function(request) {
    var eventId = request.eventId;
    database.remove(request, function(err, result) {
      socket.send(['cb_' + eventId], {error:err, result: result});
    });
  });

  
  socket.data(['find'], function(request) {
    var eventId = request.eventId;
    database.find(request, function(err, result) {
      socket.send(['cb_' + eventId], {error:err, result: result});
    });
  });

  socket.data(['count'], function(request) {
    var eventId = request.eventId;
    database.count(request, function(err, result) {
      socket.send(['cb_' + eventId], {error:err, result: result});
    });
  });
}

/**
 * Create a server and start on given port.
 */
exports.startServer = function(port) {
  var server = nssocket.createServer(socketHandler);
  server.listen(port);
};
