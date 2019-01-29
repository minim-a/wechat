var assert = require('assert');
var Cache = require('../index');

describe('cache tests',function(){
    it('should successfully set value',function(){
        var c = new Cache();

        c.set('test','aaa');

        assert.equal(c.get('test'),'aaa');
        assert.equal(c.get('undefined_key'),undefined)
    })

    it('should update stats accordingly',function(){
        var c = new Cache();

        assert.equal(c.stats.keys,0)

        c.set('test','aaa');

        assert.equal(c.stats.hits,0)
        assert.equal(c.stats.misses,0)

        c.get('test');
        c.get('undefined_key');

        assert.equal(c.stats.hits,1)
        assert.equal(c.stats.misses,1)
        assert.equal(c.stats.keys,1)

        for(var x = 0;x<100;x++){
            c.get('test');
        }
        assert.equal(c.stats.hits,101)
        assert.equal(c.stats.keys,1)

        for(var x = 0;x<100;x++){
            c.set('test'+x,x);
        }
        assert.equal(c.stats.keys,101)
    })

    it('should not return expired data',function(done){
        var c = new Cache({ttl:'1ms'});

        c.set('xxx','yyy',0.5);
        c.set('xxx2','yyy');

        setTimeout(function(){
            assert.equal(c.get('xxx'),undefined)
            assert.equal(c.get('xxx2'),undefined)
            done();
        },1500)
    })

    it('should clear data after expire',function(done){
        var c = new Cache({ttl:1,clearPeriod:0.5});

        c.set('xxx','yyy',0.5);

        setTimeout(function(){
            assert.equal(c.get('xxx'),undefined)
            done();
        },1000)
    })
})