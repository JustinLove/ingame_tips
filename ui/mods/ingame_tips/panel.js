define(function() {
  return function(model) {
    var $panel = $('<panel id="ingame_tips"></panel>').css({
      visibility: 'hidden',
      position: 'absolute',
      top: 100,
      left: 0,
    }).attr({
      src: "coui://ui/mods/ingame_tips/ingame_tips.html",
      'no-input': true,
      'no-keyboard': true,
      'yield-focus': true,
      fit: "dock-top-left",
      'data-bind': 'visible: visible, style: {top: panelYpx, left: panelXpx}'
    })
    $panel.appendTo('body')
    ko.applyBindings(model, $panel[0])
    api.Panel.bindPanels()
  }
})
  
