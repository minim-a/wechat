module.exports=Record;
var _=require('underscore');
var client=require('../lib/rsclient.js')();
var moment=require('moment');



function Record() {
}

Record.setup = function () {
    if (!Record._init){
        Record.pin='field:visitor,role:*'
        Record._init=true;
    }
}

/**
 *   新增预约
 */
/*
  访客信息
   var visitor={id:'5c19a263efb0a2000e3e5de6',name:'刘强',face:'WERTEDFKFDkFGF4645=SDFD'};
   被访问员工信息
   var employee={id:'test',name:'刘强东'};
   出入门禁
   var access=[{id:'test',name:'大门'}];
   var param={visitor:visitor,employee:employee,time:moment().unix(),access:access};
   */
 Record.createAppointment=function(visitor,employee,code,beginTime,endTime,cb){
    let access=[{id:'223293954',name:'door'},{id:'10:D0:7A:00:09:65',name:'faceDoor'}];
    let param={visitor:visitor,employee:employee,
        begin:beginTime,
        end:endTime,
        access:access,
        code:code
    };
    let pattern={field:'visitor',role:'record',cmd:'create',param:param};
    client.act(Record.pin,pattern,cb);

};

/**
 *  员工查询被预约记录
 * @param id
 * @param cb
 */
Record.queryBooked = function(id,cb){
     let param={};
     param["employee.id"]=id;
     let pattern={field:'visitor',role:'record',cmd:'query',param:param};
     client.act(Record.pin,pattern,cb);
};

var param={id:'5c2480097e8c8fa418834a3f'};

/**
 *  根据ID 查询被预约记录
 * @param id
 * @param cb
 */
Record.queryBookedFromId = function(id,cb){
    let param={id:id};
    let pattern={field:'visitor',role:'record',cmd:'query',param:param};
    client.act(Record.pin,pattern,cb);
};

/**
 *  员工对预约是否确认，或拒绝
 * @param id
 * @param cb
 */
Record.ack= function(id,status,user,cb){
    let param={};
    param.id=id;
    param.status=status;
    param.user=user;
    let pattern={field:'visitor',role:'record',cmd:'ack',param:param};
    client.act(Record.pin,pattern,cb);
};


/**
 * 根据CODE 获取 card
 * @param code
 * @param cb
 */
Record.getCard=function(code,cb){
    let param={};
    param.code=code;
    let pattern={field:'visitor',role:'record',cmd:'query',param:param};
    client.act(Record.pin,pattern,cb);
};

Record.setup();