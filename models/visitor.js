
let async=require('async');
let _=require('underscore');
let client=require('../lib/rsclient.js')();
let unit=require('./unit');
let Wechat=require('./wechat.js');
let Employee=require('./employee');

module.exports=Visitor;
function Visitor() {

}

Visitor.setup = function () {
    if (! Visitor._init){
        Visitor.pin='field:visitor,role:*';
        Visitor._init=true;
    }
    client.on('visitor.record.create',function(data){
        pushTemplateMessage(data);
    });
};

/**
 *  ��Ա�����ͣ��µ�ԤԼ��Ϣ
 *
 * @param data
 */
function pushTemplateMessage(data){
    let visitorId = data.visitor.id;
    let employeeId = data.employee.id;
    let beginTime = unit.time2Str(data.begin);
    let endTime = unit.time2Str(data.end);
    let renderUrl = "http://minima.mynatapp.cc/employee/tempMsgToAppointmentConfirming?";
    renderUrl += "visitorTime=" + data.begin;
    renderUrl += "&";
    renderUrl +='id='+data.id;
    renderUrl += "&";
    async.parallel([
        function(callback){
            Visitor.queryFromId(visitorId, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    if (null != result && result.length !== 0) {
                        let ret={};
                        ret.visitorName = result[0].name;
                        ret.visitorTel = result[0].phone;
                        callback(null,ret);
                    }else{
                        callback('error query from id failed:'+err);
                    }
                }
            });
        },
        function(callback){
            Employee.queryFromId(employeeId, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    if (null != result) {
                        let ret={};
                        ret.employeeWechatId=result[0].wechat;
                        ret.employeeName=result[0].name;
                        callback(null,ret);
                    }else{
                        callback('error query from id failed:'+err);
                    }
                }
            });
        }
    ],function(err,results){
        if(err){
            let err='ƽ̨������ visitor.record.create��Ϣ'+err;
            unit.err(err);
        }else{
            let ret1=results[0];
            let ret2=results[1];
            renderUrl += "visitorTel=" + ret1.visitorTel;
            renderUrl += "&";
            renderUrl += "visitorName=" +ret1.visitorName;
            let data = {};
            data.name = {
                value: ret1.visitorName,
                color: "#173177"
            };
            data.begin = {
                value: beginTime,
                color: "#173177"
            };
            data.end = {
                value: endTime,
                color: '#173177'
            };

            let msg=" �ÿ� "+ret1.visitorName+" �� "+ret2.employeeName;
            // ��Ա������Լ�ˣ�����ԤԼ��Ϣ
            let tempId = "Eteyx38JqQ-XXcXLJvlK3nWqMeh7my5AY4zUAvkB6Mw";
            Wechat.pushTemplateMessage(ret2.employeeWechatId, tempId, data, renderUrl)
                .then(function (result) {
                    msg+= " ����ԤԼ��Ϣ resutl:"+JSON.stringify(result);
                    unit.log(msg);
                }).catch(function (err) {
                msg+=" ����ԤԼ��Ϣ err:"+JSON.stringify(err);
                unit.err(msg);
            })
        }
    });
}

Visitor.queryUsers = function (name, phone, cb) {
    let param={};
    param.name=name;
    param.phone=phone;
    let pattern={field:'visitor',role:'manager',cmd:'query',param:param};
    client.act(Visitor.pin,pattern,cb);
};

Visitor.queryFromPhone = function (phone, cb) {
    let param={};
    param.phone=phone;
    let pin='field:visitor,role:*';
    let pattern={field:'visitor',role:'manager',cmd:'query',param:param};
    client.act(Visitor.pin,pattern,cb);
};

Visitor.queryWechatId = function (id, cb) {
    let param={};
    param.wechat=id;
    let pattern={field:'visitor',role:'manager',cmd:'query',param:param};
    client.act(Visitor.pin,pattern,cb);
};

Visitor.queryFromId = function (id, cb) {
    let param={};
    param.id=id;
    let pattern={field:'visitor',role:'manager',cmd:'query',param:param};
    client.act(Visitor.pin,pattern,cb);
};

Visitor.findUsers = function(cb){
    let pattern={field:'visitor',role:'manager',cmd:'find'};
    client.act(Visitor.pin,pattern,cb);
};

Visitor.createUser = function(name,phone,wechatId,cb){
    let param={};
    param.name=name;
    param.phone=phone;
    param.email='qq@qq.com';
    param.description='';
    param.wechat=wechatId;
    let pattern={field:'visitor',role:'manager',cmd:'create',param};
    client.act(Visitor.pin,pattern,cb);
};


Visitor.updateUser =function(id,name,phone,sex,card,idCard,email,wechat,description,cb){
    let param = {};
    param.id=id;
    if (!_.isNull(name)){
        param.name=name;
    }

    if (!_.isNull(phone)){
        param.phone=phone;
    }
    if (!_.isNull(card)){
        param.card=card;
    }
    if (!_.isNull(sex)){
        param.sex=sex;
    }
    if (!_.isNull(idCard)){
        param.idcard=idCard;
    }
    if (!_.isNull(email)){
        param.email=email;
    }
    if (!_.isNull(wechat)){
        param.wechat=wechat;
    }
    if (!_.isNull(description)){
        param.description=description;
    }

    let pattern={field:'visitor',role:'manager',cmd:'update',param};
    client.act(Visitor.pin,pattern,cb);
};



Visitor.delUser =function(id,cb){
    let param = {};
    param.id=id;
    let pattern={field:'visitor',role:'manager',cmd:'delete',param};
    client.act(Visitor.pin,pattern,cb);
};

Visitor.setup();