(function() {
  var lgab_selectionBuildStanceContinuous = model.selectionBuildStanceContinuous
  model.selectionBuildStanceContinuous = function() {
    lgab_selectionBuildStanceContinuous()
    api.Panel.message(api.Panel.parentId, "ingame_tips_continuous")
  }

  var lgab_toggleBuildStanceOrderIndex = model.toggleBuildStanceOrderIndex
  model.toggleBuildStanceOrderIndex = function() {
    lgab_toggleBuildStanceOrderIndex()
    api.Panel.message(api.Panel.parentId, "ingame_tips_continuous")
  }
})()
