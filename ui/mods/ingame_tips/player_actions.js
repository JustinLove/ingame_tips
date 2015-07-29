define([
  'ingame_tips/sequence',
  'ingame_tips/player_activity',
], function(
  Sequence,
  player_activity
) {
  "use strict";

  var actions = {
    singleBuildSequence: new Sequence(),
    unitBuildSequence: new Sequence(),
    structureBuildSequence: new Sequence(),
    factoryCommandSequence: new Sequence(),
    unitCommandSequence: new Sequence(),
    usedContinuous: ko.observable(false),
    unitCount: player_activity.unitCount,
    endOfTime: player_activity.endOfTime,
  }

  var lastBuildStructureId
  var beginFabX
  var beginFabY

  var beginCommandX
  var beginCommandY
  var lastHoverId

  var live_game_build_bar_build = handlers['build_bar.build']
  handlers['build_bar.build'] = function(params) {
    live_game_build_bar_build(params)
    if (!model.selectedMobile()) {
      actions.factoryCommandSequence.unshift('build')
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

  var live_game_hover = handlers['hover']
  handlers['hover'] = function(payload) {
    live_game_hover(payload)
    if (payload.spec_id) {
      lastHoverId = payload.spec_id
    }
  }

  var live_game_set_command_index = model.setCommandIndex
  model.setCommandIndex = function(index) {
    live_game_set_command_index(index)
    if (model.selectedMobile()) {
      actions.factoryCommandSequence.reset()
    } else {
      actions.factoryCommandSequence.unshift(model.cmd())
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

  model.currentBuildStructureId.subscribe(function(id) {
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
          item: lastBuildStructureId,
          screenDistance: Math.sqrt(dx*dx + dy*dy),
          queue: queue,
        })
      }
    })
    return promise
  }

  var holodeck_unitBeginCommand = api.Holodeck.prototype.unitBeginCommand
  api.Holodeck.prototype.unitBeginCommand = function(command, anchorX, anchorY) {
    beginCommandX = anchorX
    beginCommandY = anchorY
    return holodeck_unitBeginCommand.apply(this, arguments)
  }

  var holodeck_unitEndCommand = api.Holodeck.prototype.unitEndCommand
  api.Holodeck.prototype.unitEndCommand = function(command, anchorX, anchorY, queue) {
    var promise = holodeck_unitEndCommand.apply(this, arguments)
    promise.then(function(success) {
      if (success) {
        var dx = anchorX - beginCommandX
        var dy = anchorY - beginCommandY
        actions.unitCommandSequence.unshift({
          command: command,
          screenDistance: Math.sqrt(dx*dx + dy*dy),
          queue: queue,
        })
        //console.log(actions.unitCommandSequence.events()[0])
      }
    })
    return promise
  }

  var holodeck_unitCommand = api.Holodeck.prototype.unitCommand
  api.Holodeck.prototype.unitCommand = function(command, anchorX, anchorY, queue) {
    var promise = holodeck_unitCommand.apply(this, arguments)
    promise.then(function(success) {
      if (success) {
        actions.unitCommandSequence.unshift({
          command: command,
          screenDistance: 0,
          queue: queue,
        })
        //console.log(actions.unitCommandSequence.events()[0])
      }
    })
    return promise
  }

  var unit_targetCommand = api.unit.targetCommand
  api.unit.targetCommand = function(command, target, queue) {
    var promise = unit_targetCommand.apply(this, arguments)
    promise.then(function(success) {
      if (success) {
        actions.unitCommandSequence.unshift({
          command: command,
          target_id: target,
          item: lastHoverId,
          screenDistance: 0,
          queue: queue,
        })
        //console.log(actions.unitCommandSequence.events()[0])
      }
    })
    return promise
  }

  var holodeck_unitGo = api.Holodeck.prototype.unitGo
  api.Holodeck.prototype.unitGo = function(anchorX, anchorY, queue) {
    var promise = holodeck_unitGo.apply(this, arguments)
    promise.then(function(success) {
      if (success) {
        actions.unitCommandSequence.unshift({
          command: success,
          item: lastHoverId,
          screenDistance: 0,
          queue: queue,
        })
        //console.log(actions.unitCommandSequence.events()[0])
      }
    })
    return promise
  }


  handlers['ingame_tips_continuous'] = function() {
    actions.usedContinuous(true)
  }

  return actions
})
