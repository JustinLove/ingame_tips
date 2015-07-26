define([
  'ingame_tips/present',
  'ingame_tips/tip_catalog',
], function(
  present,
  catalog
) {
  "use strict";

  var exp = function(v, def) {
    if (typeof(v) == 'number') {
      return Math.round(Math.pow(10, v))
    } else {
      return def
    }
  }

  var minimumTipTime = api.settings.isSet('ui', 'ingame_tips_minimum_time_between_tips', true)
  minimumTipTime = exp(minimumTipTime, 1*60)

  var maximumTipTime = api.settings.isSet('ui', 'ingame_tips_time_until_generic_tip', true)
  maximumTipTime = exp(maximumTipTime, 5*60)

  var repeatPeriod = api.settings.isSet('ui', 'ingame_tips_minimum_time_between_repeats', true)
  repeatPeriod = exp(repeatPeriod, 12*60*60) * 1000

  console.log(minimumTipTime, maximumTipTime, repeatPeriod)

  var lastTime = 0
  var longTermMinimum = minimumTipTime
  var storage = ko.observable({}).extend({ local: 'ingame_tips' })
  //storage({})
  var tipStats = storage()
  //console.log(tipStats)

  var resetTimer = function() {
    lastTime = new Date().getTime()
    longTermMinimum = minimumTipTime
  }
  resetTimer()

  var timeSinceLastTip = function() {
    return (new Date().getTime() - lastTime) / 1000
  }

  var bumpStats = function(tip) {
    var stats = tipStats[tip.id] || {count: 0, lastShown: lastTime, period: 0}
    stats.count = stats.count + 1
    if (stats.lastShown + stats.period > lastTime) {
      stats.period = stats.period + repeatPeriod
    } else {
      stats.lastShown = lastTime
      stats.period = repeatPeriod
    }
    tipStats[tip.id] = stats
    storage(tipStats)
  }

  var show = function(tip) {
    present.present(tip.text)
    resetTimer()
    bumpStats(tip)
  }

  var genericTip = function() {
    var now = new Date().getTime()
    var tips = catalog.tips.filter(function(tip) {
      return !tipStats[tip.id] || tipStats[tip.id].lastShown + tipStats[tip.id].period < now
    })
    var counts = tips.map(function(tip) {
      return (tipStats[tip.id] && tipStats[tip.id].count) || 0
    })
    var min = Math.min.apply(Math, counts)
    var tips = tips.filter(function(tip) {
      return !tipStats[tip.id] || tipStats[tip.id].count == min
    })
    if (tips.length < 1) return
    var i = Math.floor(Math.random() * tips.length)
    show(tips[i])
  }

  var triggeredTip = function(tip) {
    if (tipStats[tip.id]) {
      var now = new Date().getTime()
      var dt = tipStats[tip.id].lastShown + tipStats[tip.id].period - now
      if (dt > 0) {
        console.log('discarding recent tip', tip.id, dt / (60*60*1000))
        triggered = null
        return
      }
    }

    console.log(tip.text)

    if (timeSinceLastTip() > minimumTipTime) {
      show(tip)
      triggered = null
    } else {
      triggered = tip
    }
  }

  var provenTip = function(tip) {
    console.log('prove', tip.id)
    bumpStats(tip)
  }

  var tick = function(rate, period) {
    longTermMinimum = longTermMinimum + rate
    var t = timeSinceLastTip() - rate
    //console.log(t, longTermMinimum, rate)
    if (triggered && t > minimumTipTime) {
      triggeredTip(triggered)
    } else if (t > longTermMinimum || t > maximumTipTime) {
      genericTip()
    }
  }

  var triggered
  catalog.tips.forEach(function(tip) {
    if (tip.trigger) {
      ko.computed(function() {
        if (tip.trigger()) {
          setTimeout(triggeredTip, 0, tip)
        }
      })
    }

    if (tip.proof) {
      ko.computed(function() {
        if (tip.proof()) {
          setTimeout(provenTip, 0, tip)
        }
      })
    }
  })

  return {
    tick: tick,
    genericTip: genericTip,
  }
})
