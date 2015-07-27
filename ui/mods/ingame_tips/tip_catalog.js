define([
  'ingame_tips/player_actions',
], function(
  actions
) {
  "use strict";

  var item = function(action) {return action.item}
  var quantity = function(event) {
    return event.batch ? model.batchBuildSize() : 1
  }
  var sum = function(a,b) {return a + b}
  var isCommander = function(id) {return id.match('commanders')}
  var isBuildMex = function(build) {return build.item.match('metal_extractor')}
  var allTheSame = function(ids) {
    for (var i = 1;i < ids.length;i++) {
      if (ids[i] != ids[0]) {
        return false
      }
    }
    return true
  }
  var nTheSame = function(n, events) {
    if (events.length < n) return false

    var ids = events.slice(0, n).map(item)
    return allTheSame(ids)
  }
  var unitBuildQuantity = function(events) {
    return events.map(quantity).reduce(sum)
  }
  var arrayMatch = function(subject, mustMatch) {
    for (var i = 0;i <= mustMatch.length;i++) {
      if (subject[i] != mustMatch[i]) return false
    }
    return true
  }
  var peekCommanderSelected = function() {
    var selection = model.selection.peek()
    if (!selection) return false
    var builders = Object.keys(selection.spec_ids)
    var commanders = builders.filter(isCommander).length
    return commanders > 0
  }

  return {
    tips: [
      {
        id: 'shift-build',
        text: 'Shift-click factory build icons to add five units.',
        trigger: function() {
          return nTheSame(model.batchBuildSize(),
                          actions.singleBuildSequence.events())
        },
        proof: function() {
          var action = actions.unitBuildSequence.events()[0]
          return action && action.batch
        },
      },
      {
        id: 'continuous-build',
        text: 'You can set factories to continous build to save constantly requeuing units.',
        trigger: function() {
          var events = actions.unitBuildSequence.events()
          if (events.length < 20/model.batchBuildSize()) return false
          if (events.length >= 20) return true

          return unitBuildQuantity(events) >= 20
        },
        proof: function() {
          return actions.usedContinuous()
        },
      },
      {
        id: 'priority-build',
        text: 'ctrl-clicking a factory build icon adds a unit to the front of the build queue.  If the factory is continuous, priority units will not be repeated.',
        trigger: function() {
          return arrayMatch(actions.commandSequence.events(),
                            ['build', 'build', 'stop'])
                            //note: reversed because lifo
        },
        proof: function() {
          var action = actions.unitBuildSequence.events()[0]
          return action && action.urgent
        },
      },
      {
        id: 'air-fab',
        text: 'Air fabricators are less efficient and easily hit by fighters, but movement speed and mobility can be key advantage, especially when alone on a planet.',
        trigger: function() {
          var build = actions.unitBuildSequence.events()[0]
          return build &&
            actions.unitCount.peek() < 10 &&
            build.item.match('fabrication_aircraft')
        },
        proof: function() {
          var build = actions.unitBuildSequence.events()[0]
          return build &&
            actions.unitCount.peek() < 10 &&
            build.item.match('fabrication') &&
            !build.item.match('aircraft')
        },
      },
      {
        id: 'transportable-units',
        text: 'Air fabricators and naval fabricators are transportable.',
      },
      {
        id: 'transport-limit',
        text: 'Transport units only hold one unit.',
      },
      {
        id: 'transport-area',
        text: 'With a group of transports selected, use the load command with an area command (click and drag) to quickly load many units.',
      },
      {
        id: 'teleporter-restrictions',
        text: 'Only land units can move through a teleporter.',
      },
      {
        id: 'teleporter-linking',
        text: 'To link teleporters, select one and right click the other.',
      },
      {
        id: 'teleporter-sharing',
        text: 'You can use other player\'s teleporters. If an enemy, you may need to hold-fire and explicitly choose the "use" command.',
      },
      {
        id: 'fab-assist',
        text: 'Fabricators can assist each other, as well as factories.',
      },
      {
        id: 'mines',
        text: 'Only combat bot fabricators and vehicle scouts can see mines.',
      },
      {
        id: 'area-commands',
        text: 'Many commands can be applied to an area by click and drag. Drag past the horizon to apply to the entire planet.',
      },
      {
        id: 'area-mex',
        text: 'Metal extractors can be built with area commands. Click and drag to build all spots in the area.',
        trigger: function() {
          var level = 5
          var events = actions.structureBuildSequence.events()
          if (events.length < level) return false
          if (peekCommanderSelected()) return false

          var mex = events.slice(0,level).filter(isBuildMex).length

          return mex == level
        },
        proof: function() {
          var build = actions.structureBuildSequence.events()[0]
          return build &&
            build.item.match('metal_extractor') &&
            build.screenDistance > 10
        },
      },
      {
        id: 'queued-commands',
        text: 'Hold shift while issuing orders to queue them up.',
      },
      {
        id: 'orbital-radar',
        text: 'You need an Oribital and Deep Space Radar to see orbital units, unless you have an oribital unit or ground radar nearby.',
      },
      {
        id: 'mex-builders',
        text: 'Fabricators move faster than your commander, prefer them to roam around building metal extractors.',
        trigger: function() {
          var level = 2
          var events = actions.structureBuildSequence.events()
          if (events.length < level) return false
          if (!peekCommanderSelected()) return false

          var mex = events.slice(0,level).filter(isBuildMex).length

          return mex == level
        },
        proof: function() {
          var level = 2
          var events = actions.structureBuildSequence.events()
          if (events.length < level) return false
          if (peekCommanderSelected()) return false

          var mex = events.slice(0,level).filter(isBuildMex).length

          return mex == level
        },
      },
    ],
  }
})
