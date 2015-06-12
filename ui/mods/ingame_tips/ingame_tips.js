define([
], function(
) {
  "use strict";

  var viewModel = {
  }

  return {
    ready: function() {
      console.log('hello')
      api.Panel.message(api.Panel.parentId, 'ingame_tips_hello');
    },
    viewModel: viewModel
  }
})
