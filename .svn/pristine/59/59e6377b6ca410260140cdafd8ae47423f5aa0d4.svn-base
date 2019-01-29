_ = require('underscore')
EventEmitter = require('events').EventEmitter
convert = require('unit-converter')

class Cache extends EventEmitter
  constructor:(@_options = {})->

    @_data = {}

    @stats =
      hits:0
      misses:0
      keys:0

    @_options = _.extend(
      ttl:60*5*1000,
      clearPeriod:60*1000
    ,@_options)

    if not isFinite(@_options.ttl)
      @_options.ttl = convert(@_options.ttl).to('ms')

    @_checkData()


  get:(key)->
    @emit('get',key)
    if @_data[key] and !@_valueExpired(@_data[key])
      @stats.hits++
      @emit('hit',key)
      return @_data[key].value
    else
      @stats.misses++
      @emit('miss',key)
      return undefined


  set:(key,value,ttl = @_options.ttl)->
    @emit('set',key,value)
    data = {value:value}
    if ttl
      if not isFinite(ttl)
        ttl = convert(ttl).to('ms')
      data.expire = (Date.now())+ttl
    #      data.expireTimeout = setTimeout(()=>
    #        @_expire(key)
    #      ,ttl*1000)

    if not @_data[key]
      @stats.keys++
    @_data[key] = data


  delete:(key)->
    if @_data[key]
      @emit('delete',key)
      @stats.keys--
      delete @_data[key]

  _checkData:()->
    now = Date.now()

    for key,value of @_data
#      console.log('key',key)
      if @_valueExpired(value,now)
        @_expire(key)

    setTimeout(()=>
      @_checkData()
    ,@_options.clearPeriod)

  _valueExpired:(value,now)->
    now = now or Date.now()
    return value.expire and value.expire < now


  _expire:(key)->
    @emit('expired',key)
    @delete(key)


module.exports = Cache