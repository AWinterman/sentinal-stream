# Sentinal-Stream #

A transform stream that finds a sentinal value in a data stream, and then emits it as a seperate data event.

## Application ##
Any time you want to take a particular action if a certain value appears in a stream, e.g. splitting a stream, stopping a stream early, etc.

## API ##

`sentinal = new Sentinal(sentinal_value) ` returns a [transform
stream](http://nodejs.org/api/stream.html#stream_class_stream_transform).
`sentinal_value` is an array or a string or a buffer. You probably want 
`sentinal_value` match the encoding of the data you are piping in. 

# Example #

```javascript
var Sentinal = require('sentinal-stream')
  , through = require('through') // npm.im/through
  , from = require('from') // npm.im/from
  , sentence = ''

var periods = new Sentinal(new Buffer('|||'))

var source = from([
    '||| is the delimiter.'
  , ' Sometimes it fits|||'
  , 'Sometimes it might take'
  , 'more than one line|||'
  , 'Look||| two per chunk|||'
  , '||| or ||| even ||| three!'
  , 'And sometimes only part ||'
  , '| Of the separator fits.'
])

var gather_wipe = through(function(data) {
  if(data === periods.seperator) {
    sentence && console.log(sentence + '.')
    sentence = ''
    return
  }
  sentence += data 
})

source
  .pipe(periods)
  .pipe(gather_wipe) 


```
Yields:

```
is the delimiter. Sometimes it fits.
Sometimes it might take more than one line.
Look. two per chunk.
or even three! And sometimes only part .
 Of the seperator fits.
```

