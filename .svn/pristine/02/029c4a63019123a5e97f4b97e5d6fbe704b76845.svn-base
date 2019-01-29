/**
 * Created by merci on 2017/5/25.
 */
module.exports=Message;
var redis=require('redis');
var config=require('../config/host.json');

function Message(){

}
Message.sender=function(io){
    Message.io=io;
}
Message.start=function(){
    var token = redis.createClient(config.port,config.host);
    token.subscribe('event');
    token.subscribe('message');

    token.on("connect",function(err){
        console.log('connect to redis subscribe channel');
    });
    token.on("error",function(err){
        console.log('connect to redis subscribe channel failed:'+err);
    });
    token.on('message',function(channel,data){
        if(Message.io){
            Message.io.emit(channel,data);
        }
    });
}