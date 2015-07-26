(function() {
  var storage = ko.observable({}).extend({ local: 'ingame_tips' })

  model.resetIngameTips = function() {
    storage({})
  }

  var log = function(v) {
    return Math.log(v)/Math.LN10
  }
  var exp = function(v) {
    return Math.round(Math.pow(10, v))
  }

  var formatPeriod = function(p) {
    var p = exp(p)
    if (p < 2*60) {
      return p + ' seconds'
    } else if (p < 2*60*60) {
      return (p/60).toPrecision(3) + ' minutes'
    } else if (p < 2*24*60*60) {
      return (p/(60*60)).toPrecision(2) + ' hours'
    } else {
      return (p/(24*60*60)).toPrecision(2) + ' days'
    }
  }

  var ingame_tips_settings = {
    ingame_tips_minimum_time_between_tips: {
      title: 'Minimum Time Between Tips',
      type: 'slider',
      options: {
        formater: formatPeriod,
        min: 0,
        max: log(60*60),
        step: 0.01,
      },
      default: log(60),
    },
    ingame_tips_time_until_generic_tip: {
      title: 'Time Until Generic Tip',
      type: 'slider',
      options: {
        formater: formatPeriod,
        min: 0,
        max: log(60*60),
        step: 0.01,
      },
      default: log(5*60),
    },
    ingame_tips_minimum_time_between_repeats: {
      title: 'Minimum Time Between Repeats',
      type: 'slider',
      options: {
        formater: formatPeriod,
        min: 0,
        max: log(7*24*60*60),
        step: 0.01,
      },
      default: log(12*60*60),
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
