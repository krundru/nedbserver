var nssocket = require('nssocket');
var database = require('./database-service');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.dir) {
  console.error('missing required flag --dir');
  process.exit();  
}

process.env.DB_PATH = argv.dir;

/**
 * Socket handler. 
 * 
 * @param socket
 */
function socketHandler(socket) {
  // fields are request - data, methodType, reqId, fileName,
  // send event: call_cb.
  socket.data('dbcall', function(request) {
    database.processRequest(request, function(response) {      
      socket.send('dbcall_cb', response);
    });
  });
}

/**
 * Main method for starting a server.
 */
function main() {
  var port = argv.port || 7000;  
  nssocket.createServer(socketHandler).listen(port);
  
  console.log('Server listening at port ' + port);
}

// call main method.
main();