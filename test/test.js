var source = require('./sources')
  , assert = require('assert')
  , stream = require('stream')
  , from = require('new-from')
  , Sentinal = require('../')
  , sentence = ''

var str_options = {
    decodeString: false
  , objectMode: true
}

for(var i = 0, len = source.length; i < len; ++i) {
  test_ondata_bin(source[i])
  test_readable_bin(source[i])
}

function test_readable_bin(source) {
  var expected_source = source[1].slice()
    , seperators = source[2].slice()
    , result_source = source[0]
    , count = 0

  var sentinals = seperators.map(function(sep) {
    return new Sentinal(new Buffer(sep))
  })

  var result_stream = from(result_source)

  for(var i = 0, len = sentinals.length; i < len; ++i) {
    result_stream = result_stream.pipe(sentinals[i])
  }

  result_stream.on('readable', function() {
    var chunk = result_stream.read()

    assert.equal(chunk.toString(), expected_source.shift())
    count++
  })

  result_stream.on('end', function() {
    assert.ok(count)
  })
}

function test_ondata_bin(source) {
  var expected_source = source[1].slice()
    , seperators = source[2].slice()
    , result_source = source[0]
    , count = 0

  var sentinals = seperators.map(function(sep) {
    return new Sentinal(new Buffer(sep))
  })

  var result_stream = from(result_source)

  for(var i = 0, len = sentinals.length; i < len; ++i) {
    result_stream = result_stream.pipe(sentinals[i], {end: false})
  }

  result_stream.on('data', function(chunk) {
    count += 1
    assert.equal(chunk.toString(), expected_source.shift())
  })
}

function test_readable_str(source) {
  var expected_source = source[1].slice()
    , seperators = source[2].slice()
    , result_source = source[0]
    , count = 0

  var sentinals = seperators.map(function(sep) {
    return new Sentinal(new Buffer(sep), str_options)
  })

  var result_stream = from(result_source, str_options)

  for(var i = 0, len = sentinals.length; i < len; ++i) {
    result_stream = result_stream.pipe(sentinals[i])
  }

  result_stream.on('readable', function() {
    var chunk = result_stream.read()

    assert.equal(chunk.toString(), expected_source.shift())
    count++
  })

  result_stream.on('end', function() {
    assert.ok(count)
  })
}

function test_ondata_str(source) {
  var expected_source = source[1].slice()
    , seperators = source[2].slice()
    , result_source = source[0]
    , count = 0

  var sentinals = seperators.map(function(sep) {
    return new Sentinal(new Buffer(sep), str_options)
  })

  var result_stream = from(result_source, str_options)

  for(var i = 0, len = sentinals.length; i < len; ++i) {
    result_stream = result_stream.pipe(sentinals[i], {end: false})
  }

  result_stream.on('data', function(chunk) {
    count += 1
    assert.equal(chunk.toString(), expected_source.shift())
  })
}


