define([
], function(
) {
  "use strict";

  var item = function(action) {return action.item}
  var quantity = function(event) {
    return event.batch ? model.batchBuildSize() : 1
  }
  var sum = function(a,b) {return a + b}
  var isCommander = function(id) {return id.match('commanders')}
  var allEqual = function(id, ids) {
    for (var i = 0;i < ids.length;i++) {
      if (ids[i] != id) {
        return false
      }
    }
    return true
  }
  var nItemEqual = function(n, events, target) {
    if (events.length < n) return false

    var ids = events.slice(0, n).map(item)
    return allEqual(target, ids)
  }

  return {
    nItemEqual: nItemEqual,
    nTheSame: function(n, events) {
      if (events.length < n) return false
      return nItemEqual(n, events, events[0].item)
    },
    unitBuildQuantity: function(events) {
      return events.map(quantity).reduce(sum)
    },
    arrayMatch: function(subject, mustMatch) {
      for (var i = 0;i <= mustMatch.length;i++) {
        if (subject[i] != mustMatch[i]) return false
      }
      return true
    },
    peekCommanderSelected: function() {
      var selection = model.selection.peek()
      if (!selection) return false
      var builders = Object.keys(selection.spec_ids)
      var commanders = builders.filter(isCommander).length
      return commanders > 0
    },
  }
})
