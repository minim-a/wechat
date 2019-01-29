/**
 * Created by merci on 2016/9/19.
 */
var _=require('underscore');
module.exports=function(model,util){
    var keys=_.allKeys(util);
    _.each(keys, function(key){
        if(_.isFunction(util[key])){
            model[key]=util[key];
        }
    });
    model.removeById = model.destroyById;
    model.deleteById = model.destroyById;
    model.update = model.updateAll;
}