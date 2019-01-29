let express = require('express');
let router = express.Router();
let _=require('underscore');
let Visitor = require('../models/visitor.js');
let Record  = require('../models/record.js');
let unit    = require('../models/unit.js');
let Wechat  = require('../models/wechat.js');
let moment=require('moment');

router.post('/invite',function (req,res,net) {
    let employee=JSON.parse(req.body.data);
    let employeeId  =employee.employeeId;
    let employeeName =employee.employeeName;
    let employeeWechatId=employee.employeeWechatId;
    let param={};
    let employeeData={};
    employeeData.employeeId=employeeId;
    employeeData.employeeName=employeeName;
    employeeData.employeeWechatId=employeeWechatId;
    param.employeeData=JSON.stringify(employeeData);
    res.render('invite',param);
});

/**
 *   进行邀请
 *     如访客无注册，需新建访客户（手机号&用户名），再创建邀约（预约）、再确认邀约（预约）。
 *     如访客已注册，创建邀约（预约）、再确认邀约（预约）;
 */
router.post('/toInvite',function (req,res,next) {
    let employeeData=JSON.parse(req.body.employeeData);
    let visitorName=req.body.visitorName;
    let visitorPhone=req.body.visitorPhone;
    let employeeId  =employeeData.employeeId;
    let employeeName =employeeData.employeeName;
    let code=unit.createNonce();
    let beginTime = req.body.beginTime;
    beginTime=beginTime ==='' ? moment().set({'hour': 0, 'minute': 1,'second':0}).unix(): moment(beginTime,'YYYY/MM/DD HH:mm').unix();
    let endTime=moment().set({'hour':23, 'minute': 59,'second':59}).unix();
    Visitor.queryUsers(visitorName,visitorPhone,function (err,result) {
        if (!err){
            if (_.isEmpty(result)){
                // 没有访客人员时，需要创建访客信息
                if (_.isEmpty(visitorName) || _.isEmpty(visitorPhone)){
                      let param={};
                      param.employeeData=JSON.stringify(employeeData);
                      return res.render('invite',param);
                }
                Visitor.createUser(visitorName,visitorPhone,"",function (err,result) {
                    if (!err){
                        if (!_.isEmpty(result)){
                            let visitorId=result.id;
                            let visitorName =result.name;
                            let visitor={id:visitorId,name:visitorName};
                            let employee={id:employeeId,name:employeeName};
                            Record.createAppointment(visitor,employee,code,beginTime,endTime,function (err,result) {
                               if (!err && !_.isEmpty(result)){
                                   console.log("创建邀访记录成功");
                                   let id=result.id;
                                   let statue='yes';
                                   let user=result.employee.id;
                                   Record.ack(id,statue,user,function (err,result) {
                                       if (!err && !_.isEmpty(result)){
                                           unit.showHint(res,'邀约功成,可分享给您的访客');
                                       }
                                   })
                               }
                            })
                        }
                    }
                })
            }else{
                // 已有访客户信息时，
                let visitorId=result[0].id;
                let visitorName =result[0].name;
                let visitor={id:visitorId,name:visitorName};
                let employee={id:employeeId,name:employeeName};
                Record.createAppointment(visitor,employee,code,beginTime,endTime,function (err,result) {
                    if (!err && !_.isNull(result)){
                        console.log("创建邀访记录成功");
                        let id=result.id;
                        let statue='yes';
                        let user=result.employee.id;
                        let employeeName=employee.name;
                        Record.ack(id,statue,user,function (err,result) {
                            if (!err && !_.isEmpty(result)){
                                let status= result.status === 'yes'?'欢迎来访':'暂不接待';
                                let visitorId=result.visitor.id;
                                let beginTime=unit.time2Str(result.begin);
                                let endTime  =unit.time2Str(result.end);
                                let renderUrl="http://minima.mynatapp.cc/visitor/visitTicket?";
                                renderUrl+="code="+result.code;
                                renderUrl+="&";
                                Visitor.queryFromId(visitorId,function (err,result) {
                                    if (err){
                                        unit.showError(res,'查询访客失败',err);
                                    }else{
                                        if (null != result && result.length !==0 ){
                                            let wechatId=result[0].wechat;
                                            let visitorName=result[0].name;
                                            let visitorTel=result[0].phone;
                                            renderUrl+="beginTime="+beginTime;
                                            renderUrl+="&";
                                            renderUrl+="endTime="+endTime;
                                            renderUrl+="&";
                                            renderUrl+="visitorName="+visitorName;
                                            let data={};
                                            data.status={
                                                value:status,
                                                color:"#173177"
                                            };
                                            data.name={
                                                value:employeeName,
                                                color:"#173177"
                                            };
                                            data.begin={
                                                value:beginTime,
                                                color:"#173177"
                                            };
                                            data.end={
                                                value:endTime,
                                                color:'#173177'
                                            };
                                            // 向访客推送预约回执
                                            let tempId="nf8BbbbmSJfygHbMY-iXwZSRmVdJ5HCcjqMfgBkAxxA";
                                            Wechat.pushTemplateMessage(wechatId,tempId,data,renderUrl)
                                                .then(function (result) {
                                                    let msg="邀约："+visitorName+"成功！";
                                                    msg+="向访客推送预约回执";
                                                    msg+="result:"+JSON.stringify(result);
                                                    unit.log(msg);
                                                    unit.showHint(res,"邀约功成，已回执给客户！");
                                                }).catch(function (err) {
                                                unit.showError(res,"邀约失败！",err);
                                            })
                                        }
                                    }
                                })
                            }else{
                                unit.showError(res,'邀约确认失败',err);
                            }
                        })
                    }else{
                        unit.showError(res,'建创邀约失败',err);
                    }
                })
            }
        }
    })
});

/**
 *  邀约时，查询已注册访客户
 */
router.post("/queryVisitor",function (req,res,next) {
    let data=JSON.parse(req.body.employeeData);
    let visitorPhone=req.body.visitorPhone;
    let employeeId=data.employeeId ;
    let employeeName = data.employeeName;
    let employeeWechatId=data.employeeWechatId;
    if (!_.isUndefined(visitorPhone)){
        Visitor.queryFromPhone(visitorPhone,function (err,result) {
            if (err){
                unit.showError(res,'查询访客户信息失败！'+err);
            }else{
                let param={};
                let employeeData ={};
                if (_.isEmpty(result)){
                    param.name="";
                }else{
                    param.visitorName=result[0].name;
                    param.visitorPhone=result[0].phone;
                }
                employeeData.employeeId=employeeId;
                employeeData.employeeName=employeeName;
                employeeData.employeeWechatId = employeeWechatId;
                param.employeeData=JSON.stringify(employeeData);
                param.visitorPhone=visitorPhone;
                res.render("invite",param);
            }
        })
    }
});

module.exports=router;