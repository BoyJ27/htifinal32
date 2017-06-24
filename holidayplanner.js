
function switchOnHoliday() {
  if (document.getElementById("settemp").value == "") {
    alert("Please speify the desired temperature-value.");
} else if (inTemperatureBoundaries(settemp) == false ) {
    alert("Please check if the desired temperature is between 5 and 30 degrees C and the dates follow the format dd/mm/yyyy.");
} else{
    put('weekProgramState', 'week_program_state', 'off');
    put('targetTemperature', 'target_temperature', settemp);
    document.getElementById("deleteHoliday").style.display="block";
    document.getElementById("setHoliday").style.display="none";
    document.getElementById("settemp").disabled = true;
}
}

function switchOffHoliday() {
    put('weekProgramState', "week_program_state", 'on');
    document.getElementById("setHoliday").style.display="block";
    document.getElementById("deleteHoliday").style.display="none";
    document.getElementById("settemp").disabled = false;
    document.getElementById("settemp").value = '';
}
