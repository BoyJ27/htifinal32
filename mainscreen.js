$(document).ready(function() {
	window.setInterval(updateTime, 1000);
	window.setInterval(getData, 3000);
	buildSlider();
	getData();
	document.getElementById("lock").checked=get("weekProgramState", "week_program_state")==="off";
	getTime();
	
	}
);

var time=0;
var day=0;
var targetTemp=0;
var currentTemp=0;
//var worker;

function getTime() {
	var d=get("day", "current_day");
	day=getDayIndex(d);
	var t=get("time", "time")
	time=parseTime(t);
	console.log("day: ",d,"actual day",DaysList[getDayIndex(d)]);
}

function pointL(radius, angle) {
	
	var radians=angle * Math.PI / 180;
	var x=100 + radius*Math.sin(radians);
	var y=100 - radius*Math.cos(radians);
	return [x, y];
}

function point(radius, angle) {
	var p=pointL(radius, angle);
	return p[0]+" "+p[1];
}

function angle(value) {
	return ((value - 5) * 270) / 25 - 135;
}

function value(angle) {
	return Number((5+(((angle + 135) * 25)/270)).toFixed(1))
}

function buildSlider() {
	var outerRadius=98;
	var innerRadius=80;
	var targetAngle=angle(targetTemp);
	var currentAngle=angle(currentTemp);
	var flag=((currentAngle + 135) > 180 ? "1" : "0")
	var data="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" id=\"svg999\" version=\"1.1\">\n";
	data+="<path d=\"M "+point(outerRadius, -135)+" A "+outerRadius+" "+outerRadius+" 0 "+flag+" 1 "+point(outerRadius, currentAngle)
		   +" L "+point(innerRadius, currentAngle)+" "+
		  "A "+innerRadius+" "+innerRadius+" 0 "+flag+"  0 "+point(innerRadius, -135)
		  +" Z\" fill=\"orange\" />\n";
	data+="<path d=\"M "+point(outerRadius, -135)+" A "+outerRadius+" "+outerRadius+" 0 1 1 "+point(outerRadius, 135)+" L "+
			point(innerRadius, 135)+
		  "A "+innerRadius+" "+innerRadius+" 0 1 0 "+point(innerRadius, -135)
		  +" Z\" fill=\"transparent\" stroke=\"black\" stoke-width=\"2\""
		  +"/>\n";
	var p=pointL((outerRadius+innerRadius)/2, angle(targetTemp));
	data+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="10"/>\n';
	data+="</svg>";
	var url='data:image/svg+xml;utf8,'+encodeURIComponent(data);
	document.getElementById("tempSlider").style.backgroundImage="url(" + url + ")";
	
	$("#TargetTemp").text(targetTemp);
	$("#actualTemp").text(currentTemp);
	//console.log($("#tempSlider").css("background-image"));
}

function sliderInput(ev) {
	var width=$("#tempSlider").width();
	position = [ev.offsetX-width/2, ev.offsetY-width/2];
	targetTemp = value(180 * Math.atan2(position[0], -position[1]) / Math.PI);
	buildSlider();
	put("targetTemperature", "target_temperature", targetTemp);
}

function updateTime() {
	time+=5/60;
	if (time > 24) {
		time -= 24;
		day+=1;
		if (day >= 7) {
			day -= 7;
		}
	}
	$("#currentday").text(DaysList[day]);
	$("#currenttime").text(unparseTime(time));
}

function getData() {
	currentTemp=Number(get("currentTemperature", "current_temperature"));
	targetTemp=Number(get("targetTemperature", "target_temperature"));
	buildSlider();
	getTime();
}

function check() {
	if ($("lock").prop('checked')){
		switchOnHoliday();
	}
	else {
		switchOffHoliday();
	}
}