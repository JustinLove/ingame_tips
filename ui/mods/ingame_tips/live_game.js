define([
], function(
) {
  "use strict";

  var endOfTime = ko.observable(0)

  var sample = null
  var previousSample = null
  var lastTime = 0
  var pollingPeriod = 10
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

  var processStats = function(string) {
    if (model.armyIndex() < 0) return

    var payload = JSON.parse(string)
    previousSample = sample
    sample = payload.armies[model.armyIndex()]
    if (previousSample) {
      var commands = sample.commands_given - previousSample.commands_given
      longTermMinimum = longTermMinimum + commands
      var commandRate = 60 * commands / pollingPeriod
      var t = timeSinceLastTip() - commandRate
      //console.log(t, longTermMinimum, commandRate)
      if (t > longTermMinimum || t > maximumTipTime) {
        genericTip()
      }
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
