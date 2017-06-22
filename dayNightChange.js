$(document).ready(getCurrent);

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

function left(type){
	move(type, -0.1);
}

function right(type){
	move(type, 0.1);
}

function move(type, amount) {
	$("#new"+type+"Temp").val((Number($("#new"+type+"Temp").val())+amount).toFixed(1));
	submitChanges();
}

function resetTemp(){
	put("dayTemperature", "day_temperature", 25);
	put("nightTemperature", "night_temperature", 15);
	getCurrent();
}
