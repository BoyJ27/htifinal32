
var myVar;
$( document ).ready(function() {
  myVar = setInterval(updateMain, 200);
    var holidaystate = get('weekProgramState', 'week_program_state');
    console.log(holidaystate);
    if (holidaystate == 'on'){
      $("#dynamicimage").attr('src', '');
      $("#dynamicimage").attr('src', 'holidaygrey.png');
    } else if (holidaystate == 'off'){
      console.log('JAJA!');
      $("#dynamicimage").attr('src', '');
      $("#dynamicimage").attr('src', "holiday.png");
    }
});

function updateMain(){
var time = get("time", "time");
var day = get("day", "current_day");
var currtemp = get("currentTemperature", "current_temperature");
var targettemp = get("targetTemperature", "target_temperature");
$("#currentday").empty();
$("#currentday").append(day);
$("#currenttime").empty();
$("#currenttime").append(time);
$("#currentTemp").empty();
$("#currentTemp").append(currtemp);
$("#targetTemp").empty();
$("#targetTemp").append(targettemp);

}

$( document ).ready(function() {
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
