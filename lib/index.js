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

var port = process.env.PORT || 7000;
require('./server').startServer(port);
console.log('server is listening at port ' + port);