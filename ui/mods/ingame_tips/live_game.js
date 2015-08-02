define([
  'ingame_tips/player_activity',
  'ingame_tips/player_attention',
  'ingame_tips/specs',
], function(
  player_activity,
  player_attention,
  specs
) {
  "use strict";

  player_activity.commandRate.progress(player_attention.tick)

  model.player.subscribe(function(player) {
    if (!player) return
    specs.setTag(player.spec_tag)
  })

  return {}
})
