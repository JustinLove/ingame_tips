(function() {
  var endOfTime = ko.observable(0)

  var sample = null
  var previousSample = null
  var actions = 0

  var processStats = function(string) {
    var payload = JSON.parse(string)
    previousSample = sample
    sample = payload.armies[model.armyIndex()]
    if (previousSample) {
      actions = sample.commands_given - previousSample.commands_given
      console.log(actions)
    }
  }
  model.queryStats = function() {
    api.gamestats.get(endOfTime()).then(processStats);
  }

  var poll = function() {
    model.queryStats()
    setTimeout(poll, 10 * 1000)
  }
  poll()

  var live_game_time = handlers.time
  handlers.time = function (payload) {
    live_game_time(payload)
    endOfTime(Math.floor(payload.end_time));
  }
})()
