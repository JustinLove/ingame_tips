define([
  'ingame_tips/player_actions',
  'ingame_tips/triggers',
  'ingame_tips/specs',
], function(
  actions,
  trig,
  specs
) {
  "use strict";

  var rFabrication = new RegExp('fabrication')

  return {
    tips: [
      {
        id: 'shift-build',
        text: 'Shift-click factory build icons to add five units.',
        trigger: function() {
          return trig.nTheSame(model.batchBuildSize(),
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

          return trig.unitBuildQuantity(events) >= 20
        },
        proof: function() {
          return actions.usedContinuous()
        },
      },
      {
        id: 'priority-build',
        text: 'ctrl-clicking a factory build icon adds a unit to the front of the build queue.  If the factory is continuous, priority units will not be repeated.',
        trigger: function() {
          return trig.arrayMatch(actions.factoryCommandSequence.events(),
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
            (build.item == specs.fabrication_aircraft ||
             build.item == specs.fabrication_aircraft_adv)
        },
        proof: function() {
          var build = actions.unitBuildSequence.events()[0]
          return build &&
            actions.unitCount.peek() < 10 &&
            build.item != specs.fabrication_aircraft &&
            build.item != specs.fabrication_aircraft_adv &&
            rFabrication.test(build.item)
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
        proof: function() {
          var command = actions.unitCommandSequence.events()[0]
          return command && command.command == 'link_teleporters'
        },
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
        proof: function() {
          var command = actions.unitCommandSequence.events()[0]
          if (!command) return false
          if (command.screenDistance < 20) return false
          return command.command == 'attack' ||
                 command.command == 'patrol' ||
                 command.command == 'reclaim'
        },
      },
      {
        id: 'area-mex',
        text: 'Metal extractors can be built with area commands. Click and drag to build all spots in the area.',
        trigger: function() {
          return trig.nItemEqual(5,
              actions.structureBuildSequence.events(),
              specs.metal_extractor) &&
            !trig.peekCommanderSelected()
        },
        proof: function() {
          var build = actions.structureBuildSequence.events()[0]
          return build &&
            build.item == specs.metal_extractor &&
            build.screenDistance > 10
        },
      },
      {
        id: 'queued-commands',
        text: 'Hold shift while issuing orders to queue them up.',
        trigger: function() {
          var events = actions.structureBuildSequence.events()
          return events.length > 1 && !events[0].queue
        },
        proof: function() {
          var events = actions.structureBuildSequence.events()
          return events.length > 1 && events[0].queue
        },
      },
      {
        id: 'orbital-radar',
        text: 'You need an Oribital and Deep Space Radar to see orbital units, unless you have an oribital unit or ground radar nearby.',
        trigger: function() {
          return actions.endOfTime() > 20*60 && actions.endOfTime() < 21*60
        },
        proof: function() {
          var build = actions.structureBuildSequence.events()[0]
          return build && build.item == specs.deep_space_radar
        },
      },
      {
        id: 'mex-builders',
        text: 'Fabricators move faster than your commander, prefer them to roam around building metal extractors.',
        trigger: function() {
          return trig.nItemEqual(2,
              actions.structureBuildSequence.events(),
              specs.metal_extractor) &&
            trig.peekCommanderSelected()
        },
        proof: function() {
          return trig.nItemEqual(2,
              actions.structureBuildSequence.events(),
              specs.metal_extractor) &&
            !trig.peekCommanderSelected()
        },
      },
      {
        id: 'factory-first',
        text: 'Start by having your commander build a factory, then a small number of fabricators.',
      },
      {
        id: 'metal-deposits',
        text: 'Green dots are metal depsosits.  Use a fabricator to build metal extractors on them.',
      },
      {
        id: 'energy',
        text: 'Factories and fabricators (and radar) use energy.  Build energy plants to keep your supply positive.',
      },
      {
        id: 'rotate-camera',
        text: 'ctrl left/right rotates the camera.',
      },
      {
        id: 'orient-pole',
        text: 'You can realign to the pole by pressing the "n" (keys can be changed in settings).',
      },
      {
        id: 'self-destruct',
        text: 'If your wall or other unit is in the way, you can destroy selected units by pressing the "delete" key (keys can be changed in settings).',
      },
    ],
  }
})
