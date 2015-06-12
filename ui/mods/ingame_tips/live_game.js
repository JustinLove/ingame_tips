define([
], function(
) {
  "use strict";

  var lastTime = 0
  var minimumTipTime = 10
  var maximumTipTime = 5 * 60
  var longTermMinimum = minimumTipTime

  var resetTimer = function() {
    lastTime = new Date().getTime()
    longTermMinimum = minimumTipTime
  }
  resetTimer()

  var timeSinceLastTip = function() {
    return (new Date().getTime() - lastTime) / 1000
  }

  var genericTip = function() {
    console.log('tip')
    resetTimer()
  }

  var commandRatePromise = $.Deferred()
  var commandRate = commandRatePromise.promise()
  commandRate.progress(function(rate) {
    longTermMinimum = longTermMinimum + rate
    var t = timeSinceLastTip() - rate
    //console.log(t, longTermMinimum, rate)
    if (t > longTermMinimum || t > maximumTipTime) {
      genericTip()
    }
  })

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
      commandRatePromise.notify(60 * commands / pollingPeriod)
    }
  }
  model.queryStats = function() {
    if (model.armyIndex() < 0) return
    api.gamestats.get(endOfTime()).then(processStats);
  }

  var poll = function() {
    model.queryStats()
    setTimeout(poll, pollingPeriod * 1000)
  }
  poll()

  var live_game_time = handlers.time
  handlers.time = function (payload) {
    live_game_time(payload)
    endOfTime(Math.floor(payload.end_time));
  }

})
