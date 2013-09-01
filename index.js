var indexOf = require('index-of-js')
  , stream = require('stream')
  , util = require('util')

module.exports = Sentinal

// It's up to the client to make sure the encoding for the data from the
// source stream and the separator are the same

function Sentinal(separator) {
  stream.Transform.call(this)
  this.separator = separator
  this._fragment = new Buffer('')
}

util.inherits(Sentinal, stream.Transform)

Sentinal.prototype._transform = function(data, encoding, done) {
  var endpoint
    , indices
    , old_idx
    , chunk
    , next
    , out
    , idx

  chunk = Buffer.concat([this._fragment, data])
  indices = find_indices(chunk, this.separator)

  // if we haven't found any seperators, look for cutoff seperators at the
  // boundary, and emit everything but a partial seperator

  if(indices.length === 0) {
    this._fragment = boundary(chunk, this.separator)
    this.push(chunk.slice(0, chunk.length - this._fragment.length))

    return done()
  }

  idx = -1

  // otherwise each time we encounter the seperator, emit from the previous
  // seperator to the current one, and then emit a seperator.

  while(indices.length) {
    old_idx = idx > -1 ? idx + this.separator.length : 0
    idx = indices.shift()

    out = chunk.slice(old_idx, idx)

    this.push(out)
    this.push(this.separator)
  }

  if(idx !== -1) {
    this.push(chunk.slice(idx + this.separator.length))
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

  while(separator_arr.length) {
    separator_arr.pop()

    var str_idx = indexOf(data_arr, separator_arr)

    if(str_idx !== -1) {
      return new Buffer(separator_arr)
    }
  }

  return new Buffer('')
}
