var nssocket = require('nssocket');
var database = require('./database-service');
var argv = require('minimist')(process.argv.slice(2));

Object.keys(argv).forEach(function(key) {
  switch (key) {
    case 'port':
      process.env.PORT = argv.port;
      break;
    case 'dir' :
      process.env.DB_PATH = argv.dir;
      break;
  }
});

if (!process.env.DB_PATH) {
  console.error('missing required flag --dir');
  process.exit();  
}

/**
 * Socket handler. 
 * 
 * @param socket
 */
function socketHandler(socket) {
  // fields are request - data, methodType, reqId, fileName,
  // send event: call_cb_$reqId.
  socket.data('dbcall', function(request) {
    database.processRequest(request, function(response) {
      response.reqId = request.reqId;
      socket.send('dbcall_cb_' + request.reqId, response);
    });
  });
}

/**
 * Main method for starting a server.
 */
function main() {
  var port = process.env.PORT || 7000;  
  nssocket.createServer(socketHandler).listen(port);
  
  console.log('Server listening at port ' + port);
}

// call main method.
main();