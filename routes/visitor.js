let express = require('express');
let router = express.Router();
let _=require('underscore');
let Visitor = require('../models/visitor.js');
let Employee= require('../models/employee.js');
let Record  = require('../models/record.js');
let Wechat  = require('../models/wechat.js');
let unit    =require('../models/unit.js');
let moment=require('moment');
let async=require('async');
let SocketIo=require('../models/IoSocket.js');

let checklist=new Object();


router.get('/',function (req,res,next) {
    res.render('visitor');

});

router.post('/',function (req,res,next) {
    let name=req.body.name;
    let phone=req.body.phone;
    if (_.isUndefined(name) || _.isUndefined(phone)){
        let param={};
        param.action="visitor/create";
        param.name="";
        param.phone="";
        // param.show="none";
        param.btn="确认";
        res.render('visitor',param);
    }else{
        Visitor.queryUsers(name,phone,function (err,result) {
            if (!err) {
                if (_.isEmpty(result)){
                    let param={};
                    param.action="visitor/create";
                    param.name="";
                    param.phone="";
                    param.show="none";
                    param.btn="确认";
                    res.render('visitor',param);
                }else{
                    let param={};
                    param.action="visitor/update";
                    param.name=result[0].name;
                    param.phone=result[0].phone;
                    param.btn="修改信息";
                    param.userId=result[0].id;
                    res.render('visitor',param);
                }
            }else{
                unit.showError(res,'查询用户信息失败！ \n'+err);
            }
        })
    }
});

router.post('/create',function (req,res,next) {
    let _data=JSON.parse(req.body.data);
    let _name  =req.body.name;
    let phone =req.body.phone;
    let _sex=req.body.sex;
    let _wechatId=_data.wechatId;
    if (! _name || ! phone){
        let param={};
        param.action="'visitor/create";
        param.name="";
        param.phone="";
        param.show="none";
        param.btn="注册";
        param.data=JSON.stringify(_data);
        res.render('visitor',param);
    }else{
        Visitor.queryWechatId(_wechatId,function (err,result){
            if (err){
                unit.showError(res,'查询微信ID失败！ \n'+err);
            }else{
                if (_.isEmpty(result)){
                    Visitor.queryFromPhone(phone,function (err,result) {
                        if (err){
                            unit.err(err);
                            unit.showError(res,"通过手机号查询",err);
                        }else{
                            if (!_.isEmpty(result)){
                                let id=result[0].id;
                                let phone=result[0].phone;
                                let wechatId=result[0].wechat;
                                if (_.isNull(wechatId) || _.isEqual(wechatId,'') || _.isEqual(wechatId,'invalid')){
                                    //  手机号与微信号未绑定
                                    Visitor.updateUser(id,_name,phone,_sex,null,null,null,_wechatId,null,function (err,result) {
                                        if (err){
                                            let msg="访客："+phone+"  更新失败";
                                            unit.err(msg);
                                            unit.showError(res,'更新失败！ \n'+err);
                                        }else{
                                            let param={};
                                            let data={};
                                            param.action="update";
                                            param.name=result.name;
                                            param.phone=result.phone;
                                            param.sexInput=result.sex;
                                            unit.log("param.sexInput:"+param.sexInput);
                                            param.show="block";
                                            param.btn="修改信息";
                                            data.userId=result.id;
                                            data.wechatId=result.wechat;
                                            param.data=JSON.stringify(data);
                                            res.render('visitor',param);
                                            let log='访客：'+result.name+'  修改信息成功！';
                                            unit.log(log);
                                        }
                                    })
                                }else{
                                    // 手机号与微信号已绑定
                                    let param={};
                                    param.action="/visitor/create";
                                    param.name=_name;
                                    param.phone=phone;
                                    param.show="none";
                                    param.btn="注册信息";
                                    param.data=JSON.stringify(_data);
                                    res.render('visitor',param);
                                }
                            }else{
                                Visitor.createUser(_name,phone,_wechatId,function (err,result) {
                                    if (!err){
                                        let param={};
                                        let data={};
                                        param.action="'visitor/update";
                                        param.name=result.name;
                                        param.phone=result.phone;
                                        param.userId=result.id;
                                        param.wechatId=result.wechat;
                                        param.btn="修改信息";
                                        data.wechatId=wechatId;
                                        data.userId=result.id;
                                        param.data=JSON.stringify(data);
                                        res.render('visitor',param);
                                    }else{
                                        unit.showError(res,'新建用户失败',err);
                                    }
                                } )
                            }
                        }
                    })
                }else{
                    let param={};
                    let data={};
                    data.wechatId=result[0].wechat;
                    data.userId=result[0].id;
                    param.action="/visitor/update";
                    param.name=result[0].name;
                    param.phone=result[0].phone;
                    param.show="block";
                    param.btn="修改信息";
                    param.data=JSON.stringify(data);
                    res.render('visitor',param);
                }
            }
        })
    }
});

router.post('/update',function (req,res,next) {
    let data=JSON.parse(req.body.data);
    let id=data.userId;
    let name=req.body.name;
    let phone =req.body.phone;
    let idCard =req.body.idcard;
    let sex=req.body.sex;
    let mediaId=req.body.mediaId;
    if (_.isNull(id) || _.isUndefined(id)){
        console.log("无访客ID");
        unit.showError(res,'无访客ID！ \n'+err);
    }else {
        Visitor.updateUser(id,name, phone, sex,null,idCard,null,null,null,function (err, result) {
            if (err){
                let msg="访客："+name+"  更新失败";
                unit.err(msg);
                unit.showError(res,'更新失败！ \n'+err);
            }else{

                if (!_.isUndefined(mediaId) && !_.isEmpty(mediaId)){
                    Wechat.getMediaImg2Base64(mediaId)
                        .then(function (data) {

                        })
                        .catch(function (err) {
                            console.error(err);
                        });
                }
                let param={};
                let data={};
                param.action="update";
                param.name=result.name;
                param.phone=result.phone;
                param.sexInput=result.sex;
                unit.log("param.sexInput:"+param.sexInput);
                param.show="block";
                param.btn="修改信息";
                data.userId=result.id;
                data.wechatId=result.wechat;
                param.data=JSON.stringify(data);
                res.render('visitor',param);
                let log='访客：'+result.name+'  修改信息成功！';
                unit.log(log);
            }
        })
    }
});

router.get("/appointment",function (req,res,next) {
    res.render("test");
});

/**
 *  从访客信息转到预约界面
 */
router.post("/appointment",function (req,res,next) {
    let data=JSON.parse(req.body.data);
    let visitorId   = data.userId;
    let visitorName = req.body.name;
    let visitorWechatId    =data.wechatId;
    let param={};
    data={};
    data.visitorId = visitorId;
    data.visitorName = visitorName;
    data.visitorWechatId=visitorWechatId;
    param.data=JSON.stringify(data);
    res.render("appointment",param);
 });

/**
 *  根据手机号查询访客是否存在
 */
router.post("/queryVisitor",function (req,res,next) {
    let _data=JSON.parse(req.body.data);
    let phone=req.body.phone;
    let visitorId=_data.visitorId ;
    let wechatId =_data.wechatId;
    let param={};
    let data={};
    param.action="/visitor/create";
    data.visitorId=visitorId;
    data.wechatId=wechatId;
    param.show="none";
    param.btn="注册信息";
    if (!_.isUndefined(phone) && phone !==''){
        Visitor.queryFromPhone(phone,function (err,result) {
            if (!err){
                if (!_.isEmpty(result)){
                    param.name=result[0].name;
                    param.phone=result[0].phone;
                    param.sexInput=result[0].sex;
                    param.company=result[0].company;
                    param.idcard=result[0].idcard;
                }
                param.data=JSON.stringify(data);
                res.render('visitor',param);
            }else{
                let msg="查询手机号："+phone +"失败！";
                unit.err(msg);
                unit.showError(res,msg,err);
            }
        })
    }else{
        param.data=JSON.stringify(data);
        res.render('visitor',param);
    }
})

/**
 *  预约中，查询被访员工
 */
router.post("/queryEmployee",function (req,res,next) {
    let daTa=JSON.parse(req.body.data);
    let phone=req.body.phone;
    let visitorId=daTa.visitorId ;
    let visitorName = daTa.visitorName;
    let visitorWechatId=daTa.visitorWechatId;
    let param={};
    let data ={};
    data.visitorId = visitorId;
    data.visitorName = visitorName;
    data.visitorWechatId = visitorWechatId;
    if (!_.isUndefined(phone)){
        Employee.queryEmployee(phone,function (err,result) {
            if (err){
                unit.showError(res,'查询员工信息失败！ \n'+err);
            }else{
                if (_.isEmpty(result)){
                    param.name="没有找到被访员工";
                    param.action="visitor/queryEmployee";
                }else{
                    if (_.isEmpty(result[0].wechat)){
                        param.name="被访员工不能被预约，员工在公众号没有绑定手机号";
                    }else{
                        param.name=result[0].name;
                        param.phone=result[0].phone;
                        param.action="/visitor/createRecord";
                        data.employeeId=result[0].id;
                        data.employeeName=result[0].name;
                        data.employeeWechatId=result[0].wechat;
                    }
                }
                param.data=JSON.stringify(data);
                res.render("appointment",param);
            }
        });
    }
});

/**
 *  由预约转向访客信息
 */
router.post('/enterVisitor',function (req,res,next) {
    let data=JSON.parse(req.body.data);
    let wechatId=data.wechatId ;
    Visitor.queryWechatId(wechatId,function (err,result) {
        if (!err) {
            if (_.isEmpty(result)){
                // 访客户没有注册
                let param={};
                let data={};
                data.wechatId=wechatId;
                param.action="/visitor/create";
                param.name="";
                param.phone="";
                param.show="none";
                param.btn="注册信息";
                param.data=JSON.stringify(data);
                res.render('visitor',param);
            }else{
                let param={};
                let data={};
                param.action="/visitor/update";
                param.name=result[0].name;
                param.phone=result[0].phone;
                param.wechatId=result[0].wechat;
                param.btn="确认修改";
                data.wechatId=wechatId;
                data.userId=result[0].id;
                param.data=JSON.stringify(data);
                res.render('visitor',param);
            }
        }else{
            unit.showError(res,'查询微信ID失败 ',err);
        }
    })
});

/**
 *    创建新的预约信息
 */
router.post("/createRecord",function (req,res,next) {
    let data=JSON.parse(req.body.data);
    let employeeId  =data.employeeId;
    let employeeName=data.employeeName;
    let visitorId   =data.visitorId;
    let visitorName =data.visitorName;
    let beginTime = req.body.beginTime;
    let endTime=req.body.endTime;
    beginTime=beginTime ==='' ? moment().set({'hour': 0, 'minute': 1,'second':0}).unix(): moment(beginTime,'YYYY/MM/DD HH:mm').unix();
    endTime=endTime ==='' ? moment().set({'hour': 23, 'minute': 59,'second':59}).unix(): moment(endTime,'YYYY/MM/DD HH:mm').unix();
    let visitor={id:visitorId,name:visitorName};
    let employee={id:employeeId,name:employeeName};
    let code=unit.createNonce();
    if (_.isUndefined(employeeId) || _.isUndefined(visitorId)){
        let param={};
        param.data=JSON.stringify(data);
        return res.render('appointment',param);
    }else{
        Record.createAppointment(visitor,employee,code,beginTime,endTime,function (err, result) {
            if (err) {
                unit.showError(res,'创建预访失败 ',err);
            } else {
                if (null != result) {
                    // 确认预约后，再获取访客的微信ID,发送推送
                    unit.showHint(res,'预约成功，等待对访确认！')
                }else{
                    unit.showError(res,'创建预访失败 ',result);
                }
            }
        })
    }
});

/**
 *  访客到场确认，平台发来信息
 *  向访客推送门禁通行消息
 */
router.post('/reqConfirmMsgTemp',function (req,res,next) {
    let data=req.body;
    let card=data.card;
    let status='现场已确认，请持二维码通行！';
    let beginTime=unit.time2Str(data.begin);
    let endTime  =unit.time2Str(data.end);
    SocketIo.emitFlashCode(data);
/*    let renderUrl="http://minima.mynatapp.cc/visitor/enterTicket?";
    renderUrl+="code="+data.card;  // 二维码
    renderUrl+="&";
    renderUrl+="beginTime="+data.begin;
    renderUrl+="&";
    renderUrl+="endTime="+data.end;
    renderUrl+="&";
    //  需要访客户的微信ID
    let visitorId=data.visitor.id;
    Visitor.queryFromId(visitorId,function (err,result) {
        if (err){
            unit.showError(res,'查询访客失败',err);
        }else{
            if (null != result && result.length !==0 ){
                let wechatId=result[0].wechat;
                let visitorName=result[0].name;
                let visitorTel=result[0].phone;
                renderUrl+="visitorName="+visitorName;
                let data={};
                data.status={
                    value:status,
                    color:"#173177"
                };
                data.name={
                    value:visitorName,
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
                //到访确认凭证
                let tempId="EyKuqU3FTpCgL14rwI6mJYfn2wgaKWLyk01LEc5bToE";
                Wechat.pushTemplateMessage(wechatId,tempId,data,renderUrl)
                    .then(function (result) {
                        let msg="向访客:"+visitorName+"推送门禁通行信息成功!";
                        msg+=JSON.stringify(result);
                        unit.log(msg);
                        unit.showHint(res,"已将预约情况，回执给客户！");
                    }).catch(function (err) {
                        let msg="向访客:"+visitorName+"推送门禁通行信息失败!";
                        msg+=JSON.stringify(err);
                        unit.err(msg);
                        unit.showError(res,"推送门禁通行信息失败",err);
                })
            }
        }
        res.send({result:'ok'});
    })*/
});

/**
 *  预约后，平台发来预约成功事件，
 *  转向对被约人（员工）推送消息
 *  注：弃用
 */
router.post('/reqMsgTemp',function (req,res,next) {
    console.log('reqMsgTemp:'+req.body);
    let data =req.body;
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
            unit.showError(res,'创建预访失败 \n'+err);
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

            let msg=" 访客 "+ret1.visitorName+" 向 "+ret2.employeeName;
            // 向员工（被约人）推送预约消息
            let tempId = "Eteyx38JqQ-XXcXLJvlK3nWqMeh7my5AY4zUAvkB6Mw";
            Wechat.pushTemplateMessage(ret2.employeeWechatId, tempId, data, renderUrl)
                .then(function (result) {
                    msg+= " 推送预约消息 resutl:"+JSON.stringify(result);
                    unit.log(msg);
                    unit.showHint(res,'预约成功，等待对方确认！');
                }).catch(function (err) {
                    msg+=" 推送预约消息 err:"+JSON.stringify(err);
                    unit.err(msg);
                unit.showError(res,'创建预访失败 \n'+err);
            })
        }
        res.send({result:'ok'});
    });
});

/**
 *   显示到访确认凭证
 */
router.get('/visitTicket',function (req,res,next) {
    let beginTime=req.query.beginTime;
    let endTime  =req.query.endTime;
    let code     =req.query.code;
    let visitorName=req.query.visitorName;
    let param={};
    let data={};
    param.beginTime=beginTime;
    param.endTime  =endTime;
    param.code     =code;
    param.hint     ='到访确认凭证';
    param.visitorName=visitorName;
    data.qrcode=code;
    data.type='code';
    param.hintShow='inline';
    param.data=JSON.stringify(data);
    res.render('visit_ticket',param);
});

/**
 *   显示门禁进出凭证
 */
router.get('/enterTicket',function (req,res,next) {
    let beginTime=req.query.beginTime;
    let endTime  =req.query.endTime;
    let code     =req.query.code;
    let visitorName=req.query.visitorName;
    let param={};
    let data={};
    param.beginTime=unit.time2Str(beginTime);
    param.endTime  =unit.time2Str(endTime);
    param.code     =code;
    param.hint     ='门禁通行凭证';
    param.visitorName=visitorName;
    data.qrcode=code;
    data.type='card';
    param.hintShow='none';
    param.data=JSON.stringify(data);
    res.render('visit_ticket',param);
});


/**
 *   刷新二维码 （到访确认凭证 刷取 门禁凭证)
 */
router.post('/flashTicket',function (req,res,next) {
    let code=req.body.code;
    let timestamp=req.body.timestamp;
    if(!_.has(checklist,code)){
       checklist[code]={begin:timestamp};
    }else{
        checklist[code]={begin:timestamp};
    }
    let now=moment().unix();
    let check=checklist[code];
    if(now-check.begin > 130){
        delete checklist[code];
        let param={};
        param.result=false;
        param.status='timeout';
        res.send(param);
    }else{
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
                delete checklist[code];
            }
            msg+="\n";
            msg+=JSON.stringify(result);
            unit.log(msg);
            res.send(param);
        })
    }
});

router.post("/loadImg",function (req,res,next) {
    //http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=ACCESS_TOKEN&media_id=MEDIA_ID
    let mediaId=req.body.mediaId;
    Wechat.getMediaImg2Base64(mediaId)
        .then(function (data) {

        console.log(data);
    })
        .catch(function (err) {
            console.error(err);
        })
});


module.exports = router;