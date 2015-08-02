define([], function() {
  "use strict";

  var specs = {
    base: {
      nuke_launcher: '/pa/units/land/nuke_launcher/nuke_launcher.json',
      metal_extractor: '/pa/units/land/metal_extractor/metal_extractor.json',
      fabrication_aircraft: "/pa/units/air/fabrication_aircraft/fabrication_aircraft.json",
      fabrication_aircraft_adv: "/pa/units/air/fabrication_aircraft_adv/fabrication_aircraft_adv.json",
      deep_space_radar: "/pa/units/orbital/deep_space_radar/deep_space_radar.json",
    },
    setTag: function(tag) {
      Object.keys(specs.base).forEach(function(key) {
        specs[key] = specs.base[key] + tag
      })
    },
  }
  specs.setTag('')

  return specs
})

