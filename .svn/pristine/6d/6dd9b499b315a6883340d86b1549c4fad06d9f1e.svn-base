var Cache = require('./lib/Cache')

Cache.registerStore('memory',require('./lib/stores/Memory'))

module.exports = function(type,options){
    return Cache.getStore(type,options);
}