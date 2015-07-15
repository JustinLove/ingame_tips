define([
], function(
) {

  "use strict";
  var Sequence = function() {
    this.events = ko.observableArray([])
    this.time = new Date().getTime()
  }

  Sequence.prototype.reset = function() {
    this.events([])
    this.time = new Date().getTime()
  }
  Sequence.prototype.unshift = function(item) {
    var t = new Date().getTime()
    if (t - this.time > 2000) {
      this.events([])
    }

    var a = this.events()
    a.unshift(item)
    this.events(a)

    this.time = t
  }
  Sequence.prototype.batch = function(f) {
    var t = new Date().getTime()
    if (t - this.time > 2000) {
      this.events([])
    }

    var a = this.events()
    f(a)
    this.events(a)

    this.time = t
  }

  return Sequence
})
