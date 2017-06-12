
var myVar;
$( document ).ready(function() {
  myVar = setInterval(updateMain, 200);
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
