var indexOf = require('index-of-js')
  , stream = require('stream')
  , util = require('util')

module.exports = Sentinal

// It's up to the client to make sure the encoding for the data from the
// source stream and the separator are the same

function Sentinal(separator, options) {
  stream.Transform.call(this, options)
  this.separator = separator
  this.options = options || {}
  this._fragment = this.options.decodeStrings ?
    '' :
    new Buffer('', this.options.encoding)
}

util.inherits(Sentinal, stream.Transform)

Sentinal.prototype._transform = function(data, encoding, done) {
  var fragment_arr
    , remaining
    , endpoint
    , indices
    , old_idx
    , chunk
    , next
    , out
    , idx

  out = []

  if(Buffer.isBuffer(data)) {
    // then buffer concat
    chunk = Buffer.concat([this._fragment, data])
  } else if(Array.isArray(data)) {
    // then array concat
    chunk = this._fragment.concat(data)
  } else {
    // better be a string
    chunk = this._fragment + data
  }

  indices = find_indices(chunk, this.separator)

  // if we haven't found any seperators, look for cutoff seperators at the
  // boundary, and emit everything but a partial seperator

  // handle the case of no matches.


  idx = -1

  // If there are matches otherwise each time we encounter the seperator, emit
  // from the previous seperator to the current one, and then emit a seperator.

  while(indices.length) {
    old_idx = idx > -1 ? idx + this.separator.length : 0
    idx = indices.shift()

    out.push(chunk.slice(old_idx, idx))
    out.push(this.separator)
  }

  // emit the remainder from the last seperator found to the end of the chunk.
  if(idx === -1) {
    idx = -this.separator.length
  }

  remaining = chunk.slice(idx + this.separator.length)

  fragment_arr = boundary(remaining, this.separator)

  if(Buffer.isBuffer(chunk)) {
    this._fragment = new Buffer(fragment_arr)
  } else if(Array.isArray(chunk)) {
    this._fragment = fragment_arr
  } else {
    this._fragment = fragment_arr.join('')
  }

  out.push(remaining.slice(0, remaining.length - this._fragment.length))

  for(var i = 0, len = out.length; i < len; ++i) {
    out[i].length && this.push(out[i])
  }

  return done()
}

function find_indices(chunk, separator) {
  var idx = indexOf(chunk, separator)
    , indices = []

  while(idx !== -1) {
    indices.push(idx)
    idx = indexOf(chunk, separator, idx + 1)
  }

  return indices
}

function boundary(data, separator) {
  // check if a subset the separator is at the boundary.
  var separator_arr = [].slice.call(separator)
    , data_arr = [].slice.call(data)
    , idx = -1

  while(data_arr.length && separator_arr.length) {
    var idx = indexOf(data_arr, separator_arr, idx + 1)

    if(idx === data_arr.length - separator_arr.length) {
      return separator_arr
    }

    separator_arr.pop()
  }

  return []
}
