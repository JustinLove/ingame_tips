define([
  'ingame_tips/sequence',
], function(
  Sequence
) {
  "use strict";

  var actions = {
    singleBuildSequence: new Sequence(),
    unitBuildSequence: new Sequence(),
    structureBuildSequence: new Sequence(),
    commandSequence: new Sequence(),
    usedContinuous: ko.observable(false),
  }

  var lastBuildStructureId
  var beginFabX
  var beginFabY

  var live_game_build_bar_build = handlers['build_bar.build']
  handlers['build_bar.build'] = function(params) {
    live_game_build_bar_build(params)
    if (!model.selectedMobile()) {
      actions.commandSequence.unshift('build')
      actions.unitBuildSequence.unshift(params)
      if (params.urgent) {
        actions.singleBuildSequence.reset()
      } else if (params.batch) {
        actions.singleBuildSequence.reset()
      } else {
        actions.singleBuildSequence.unshift(params)
      }
    }
  }

  var live_game_set_command_index = model.setCommandIndex
  model.setCommandIndex = function(index) {
    live_game_set_command_index(index)
    if (model.selectedMobile()) {
      actions.commandSequence.reset()
    } else {
      actions.commandSequence.unshift(model.cmd())
    }
  }
  handlers['action_bar.set_command_index'] = function(params) {
    model.setCommandIndex(params)
  }

  model.activatedBuildId.subscribe(function(id) {
    if (id) {
      lastBuildStructureId = id
    }
  })

  var holodeck_unitBeginFab = api.Holodeck.prototype.unitBeginFab
  api.Holodeck.prototype.unitBeginFab = function(anchorX, anchorY, snap) {
    beginFabX = anchorX
    beginFabY = anchorY
    return holodeck_unitBeginFab.apply(this, arguments)
  }

  var holodeck_unitEndFab = api.Holodeck.prototype.unitEndFab
  api.Holodeck.prototype.unitEndFab = function(anchorX, anchorY, queue, snap) {
    var promise = holodeck_unitEndFab.apply(this, arguments)
    promise.then(function(success) {
      if (success) {
        var dx = anchorX - beginFabX
        var dy = anchorY - beginFabY
        actions.structureBuildSequence.unshift({
          item: model.currentBuildStructureId() || lastBuildStructureId,
          screenDistance: Math.sqrt(dx*dx + dy*dy),
        })
      }
    })
    return promise
  }

  handlers['ingame_tips_continuous'] = function() {
    actions.usedContinuous(true)
  }

  return actions
})
