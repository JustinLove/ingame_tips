define([
  'ingame_tips/player_activity',
  'ingame_tips/player_attention',
  'ingame_tips/present',
], function(
  player_activity,
  player_attention,
  present
) {
  "use strict";

  player_activity.commandRate.progress(player_attention.tick)

  present.present("Ingame Tips")

  return {}
})
