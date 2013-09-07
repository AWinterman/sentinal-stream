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

var complicated_source = [
    '{{ sometimes you have two }}'
  , '{{ delimiters which you are }'
  , '} looking for'
  , '{{this}}{{is}}{{slightly}}{{more}}'
  , '{{complicated}}'
]

var complicated_expected = [
    '{{'
  , ' sometimes you have two '
  , '}}'
  , '{{'
  , ' delimiters which you are '
  , '}}'
  , ' looking for'
  , '{{'
  , 'this'
  , '}}'
  , '{{'
  , 'is'
  , '}}'
  , '{{'
  , 'slightly'
  , '}}'
  , '{{'
  , 'more'
  , '}}'
  , '{{'
  , 'complicated'
  , '}}'
]

var single_source = [complicated_source.join('')]

var single_expected = single_source[0]
  .split(/({{)|(}})/)
  .filter(Boolean)

var uni_expected = single_source[0].split(/({{)|(}})|(.)/).filter(Boolean)
  , uni_source = single_source[0].split('')

module.exports = [
    [source_data, expected, ['|||']]
  , [complicated_source, complicated_expected, ['{{', '}}']]
  , [single_source, single_expected, ['{{', '}}']]
  , [uni_source, uni_expected, ['{{', '}}']]
]
