var assert = require('assert')
  , stream = require('stream')
  , Sentinal = require('./')
  , from = require('from')
  , sentence = ''

var source_data = [
    '||| is the delimiter'
  , 'Sometimes it fits|||'
  , 'Sometimes it might take'
  , 'more than one line|||'
  , 'Look, ||| two per chunk |||'
  , '||| or ||| even ||| three!'
  , '||| And sometimes only part ||'
  , '| Of the separator fits.'
]

var expected = [
    '|||'
  , ' is the delimiter'
  , 'Sometimes it fits'
  , '|||'
  , 'Sometimes it might take'
  , 'more than one line'
  , '|||'
  , 'Look, '
  , '|||'
  , ' two per chunk '
  , '|||'
  , '|||'
  , ' or '
  , '|||'
  , ' even '
  , '|||'
  , ' three!'
  , '|||'
  , ' And sometimes only part '
  , '|||'
  , ' Of the separator fits.'
]

test_bin()
test_str()

function test_bin() {
  function bin() {

    var bin_periods = new Sentinal(new Buffer('|||'))
      , binary_source = from(source_data.slice())

    var b = binary_source
      .pipe(bin_periods)

    return b
  }

  var i = 0

  var b = bin()

  b.on('readable', function() {
    var z = b.read()

    assert.equal(z.toString(), expected[i])
    ++i
  })

  var j = 0

  bin().on('data', function(data) {
    assert.equal(data.toString(), expected[j])
    ++j
  })
}

function test_str() {
  function create_source() {

    var periods = new Sentinal('|||', {decodeString: false, objectMode: true})
      , source = from(function(count, next) {
        if(count === source_data.length) {
          return this.emit('end')
        }

        this.emit('data', source_data[count])
        next()
      })

    var b = source.pipe(periods)

    return b
  }

  var i = 0

  var b = create_source()

  b.on('readable', function() {
    var z = b.read()

    assert.equal(z.toString(), expected[i])
    ++i
  })

  var j = 0

  create_source().on('data', function(data) {
    assert.equal(data.toString(), expected[j])
    ++j
  })
}

