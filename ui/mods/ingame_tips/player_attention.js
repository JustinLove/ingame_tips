define([
  'ingame_tips/present',
  'ingame_tips/tip_catalog',
], function(
  present,
  catalog
) {
  "use strict";

  var lastTime = 0
  var minimumTipTime = 10
  var maximumTipTime = 0.5 * 60
  var repeatPeriod = 0.01 * 60 * 60 * 1000
  var longTermMinimum = minimumTipTime
  var tipStats = {}

  var resetTimer = function() {
    lastTime = new Date().getTime()
    longTermMinimum = minimumTipTime
  }
  resetTimer()

  var timeSinceLastTip = function() {
    return (new Date().getTime() - lastTime) / 1000
  }

  var bumpStats = function(tip) {
    var stats = tipStats[tip.id] || {count: 0, notUntil: lastTime}
    stats.count = stats.count + 1
    if (stats.notUntil > lastTime) {
      stats.notUntil = stats.notUntil + repeatPeriod
    } else {
      stats.notUntil = lastTime + repeatPeriod
    }
    tipStats[tip.id] = stats
    console.log(tipStats)
  }

  var show = function(tip) {
    present.present(tip.text)
    resetTimer()
    bumpStats(tip)
  }

  var genericTip = function() {
    var now = new Date().getTime()
    var tips = catalog.tips.filter(function(tip) {
      return !tipStats[tip.id] || tipStats[tip.id].notUntil < now
    })
    var counts = tips.map(function(tip) {
      return (tipStats[tip.id] && tipStats[tip.id].count) || 0
    })
    var min = Math.min(counts)
    var tips = tips.filter(function(tip) {
      return !tipStats[tip.id] || tipStats[tip.id].count == min
    })
    if (tips.length < 1) return
    var i = Math.floor(Math.random() * tips.length)
    show(tips[i])
  }

  var triggeredTip = function(tip) {
    var now = new Date().getTime()
    if (tipStats[tip.id] && now < tipStats[tip.id].notUntil) {
      console.log('discarding recent tip', tip.id)
      triggered = null
      return
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
