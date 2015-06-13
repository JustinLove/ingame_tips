define([
  'ingame_tips/panel',
], function(
  panel
) {
  "use strict";

  var panelX = ko.observable(200)
  var panelY = ko.observable(30)

  var viewModel = {
    visible: ko.observable(false),
    text: ko.observable('Hello'),
    panelX: panelX,
    panelY: panelY,
    panelXpx: ko.computed(function() {
      return panelX().toString() + 'px'
    }),
    panelYpx: ko.computed(function() {
      return panelY().toString() + 'px'
    }),
  }

  var sendState = function() {
    if (api.panels.ingame_tips) {
      api.panels.ingame_tips.message('ingame_tips_state', {
        visible: viewModel.visible(),
        text: viewModel.text(),
      });
    }
  }

  model.gameOverState.subscribe(function(state) {
    if (!state) return
    if (state.defeated || state.game_over) {
      hide()
    }
  })

  var inserted = false
  var insert = function() {
    panel(viewModel)
    inserted = true
  }
  viewModel.visible.subscribe(function(visible) {
    if (visible && !inserted) {
      insert()
    }
  })

  handlers.ingame_tips_hello = function() {
    console.log('hello', api.panels.ingame_tips)
    sendState()
  }

  var timeout

  var present = function(text) {
    viewModel.visible(true)
    viewModel.text(text)
    sendState()
    clearTimeout(timeout)
    console.log(text.length)
    timeout = setTimeout(hide, Math.max(10000, text.length * 200))
  }

  var hide = function() {
    viewModel.visible(false)
    sendState()
  }

  return {
    insert: insert,
    present: present,
    hide: hide,
    viewModel: viewModel
  }
})
