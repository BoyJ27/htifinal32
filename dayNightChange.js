$(document).ready(function() {
  getCurrent();
});

function getCurrent() {
  $("#newDayTemp").val(get("dayTemperature", "day_temperature"));
  $("#newNightTemp").val(get("nightTemperature", "night_temperature"));
}

function submitChanges() {
  if($("#newDayTemp").val() !== "") {
    put("dayTemperature", "day_temperature", $("#newDayTemp").val());
  }
  if($("#newNightTemp").val() !== "") {
    put("nightTemperature", "night_temperature", $("#newNightTemp").val());
  }

  getCurrent();
}
