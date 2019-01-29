

function handleTextMsg(message){
    var content = message.Content;
    var now = new Date().getTime();
    reply = '';
    if(content === 1) {
        reply = '<xml>' +
            '<ToUserName><![CDATA['+ message.FromUserName +']]></ToUserName>' +
            '<FromUserName><![CDATA['+ message.ToUserName +']]></FromUserName>' +
            '<CreateTime>'+ now +'</CreateTime>' +
            '<MsgType><![CDATA['+ message.MsgType +']]></MsgType>' +
            '<Content><![CDATA[~]]></Content>' +
            '</xml>';
    }
    return reply;
}

function handleClickMsg(message){
    var event = message.Event;
    var now = new Date().getTime();
    reply = '';
    switch (event) {
        case 'CLICK':
            reply = '<xml>' +
                '<ToUserName><![CDATA['+ message.FromUserName +']]></ToUserName>' +
                '<FromUserName><![CDATA['+ message.ToUserName +']]></FromUserName>' +
                '<CreateTime>'+ now +'</CreateTime>' +
                '<MsgType><![CDATA['+ message.MsgType +']]></MsgType>' +
                '<Content><![CDATA[额]]></Content>' +
                '</xml>';
            break;
        case 'VIEW':
            reply = '<xml>' +
                '<ToUserName><![CDATA['+ message.FromUserName +']]></ToUserName>' +
                '<FromUserName><![CDATA['+ message.ToUserName +']]></FromUserName>' +
                '<CreateTime>'+ now +'</CreateTime>' +
                '<MsgType><![CDATA['+ message.MsgType +']]></MsgType>' +
                '<Content><![CDATA[~]]></Content>' +
                '</xml>';
            break
    }
    return reply;
}
/**
 * 处理微信端发来的数据
 * @param obj
 * @returns {Promise<string>}
 */
exports.reply = function(obj) {
    var message = obj;
    var now = new Date().getTime();
    var reply = '';
    //判断消息类型是否是事件推送
    switch (message.MsgType) {
        case 'text':
            reply=handleTextMsg(message);
            break;
        case 'event':
            reply=handleClickMsg(message);
            break;
    }
    return reply;
};
    