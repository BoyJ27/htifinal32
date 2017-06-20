$( document ).ready(function() {
  var object;
  $("#tempSlider").roundSlider({
    sliderType: "min-range",
    handleShape: "dot",
    circleShape: "pie",
    width: 24,
    radius: 160,
    value: get("targetTemperature", "target_temperature"),
    startAngle: 315,
    handleSize: "+14",
    max: "29.5",
    min: "5.5",
    step: "0.1",
    mouseScrollAction: true,
    animation: false,

    drag: function (args) {
        // handle the drag event here
        sliderColorRefactor(args);
    },
    create: function(args) {
        sliderColorRefactor(args);
        $("body").append("<style>.rs-overlay { background-color: #cccccc; } .rs-inner { background-color: #cccccc; } .tempbuttons { text-align: left; }</style>");

        var targettemp = get("targetTemperature", "target_temperature");
        $("#targetTemp").text(targettemp);
    },
    change: function (args) {
        // handle the change event here
        // console.log(args.value);
        put('targetTemperature', 'target_temperature', args.value);
        var targettemp = get("targetTemperature", "target_temperature");
        $("#targetTemp").text(targettemp);

        sliderColorRefactor(args);
    }
  });

    updateMain();
    var myVar = setInterval(updateMain, 400);

    var holidaystate = get('weekProgramState', 'week_program_state');

    if (holidaystate == 'on'){
      $("#dynamicimage").attr('src', '');
      $("#dynamicimage").attr('src', 'holidaygrey.png');
    } else if (holidaystate == 'off'){
      $("#dynamicimage").attr('src', '');
      $("#dynamicimage").attr('src', "holiday.png");
    }

  $("#tempupfast").click(function(){
    var currsetting = get("targetTemperature", "target_temperature");
    var parsedsetting = parseFloat(currsetting);
    if (parsedsetting < 29.5){
      var newsetting = parsedsetting + 0.5;
      put('targetTemperature', 'target_temperature', newsetting);
    } else {
      alert("You have reached the maximum temperature.");
    }
  });
  $("#tempup").click(function(){
    var currsetting = get("targetTemperature", "target_temperature");
    var parsedsetting = parseFloat(currsetting);
    if (parsedsetting < 29.9){
      var newsetting = parsedsetting + 0.1;
      put('targetTemperature', 'target_temperature', newsetting);

      $("#tempSlider").roundSlider("option", "value", newsetting);
    } else {
      alert("You have reached the maximum temperature.");
    }
  });
  $("#tempdown").click(function(){
    var currsetting = get("targetTemperature", "target_temperature");
    var parsedsetting = parseFloat(currsetting);
    if (parsedsetting > 5.1){
      var newsetting = parsedsetting - 0.1;
      put('targetTemperature', 'target_temperature', newsetting);

      $("#tempSlider").roundSlider("option", "value", newsetting);
    } else {
      alert("You have reached the maximum temperature.");
    }

  });
  $("#tempdownfast").click(function(){
    var currsetting = get("targetTemperature", "target_temperature");
    var parsedsetting = parseFloat(currsetting);
    if (parsedsetting > 5.5){
    var newsetting = parsedsetting - 0.5;
    put('targetTemperature', 'target_temperature', newsetting);
  } else {
    alert("You have reached the maximum temperature.");
  }
  });
});

ColorMix.setGradient([
  { reference: 0, color: { red: 0, green: 0, blue: 255 } },
  { reference: 25, color: { red: 0, green: 155, blue: 255 } },
  { reference: 50, color: { red: 255, green: 255, blue: 255 } },
  { reference: 75, color: { red: 255, green: 155, blue: 0 } },
  { reference: 100, color: { red: 255, green: 0, blue: 0 } }
]);

var sliderColorRefactor = function(args) {
  var color = ColorMix.blend( 100*(args.value - 5.5)/(29.5 - 5.5) );

  $(".rs-range-color").css("background", "rgb(" + color.red + ", " + color.green + ", " + color.blue + ")");
}

function updateMain(){
  var time = get("time", "time");
  var day = get("day", "current_day");
  var currtemp = get("currentTemperature", "current_temperature");
  // var targettemp = get("targetTemperature", "target_temperature");

  $("#currentday").text(day);

  $("#currenttime").text(time);

  $("#currentTemp").text(currtemp);

  // $("#targetTemp").text(targettemp);

}
