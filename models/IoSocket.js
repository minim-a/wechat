let _=require('underscore');
let unit=require('./unit.js');
let Record=require('./record.js');

module.exports=IoSocket;
function IoSocket() {
}

IoSocket.init=function (server) {
    if (!IoSocket._init){
        IoSocket.io=require('socket.io').listen(server);
       // IoSocket.io.set('log level',1);
        IoSocket._init=true;
        IoSocket._cache={};
        IoSocket.io.sockets.on('connection',function(socket){
            IoSocket.socket=socket;
            console.log('new socket connection');
            socket.emit('ack',{});
            socket.on('clientInfo',function (data) {
                let clientSocketId=data.clientSocketId;
                let code=data.code;
                Record.getCard(code,function (err,result) {
                    let param={};
                    param.result=false;
                    param.status='no';
                    let msg="访客："+result[0].visitor.name;
                    msg+="  自动更新门禁通行凭证";
                    if(!err && !_.isUndefined(result[0].card)){
                        msg+="   card:"+result[0].card;
                        param.card=result[0].card;
                        param.result=true;
                        param.status='ok';
                        msg+="\n"+JSON.stringify(result);
                        unit.log(msg);
                        socket.emit('flashCode',param);
                    }else{
                        IoSocket._cache[clientSocketId]={socketId:clientSocketId,code:data.code};
                        let msg="new socket Id:"+clientSocketId;
                        msg+="  value:"+JSON.stringify(IoSocket._cache[clientSocketId]);
                        let sk=_.findWhere(IoSocket._cache,{socketId:clientSocketId})
                        console.log(sk.id);

                        unit.log(msg);
                    }
                })
            });
            socket.on('disconnect',function (data) {
                if (_.has(IoSocket._cache,socket.id)){
                    let msg='socket id:'+socket.id+'断开连接';
                    unit.log(msg);
                    delete IoSocket._cache[socket.id];
                }
            });
        });
    }
}

IoSocket.getIo=function(){
    return IoSocket.io;
}


IoSocket.emitFlashCode=function (data) {
        let code=data.code;
        let single=_.findWhere(IoSocket._cache,{code:code});
        if (!_.isUndefined(single) && !_.isNull(single)){
            let socketId=single.socketId;
            let socket=_.findWhere(IoSocket.getIo().sockets.sockets,{id:socketId})
            if (!_.isUndefined(socket) && !_.isNull(socket)){
                let param={};
                param.card=data.card;
                param.result=true;
                param.status='ok';
                socket.emit('flashCode', param);
                let msg="访客："+data.visitor.name;
                msg+="  自动更新门禁通行凭证";
                msg+=JSON.stringify(param);
                unit.log(msg);
            }
        }
}

