function buildCurrentSwitches() {
	var day=Cookies.get("day");
	if (day===undefined){
		day="Monday";
		Cookies.set("day", day);
	}
	$("#day").text(day);
	
	if (Cookies.get(day+"switch")===undefined){
		document.getElementById("content").innerHTML="error loading previous saved switches (Cookie not found)";
		return
	}
	var switches=JSON.parse(Cookies.get(day+"switch"));
	
	var content=document.getElementById("switches");
	while (content.firstChild){
		content.removeChild(content.firstChild);
	}
	
	content.classList.add("hflex");
	content.classList.add("switches");
	leftbar=document.createElement("div");
	rightbar=document.createElement("div");
	leftbar.id="leftbar";
	rightbar.id="rightbar";
	content.appendChild(leftbar);
	content.appendChild(rightbar);
	leftbar.appendChild(document.createTextNode("to day"));
	rightbar.appendChild(document.createTextNode("to night"));
	
	for (var i=0; i<switches.length; i++) {
		var span=document.createElement("div");
		var input=document.createElement("input");
		input.value=switches[i].time;
		input.onblur=readCurrentSwitches;
		span.appendChild(input);
		var image=document.createElement("img" );
		image.setAttribute("src" , "delete.png");
		span.id="sdfj"+i
		image.onclick=createRemoveSwitch(span.id);
		span.appendChild(image);
		
		if (switches[i].type=="day"){
			leftbar.appendChild(span)
		}
		else if (switches[i].type=="night"){
			rightbar.appendChild(span);
		}
		else {
			Console.error("error: invalid switch type");
		}
	}
	disableStuff();
	buildDayTables();
}

function addSwitch(type, elem) {
	var el = document.getElementById(elem);
	if (!el.disabled) {
		values=JSON.parse(Cookies.get(Cookies.get("day")+"switch"));
		values.push({time: el.value, type: type});
		el.value="";
		Cookies.set(Cookies.get("day")+"switch", values.sort());
		buildDayTables();
		cookiesToApi();
	}
}

function createRemoveSwitch(id){
	return function () {
		removeSwitch(id);
	}
}

function removeSwitch(id) {
	el = document.getElementById(id);
	el.parentNode.removeChild(el);
	readCurrentSwitches();
	disableStuff();
	buildDayTables();
	cookiesToApi();
}

function readCurrentSwitches() {
	var structure=[];
	var leftbar=document.getElementById("leftbar").childNodes;
	for (var i=0; i<leftbar.length; i++){
		if (leftbar[i].nodeType == 1){
			structure.push({time: leftbar[i].getElementsByTagName("input")[0].value,
			type: "day"});
		}
	}
	var rightbar=document.getElementById("rightbar").childNodes;
	for (var i=0; i<rightbar.length; i++){
		if (rightbar[i].nodeType == 1){
			structure.push({time: rightbar[i].getElementsByTagName("input")[0].value,
			type: "night"});
		}
	}
	Cookies.set(Cookies.get("day")+"switch", structure);
	buildDayTables();
	cookiesToApi();
}

function disableStuff() {
	document.getElementById("dayinput").disabled = document.getElementById("leftbar").childNodes.length >= 6;
	document.getElementById("nightinput").disabled=document.getElementById("rightbar").childNodes.length >= 6;
}

function cookiesToApi() {
	for (i=0; i<DaysList.length; i++){
		var dayNightTimes=getDayNightTimes(DaysList[i]);
		var daytimes=dayNightTimes[0];
		var nighttimes=dayNightTimes[1];
		
		Program[DaysList[i]]=[];
		oldtype="night";
		start=0;
		var end;
		while (daytimes.length > 0 || nighttimes.length > 0){
			if (nighttimes.length ==0 || (daytimes.length != 0 && daytimes[0] < nighttimes[0])) {
					type="day";
					end=daytimes[0];
					daytimes.shift();
			}
			else {
				type="night";
				end=nighttimes[0];
				nighttimes.shift();
			}
			
			if (oldtype == "day") {
				Program[DaysList[i]].push([unparseTime(start/60.0), unparseTime(end/60.0)]);
			}
			
			if (type != oldtype) {
				oldtype=type;
				start=end;
			}
		}
		sortMergeProgram(DaysList[i]);
	}
	setWeekProgram();
}

function apiToCookies() {
	getWeekProgram();
	for (i=0; i<DaysList.length; i++){
		var program=[];
		for (var j=0; j<Program[DaysList[i]].length; j++){
			program.push({type: "day", time: Program[DaysList[i]][j][0]});
			if (parseTime(Program[DaysList[i]][j][1])>0.05) {
				program.push({type: "night", time: Program[DaysList[i]][j][1]});
			}
		}
		Cookies.set(DaysList[i]+"switch", program);
	}
}

function resetDay() {
	Cookies.set(Cookies.get("day")+"switch", {});
	if (document.getElementById("switches")!==null){
		buildCurrentSwitches();
	cookiesToApi();
	}
}

function resetAll() {
	for (i=0; i<DaysList.length; i++) {
		Cookies.set("day", DaysList[i]);
		resetDay();
	}
	cookiesToApi();
}



function move(amount) {
	index=getDayIndex(Cookies.get("day")) + amount
	if (index < 0){
		index+=DaysList.length;
	}
	else if (index >= DaysList.length) {
		index-=DaysList.length;
	}
	Cookies.set("day", DaysList[index]);
	buildCurrentSwitches();
}

function moveLeft() {
	move(-1);
}

function moveRight() {
	move(1);
}

