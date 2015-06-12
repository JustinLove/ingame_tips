define([
  'ingame_tips/player_activity',
  'ingame_tips/player_attention',
], function(
  player_activity,
  player_attention
) {
  "use strict";

  player_activity.commandRate.progress(player_attention.tick)
})
