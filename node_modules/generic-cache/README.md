# generic-cache

Light library for generic caching (only memory store is currently supported)

## Instalation

``npm install generic-cache``


## Usage

	var Cache = require('generic-cache');
	var options = {
		ttl:'20s', 
		clearPeriod:'1m'
	}
	var cache = new Cache(options);
	
	cache.set('number',125);
	console.log(cache.get('number')); -> 125

	
You can specify ttl as number in ms or string in format '[x][unit]' (eg. '20s', '5m', '10h', ...)

## API

### constructor([storage,]options)

`storage` – specifies used storage (currently only memory is supported)

`options`

- `ttl` – default time to live for added values (default: 5 minutes)
- `clearPeriod` – interval to trigger garbage collector

### set(key,value[,ttl])

set value for given key. When ttl is not specified, the default one specified in contractor is used

### get(key)

get value