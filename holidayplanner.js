var currstate = get('weekProgramState', 'week_program_state');

$( document ).ready(function{
  console.log(currstate);
  if (currstate == 'off'){
    var currenttemp = get('targetTemperature', 'target_temperature');
    document.getElementById("settemp").disabled = true;
    document.getElementById("settemp").html(currenttemp);
    document.getElementById("deleteHoliday").style.display="block";
    document.getElementById("setHoliday").style.display="none";
  } else {
    document.getElementById("setHoliday").style.display="block";
    document.getElementById("deleteHoliday").style.display="none";
  }
});

function switchOnHoliday() {
  var settemp = document.getElementById("settemp").value;
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
    $("#dynamicimage").empty();
    $("#dynamicimage").append(<img src="holiday.png" class="imgbuttons"/>);
}
}

function switchOffHoliday() {
    put('weekProgramState', "week_program_state", 'on');
    document.getElementById("setHoliday").style.display="block";
    document.getElementById("deleteHoliday").style.display="none";
    document.getElementById("settemp").disabled = false;
    document.getElementById("settemp").value = '';
    $("#dynamicimage").empty();
    $("#dynamicimage").append(<img src="holidaygrey.png" class="imgbuttons"/>);
}
