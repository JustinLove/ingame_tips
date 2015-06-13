define([
], function(
) {
  "use strict";

  var viewModel = {
    text: ko.observable(''),
  }

  handlers.ingame_tips_state = function(payload) {
    console.log(payload)
    viewModel.text(payload.text)
  }

  return {
    ready: function() {
      console.log('hello')
      api.Panel.message(api.Panel.parentId, 'ingame_tips_hello');
    },
    viewModel: viewModel
  }
})
