define([
], function(
) {
  "use strict";

  var commandRatePromise = $.Deferred()
  var commandRate = commandRatePromise.promise()

  var endOfTime = ko.observable(0)
  var sample = null
  var previousSample = null
  var pollingPeriod = 10
  var processStats = function(string) {
    if (model.armyIndex() < 0) return

    var payload = JSON.parse(string)
    previousSample = sample
    sample = payload.armies[model.armyIndex()]
    if (previousSample) {
      var commands = sample.commands_given - previousSample.commands_given
      commandRatePromise.notify(60 * commands / pollingPeriod, pollingPeriod)
    }
  }

  var queryStats = function() {
    if (model.armyIndex() < 0) return
    api.gamestats.get(endOfTime()).then(processStats);
  }

  var poll = function() {
    queryStats()
    setTimeout(poll, pollingPeriod * 1000)
  }
  poll()

  var live_game_time = handlers.time
  handlers.time = function (payload) {
    live_game_time(payload)
    endOfTime(Math.floor(payload.end_time));
  }

  return {
    commandRate: commandRate,
    pollingPeriod: pollingPeriod,
    queryStats: queryStats,
  }
})
