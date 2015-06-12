define([
  'ingame_tips/player_activity',
  'ingame_tips/player_attention',
  'ingame_tips/panel',
], function(
  player_activity,
  player_attention,
  panel
) {
  "use strict";

  player_activity.commandRate.progress(player_attention.tick)

  var panelX = ko.observable(200)
  var panelY = ko.observable(30)

  var viewModel = {
    visible: ko.observable(false),
    panelX: panelX,
    panelY: panelY,
    panelXpx: ko.computed(function() {
      return panelX().toString() + 'px'
    }),
    panelYpx: ko.computed(function() {
      return panelY().toString() + 'px'
    }),
  }

  model.gameOverState.subscribe(function(state) {
    if (!state) return
    if (state.defeated || state.game_over) {
      viewModel.visible(false)
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
    api.panels.ingame_tips.message('ingame_tips_state', {
    });
  }

  viewModel.visible(true)

  return {
    insert: insert,
    viewModel: viewModel
  }
})
