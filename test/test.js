var assert = require('assert')
  , source = require('./sources')
  , stream = require('stream')
  , Sentinal = require('../index.js')
  , from = require('from')
  , sentence = ''


for (var i = 0, len = source.length; i < len; ++i) {
  test_readable_bin(source[i])
  test_ondata_bin(source[i])
}

function test_readable_bin(source) {
  var result_source = source[0] 
    , expected_source = source[1].slice()
    , seperators = source[2].slice()
    , count = 0

  var sentinals = seperators.map(function(sep) {
    return new Sentinal(new Buffer(sep))
  })

  var result_stream = from(result_source)
  for(var i = 0, len = sentinals.length; i < len; ++i) {
    result_stream = result_stream.pipe(sentinals[i], {end: false})
  }

  result_stream.on('readable', function() {
    var chunk = result_stream.read()
    assert.equal(chunk.toString(), expected_source.shift())
    count++
  })
  assert.ok(count)
}

function test_ondata_bin(source) {
  var result_source = source[0] 
    , expected_source = source[1].slice()
    , seperators = source[2].slice()

  var sentinals = seperators.map(function(sep) {
    return new Sentinal(new Buffer(sep))
  })

  var result_stream = from(result_source)
  for(var i = 0, len = sentinals.length; i < len; ++i) {
    result_stream = result_stream.pipe(sentinals[i], {end: false})
  }

  result_stream.on('data', function(chunk) {
    assert.equal(chunk.toString(), expected_source.shift())
  })

}


// from(result_source).on('data', function(data) {
//   assert.equal(data.toString(), expected[j])
//   ++j
// })

// 
// tape("string input", test_str)
// function test_str(assert) {
//   var i = 0
// 
//   var periods = new Sentinal('|||', {decodeString: false, objectMode: true})
// 
// 
//   var b = from(create_source(source_data))
// 
//   var j = 0
// 
//   from(create_source(source_data)).pipe(periods).on('data', function(data) {
//     assert.equal(data.toString(), expected[j])
//     ++j
//   })
// }
// 
// tape('pipelining two together', test_double)
// function test_double(assert) {
//   var closes = new Sentinal('}}', {decodeString: false, objectMode: true})
//     , opens = new Sentinal('{{', {decodeString: false, objectMode: true})
// 
//   var s = create_source(complicated_source)
//     , i = 0
// 
//   from(s).pipe(opens, {end: false})
//   .pipe(closes, {end: false})
//   .on('data', function(data) {
//     assert.equal(data, complicated_expected[i])
//     ++i
//   })
// }
// 
// tape('data comes all in a single chunk', test_condensed)
// function test_condensed(assert) {
//   var closes = new Sentinal('}}', {decodeString: false, objectMode: true})
//     , opens = new Sentinal('{{', {decodeString: false, objectMode: true})
//     , expected = single_expected.slice()
// 
//   var u = from(create_source(single_source))
// 
// 
//   var b = u.pipe(opens).pipe(closes)
// 
//   b.on('data', function(data) {
//     var exp = expected.shift()
//     assert.equal(data, exp)
//   })
// 
// }
// 
// tape('each character is its own chunk' , test_expanded)
// function test_expanded(assert) {
//   var closes = new Sentinal('}}', {decodeString: false, objectMode: true})
//     , opens = new Sentinal('{{', {decodeString: false, objectMode: true})
//     , expected = single_expected.slice()
// 
//   var u = from(create_source(single_source[0]))
// 
// 
//   var b = u.pipe(opens).pipe(closes)
//   var accum = ''
// 
//   b.on('data', function(data)  {
//     accum += data
//   })
// 
//   b.on('end', function(data) {
//     console.log(accum)
//   })
// 
//   // b.on('data', function(data) {
//   //   var exp = expected.shift()
//   //   assert.equal(data, exp)
//   // })
// }
// 
// function create_source(data) {
//   var data = data.slice()
// 
//   var source = function(count, next) {
//     if(count === data.length) {
//       return this.emit('end')
//     }
// 
//     this.emit('data', data[count])
//     next()
//   }
// 
//   return source
// }
