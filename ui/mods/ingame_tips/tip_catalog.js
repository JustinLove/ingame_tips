define([
], function(
) {
  "use strict";

  var singleBuildSequence = ko.observableArray([])
  var lastBuiltTime = new Date().getTime()

  var live_game_build_bar_build = handlers['build_bar.build']
  handlers['build_bar.build'] = function(params) {
    live_game_build_bar_build(params)
    if (!model.selectedMobile()) {
      var t = new Date().getTime()
      if (params.urgent || params.batch) {
        singleBuildSequence([])
      } else if (t - lastBuiltTime < 2000) {
        singleBuildSequence.unshift(params)
      } else {
        singleBuildSequence([params])
      }
      lastBuiltTime = t
    }
  }

  return {
    tips: [
      {
        id: 'shift-build',
        text: 'Shift-click factory build icons to add five units.',
        trigger: function() {
          if (singleBuildSequence().length < model.batchBuildSize()) return false

          var ids = singleBuildSequence.slice(model.batchBuildSize()).map(function(action) {return action.item})
          for (var i = 1;i < ids.length;i++) {
            if (ids[i] != ids[0]) {
              return false
            }
          }

          return true
        },
      },
      {
        id: 'continuous-build',
        text: 'You can set factories to continous build to save constantly requeuing units.',
      },
      {
        id: 'priority-build',
        text: 'ctrl-clicking a factory build icon adds a unit to the front of the build queue.  If the factory is continuous, priority units will not be repeated.',
      },
      {
        id: 'air-fab',
        text: 'Air fabricators are less efficient and easily hit by fighters, but movement speed and mobility can be key advantage, especially when alone.',
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
      },
    ],
  }
})
