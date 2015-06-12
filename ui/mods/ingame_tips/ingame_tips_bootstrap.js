var model;
var handlers = {};

;(function() {
  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.ingame_tips = 'coui://ui/mods/ingame_tips'
})()

require(['ingame_tips/ingame_tips'], function(ingame_tips) {
  "use strict";

  model = ingame_tips.viewModel

  // inject per scene mods
  if (scene_mod_list['ingame_tips']) {
    loadMods(scene_mod_list['ingame_tips']);
  }

  // setup send/recv messages and signals
  app.registerWithCoherent(model, handlers);

  // Activates knockout.js
  ko.applyBindings(model);

  $(ingame_tips.ready)
})
