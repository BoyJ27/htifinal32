$( document ).ready(function() {
    updateMain();
    var myVar = setInterval(updateMain, 400);

    var holidaystate = get('weekProgramState', 'week_program_state');

    if (holidaystate == 'on'){
      $("#dynamicimage").attr('src', '');
      $("#dynamicimage").attr('src', 'holidaygrey.png');
    } else if (holidaystate == 'off'){
      console.log('JAJA!');
      $("#dynamicimage").attr('src', '');
      $("#dynamicimage").attr('src', "holiday.png");
    }

    $("#tempSlider").roundSlider({
      sliderType: "min-range",
      handleShape: "dot",
      width: 24,
      radius: 160,
      value: 11.5,
      startAngle: 90,
      handleSize: "+14",
      max: "29.5",
      min: "5.5",
      step: "0.1",
      mouseScrollAction: true,

      drag: function (args) {
          // handle the drag event here
      },
      change: function (args) {
          // handle the change event here
          // console.log(args.value);
          put('targetTemperature', 'target_temperature', args.value);
          var targettemp = get("targetTemperature", "target_temperature");
          $("#targetTemp").text(targettemp);
      }
  });

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

function updateMain(){
  var time = get("time", "time");
  var day = get("day", "current_day");
  var currtemp = get("currentTemperature", "current_temperature");
  var targettemp = get("targetTemperature", "target_temperature");

  $("#currentday").text(day);

  $("#currenttime").text(time);

  $("#currentTemp").text(currtemp);

  $("#targetTemp").text(targettemp);

}
