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
    var i = Math.floor(Math.random() * catalog.tips.length)
    present.present(catalog.tips[i].text)
    resetTimer()
  }

  var tick = function(rate, period) {
    longTermMinimum = longTermMinimum + rate
    var t = timeSinceLastTip() - rate
    //console.log(t, longTermMinimum, rate)
    if (t > longTermMinimum || t > maximumTipTime) {
      genericTip()
    }
  }

  return {
    tick: tick,
    genericTip: genericTip,
  }
})
