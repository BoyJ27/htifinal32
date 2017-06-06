function buildCurrentSwitches() {
	
	
	var day=Cookies.get("day");
	if (day===undefined){
		day="monday"
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
	content.appendChild(leftbar);
	content.appendChild(rightbar);
	leftbar.appendChild(document.createTextNode("to day"));
	rightbar.appendChild(document.createTextNode("to night"));
	
	for (var i=0; i<switches.length; i++) {
		var span=document.createElement("div");
		var input=document.createElement("input");
		input.value=switches[i].time;
		span.appendChild(input);
		var image=document.createElement("img" );
		image.setAttribute("src" , "delete.png");
		span.appendChild(image);
		
		if (switches[i].type=="day"){
			leftbar.appendChild(span)
		}
		else if (switches[i].type=="night"){
			rightbar.appendChild(span);
		}
	}
}