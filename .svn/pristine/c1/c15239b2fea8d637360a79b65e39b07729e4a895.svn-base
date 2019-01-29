const _=require('underscore');
let Visitor = require('../models/visitor.js');
let Employee= require('../models/employee.js');
let unit    =require('../models/unit.js');
let async=require('async');

module.exports=User;

function User(){

}

User.getUser=function(visitorId,employeeId,callback){
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
                        callback(null,ret);
                    }else{
                        callback('error query from id failed:'+err);
                    }
                }
            });
        }
    ],function(err,results){
        if(err){
            unit.showError(res,'创建预访失败 \n'+err);
            callback(err);
        }else{
            callback(null,results);
            // let ret1=results[0];
            // let ret2=results[1];
            // renderUrl += "visitorTel=" + ret1.visitorTel;
            // renderUrl += "&";
            // renderUrl += "visitorName=" +ret1.visitorName;
            // let data = {};
            // data.name = {
            //     value: ret1.visitorName,
            //     color: "#173177"
            // };
            // data.begin = {
            //     value: beginTime,
            //     color: "#173177"
            // };
            // data.end = {
            //     value: endTime,
            //     color: '#173177'
            // };
            // let tempId = "Eteyx38JqQ-XXcXLJvlK3nWqMeh7my5AY4zUAvkB6Mw";
            // Wechat.pushTemplateMessage(ret2.employeeWechatId, tempId, data, renderUrl)
            //     .then(function (result) {
            //         unit.showHint(res,'预约成功，等待对方确认！');
            //     }).catch(function (err) {
            //     unit.showError(res,'创建预访失败 \n'+err);
            // })
        }
    });

};
