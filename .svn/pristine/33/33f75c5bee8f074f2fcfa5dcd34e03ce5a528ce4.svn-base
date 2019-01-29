
let _=require('underscore');
let client=require('../lib/rsclient.js')();
module.exports=Employee;
function Employee() {
}

Employee.setup = function () {
    if (!Employee._init){
        Employee.pin='field:employee,role:*';
        Employee._init=true;
    }
}

Employee.queryEmployee = function(phone,cb){
    let param={};
    param.phone=phone;
    let pattern={field:'employee',role:'manager',cmd:'query',param};
    let pin='field:employee,role:*';
    client.act(pin,pattern,cb);
};


Employee.queryFromWechatId = function(id,cb){
    let param={};
    param.wechat=id;
    let pattern={field:'employee',role:'manager',cmd:'query',param};
    client.act(Employee.pin,pattern,cb);
};

Employee.queryFromId = function(id,cb){
    let param={};
    param.id=id;
    let pattern={field:'employee',role:'manager',cmd:'query',param};
    client.act(Employee.pin,pattern,cb);
};

/**
 *  员工绑定微信ID
 * @param userId
 *               员工ID
 * @param wechatId
 * @param cb
 */
Employee.bind=function(employeeId,wechatId,company,cb){
    let param={};
    param.id=employeeId;
    param.wechat=wechatId;
    param.company=company;
    let pattern={field:'employee',role:'manager',cmd:'update',param};
    client.act(Employee.pin,pattern,cb);
};

Employee.setup();