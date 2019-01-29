
let moment = require('moment');

module.exports=Unit;

function Unit(){

}

Unit.time2Str=function ( timestamp) {
    moment.locale('zh-cn');
    let formatDate = moment(timestamp* 1000).format('YYYY-MM-DD HH:mm:ss'); /*格式化时间*/
    return formatDate;
};

/**
 * 生成随机字符串
 * @returns {string}
 */
Unit.createNonce = function () {
    return Math.random().toString(36).substr(2, 15);
};

/**
 * 转向报错界面
 * @param res
 * @param hint
 */
Unit.showError =function (res,hint,err) {
    let param={};
    param.hint=hint;
    param.error=err;
    res.render('err',param);
};

/**
 * 转向成功界面
 * @param res
 * @param hint
 */
Unit.showHint =function (res,hint) {
    let param={};
    param.hint=hint;
    return res.render('hint',param);
};

Unit.log=function (msg) {
    let curessTime=moment().format('YYYY-MM-DD HH:mm:ss');
    msg="->  "+curessTime+" : "+msg;
    console.log(msg);
};

Unit.err=function (msg) {
    let curessTime=moment().format('YYYY-MM-DD HH:mm:ss');
    msg="->  "+curessTime+msg;
    console.error(msg);
};

