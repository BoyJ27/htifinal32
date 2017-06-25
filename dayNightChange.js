$(document).ready(getCurrent);

function getCurrent() {
	get("dayTemperature", "day_temperature", function(value){$("#newDayTemp").val(value)});
	get("nightTemperature", "night_temperature", function(value){$("#newNightTemp").val(value)});
}

function submitChanges() {
  if($("#newDayTemp").val() !== "") {
    put("dayTemperature", "day_temperature", Math.max(5,Math.min(30,Number($("#newDayTemp").val()))), getCurrent);
  }
  if($("#newNightTemp").val() !== "") {
    put("nightTemperature", "night_temperature", Math.max(5,Math.min(30,Number($("#newNightTemp").val()))), getCurrent);
  }
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
