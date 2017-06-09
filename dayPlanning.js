function buildCurrentSwitches() {
	
	
	var day=Cookies.get("day");
	if (day===undefined){
		day="monday";
		Cookies.set("day", day);
	}
	
	if (Cookies.get(day+"switch")===undefined){
		document.getElementById("content").innerHTML="error loading previous saved switches";
		return
	}
	var switches=JSON.parse(Cookies.get(day+"switch"));
	
	var content=document.getElementById("switches");
	while (content.firstChild){
		content.removeChild(content.firstChild);
	}
	
	content.classList.add("hflex");
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
}

function addSwitch(type, elem) {
	var el = document.getElementById(elem);
	values=JSON.parse(Cookies.get(Cookies.get("day")+"switch"));
	values.push({time: el.value, type: type});
	el.value="";
	Cookies.set(Cookies.get("day")+"switch", values.sort());
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
}

function disableStuff() {
	document.getElementById("dayinput").disabled = document.getElementById("leftbar").childNodes.length >= 6;
	document.getElementById("nightinput").disabled=document.getElementById("rightbar").childNodes.length >= 6;
}