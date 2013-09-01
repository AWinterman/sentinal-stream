var assert = require('assert')
  , Sentinal = require('./')
  , from = require('from')
  , sentence = ''

var periods = new Sentinal(new Buffer('|||'))

var source = from([
    '||| is the delimiter'
  , 'Sometimes it fits|||'
  , 'Sometimes it might take'
  , 'more than one line|||'
  , 'Look, ||| two per chunk |||'
  , '||| or ||| even ||| three!'
  , 'And sometimes only part ||'
  , '| Of the separator fits.'
])

expected = [
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
  , 'And sometimes only part '
  , '|||'
  , ' Of the separator fits.'
]

var s = source.pipe(periods)

i = 0
s.on('readable', function() {
  assert.equal(s.read().toString(), expected[i])
  ++i
})
