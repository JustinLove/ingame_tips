(function() {
  var storage = ko.observable({}).extend({ local: 'ingame_tips' })

  model.resetIngameTips = function() {
    storage({})
  }

  var ingame_tips_settings = {
    ingame_tips_minimum_minutes_between_tips: {
      title: 'Minimum Minutes Between Tips',
      type: 'slider',
      options: {
        formater: function(v) {return v.toPrecision(2)},
        min: 0,
        max: 10,
        step: 0.1,
      },
      default: 1,
    },
    ingame_tips_minutes_until_generic_tip: {
      title: 'Minutes Until Generic Tip',
      type: 'slider',
      options: {
        formater: function(v) {return v.toPrecision(2)},
        min: 0,
        max: 30,
        step: 0.1,
      },
      default: 5,
    },
    ingame_tips_minimum_hours_between_repeats: {
      title: 'Minimum Hours Between Repeats',
      type: 'slider',
      options: {
        formater: function(v) {return v.toPrecision(2)},
        min: 0,
        max: 24,
        step: 0.1,
      },
      default: 12,
    },
  }

  _.extend(api.settings.definitions.ui.settings, ingame_tips_settings)

  // force model.settingsLists to update
  model.settingDefinitions(api.settings.definitions)

  var $group = $('<div class="sub-group"></div>').appendTo('.option-list.ui .form-group')
  $group.append('<div class="sub-group-title">Ingame Tips</div>')

  var $template = $('script#setting-template')
  $group.append($template[0].outerHTML.replace('setting-template', 'ingame-tips-setting-template').replace('hide', 'show'))

  Object.keys(ingame_tips_settings).forEach(function(setting) {
    $group.append('<div class="option" data-bind="template: { name: \'ingame-tips-setting-template\', data: $root.settingsItemMap()[\'ui.' + setting + '\'] }"></div>')
  })

  $group.append(
    '<div class="option">' +
      '<div class="btn_std" id="reset_ingame_tips"' +
          'data-bind="click: resetIngameTips, click_sound: \'default\', rollover_sound: \'default\'">'+
        '<div class="btn_label" style="">'+
          'Reset Tip Stats' +
        '</div>'+
      '</div>' +
    '</div>')
})()
