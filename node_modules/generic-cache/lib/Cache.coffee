
class Cache
  @::stores = {}
  @::defaultStoreType = 'memory'

  @getStore:(type,options)->
    if typeof type is 'object'
      options = type
      type = undefined
    type = type or @::defaultStoreType
    if not @::stores[type]
      throw new Error('unknown store type ' + type)
    else
      new (@::stores[type])(options)

  @registerStore:(type,storeClass)->
    @::stores[type] = storeClass



module.exports = Cache