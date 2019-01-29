/**
 * Created by merci on 2016/11/9.
 */
// let rsclient=require('./lib/rsclient.js');
// let rtcp=require('./config/rtcp.json');
let _= require('underscore');
module.exports=function(config){
    let app = require('./app');
    let debug = require('debug')('web:server');
    let http = require('http');

    /**
     * Get port from environment and store in Express.
     */
    let port = normalizePort(config.port);
    app.set('port', port);

    /**
     * Create HTTP server.
     */
    var server = http.createServer(app);
    let IoSocket= require('./models/IoSocket.js');
    IoSocket.init(server);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    // var message=require('./lib/message.js');
    // message.sender(IoSocket.getIo());
    // message.start();

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(port) {

        if (isNaN(port)) {
            return 80;
        }
        if (port >= 80&&port<65535) {
            // port number
            return port;
        }
        return 80;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('Listening on ' + bind);
    }

}