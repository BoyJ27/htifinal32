$(document).ready(function() {
  getCurrent();
});

var getCurrent = function() {
  $("#currentDayTemp").text(get("dayTemperature", "day_temperature"));
  $("#currentNightTemp").text(get("nightTemperature", "night_temperature"));

  $("#newDayTemp").val("");
  $("#newNightTemp").val("");
}

var submitChanges = function() {
  if($("#newDayTemp").val() !== "") {
    put("dayTemperature", "day_temperature", $("#newDayTemp").val());
  }
  if($("#newNightTemp").val() !== "") {
    put("nightTemperature", "night_temperature", $("#newNightTemp").val());
  }

  getCurrent();
}
