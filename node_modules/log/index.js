/**
 * Created by merci on 16/5/9.
 */
var log4js = require('log4js');
var cfg=require('./config/log.json');
module.exports=Log;
function Log(){

}
Log.config=function(options){
    log4js.configure(cfg);
    if(options.debug){
        Log.logger=log4js.getLogger();
        Log.logger.setLevel('ALL');
    }
    else{
        Log.logger=log4js.getLogger('niot');
        Log.logger.setLevel('WARN');
    }
}
Log.getLogger=function(){
    return Log.logger;
}