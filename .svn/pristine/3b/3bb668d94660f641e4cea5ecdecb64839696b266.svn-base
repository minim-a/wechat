/**
 * Created by merci on 2016/11/9.
 */
var config=require('./config/config.json');
if(config.cluster){
    var cluster = require('cluster');
    var numCPUs = require('os').cpus().length;

    if (cluster.isMaster) {
        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            var env={};
            env.config=JSON.stringify(config);
            cluster.fork(env);
        }

        cluster.on('exit', function(worker, code, signal) {
            console.log('worker ' + worker.process.pid + ' died');
        });
    } else {
        var server=require('./server.js');
        var env=JSON.parse(process.env.config);
        server(env);
    }
}
else{
    var server=require('./server.js');
    server(config);
}