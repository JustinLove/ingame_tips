;(function() {
  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.ingame_tips = 'coui://ui/mods/ingame_tips'

  // make the object keys exist for Panel.ready
  var ingame_tips_stub = function() {}
  _.defaults(handlers, {
    ingame_tips_hello: ingame_tips_stub,
    ingame_tips_continuous: ingame_tips_stub,
  })
})()

require(['ingame_tips/live_game'])
