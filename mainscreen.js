$(document).ready(function() {
	buildSlider();
	window.setInterval(updateTime, 1000);
	window.setInterval(getData, 3000);
	getData();
	getTime();
	
	
	}
);

var time=0;
var day=0;
var targetTemp=0;
var currentTemp=0;
//var worker;

function getTime() {
	get("day", "current_day", function(value) {day = getDayIndex(value);});
	get("time", "time", function(value) {time = parseTime(value);});
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
	return Math.max(5, Math.min(30, Number((5+(((angle + 135) * 25)/270)).toFixed(1))))
}

function addTemp(dif){
	targetTemp+=dif;
	updateSlider();
	put("targetTemperature", "target_temperature", targetTemp);
}

function buildSlider() {
	var outerRadius=96;
	var innerRadius=80;
	
	var tempSlider=document.getElementById("tempSliderImage");
	
	var path=document.createElementNS("http://www.w3.org/2000/svg","path");
	path.setAttribute("d", "M "+point(outerRadius, -135)+" A "+outerRadius+" "+outerRadius+" 0 1 1 "+point(outerRadius, 135)+" L "+
			point(innerRadius, 135)+"A "+innerRadius+" "+innerRadius+" 0 1 0 "+point(innerRadius, -135));
	path.setAttribute("fill", "white");
	path.setAttribute("stroke", "black");
	path.setAttribute("stroke-width", "2");
	tempSlider.appendChild(path);
	
	path=document.createElementNS("http://www.w3.org/2000/svg","path");
	path.setAttribute("id","actualPath");
	path.setAttribute("fill", "orange");
	path.setAttribute("stroke-width", "2");
	path.setAttribute("stroke", "black");
	tempSlider.appendChild(path);
	
	var knob=document.createElementNS("http://www.w3.org/2000/svg","circle");
	knob.setAttribute("id", "knob");
	knob.setAttribute("fill", "grey");
	knob.setAttribute("stroke", "black");
	knob.setAttribute("stroke-width", "2");
	knob.setAttribute("r", 11);
	tempSlider.appendChild(knob);
	
}

function updateSlider() {
	var outerRadius=96;
	var innerRadius=80;
	
	var targetAngle=angle(targetTemp);
	var currentAngle=angle(currentTemp);
	var flag=((currentAngle + 135) > 180 ? "1" : "0")
	
	var image=document.getElementById("tempSliderImage");
	
	image.getElementById("actualPath").setAttribute("d", "M "+point(outerRadius, -135)+" A "+outerRadius+" "+outerRadius+" 0 "+flag+" 1 "+point(outerRadius, currentAngle)
		   +" L "+point(innerRadius, currentAngle)+" "+
		  "A "+innerRadius+" "+innerRadius+" 0 "+flag+"  0 "+point(innerRadius, -135)
		  +" Z");
	var p=pointL((outerRadius+innerRadius)/2, targetAngle);
	var knob=image.getElementById("knob");
	knob.setAttribute("cx", p[0]);
	knob.setAttribute("cy", p[1]);
	
	$("#TargetTemp").text(targetTemp.toFixed(1));
	$("#actualTemp").text(currentTemp.toFixed(1));
	//console.log($("#tempSlider").css("background-image"));
}

function sliderInput(ev) {
	var slider=document.getElementById("tempSlider");
	var width=slider.offsetWidth;
	var left=slider.getBoundingClientRect().left;
	var top=slider.getBoundingClientRect().top;
	var position = [ev.pageX-left-width/2, ev.pageY-top-width/2];
	targetTemp = value(180 * Math.atan2(position[0], -position[1]) / Math.PI);
	updateSlider();
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
	get("currentTemperature", "current_temperature", function(value) { currentTemp = Number(value)});
	get("targetTemperature", "target_temperature", function(value) {targetTemp=Number(value); updateSlider();});
	get("weekProgramState", "week_program_state", function(value) {document.getElementById("lock").checked= (value ==="off")});
	getTime();
}


function checkBoxChanged() {
	if (document.getElementById("lock").checked){
		switchOnHoliday();
	}
	else {
		switchOffHoliday();
	}
}