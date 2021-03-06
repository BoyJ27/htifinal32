



function setCookieDefaults () {
	days=["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	for (var i=0; i<days.length; i++){
		if (Cookies.get(days[i]+"switch")===undefined){
			Cookies.set(days[i]+"switch", [{type: "day", time: "7:30"}, {type: "night", time: "23:00"}]);
		}
	}
}

function buildDayTables() {
	var size = 16 * 1000 / window.innerWidth;
	var images=document.getElementsByClassName("dayTable");
	for (var i=0; i<images.length; i++){
		if (images[i].tagName==="IMG"){
			var day;
			if (images[i].getAttribute("day")){
				day=images[i].getAttribute("day");
				images[i].onclick=createGoToPage(day);
			}
			else {
				day=Cookies.get("day");
			}
			var daynighttime=getDayNightTimes(day);
			var daytimes=daynighttime[0];
			var nighttimes=daynighttime[1];
			
			var data="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1000\" height=\""+(size*3)+"\" id=\"svg999\" version=\"1.1\">";
			var lasttime=0;
			var lastcolor="blue";
			while (daytimes.length > 0 || nighttimes.length > 0){
				var time;
				var color = "black";
				if (daytimes.length>0 && ((nighttimes.length == 0) || daytimes[0] <= nighttimes[0])){
					color="yellow";
					time=daytimes[0];
					daytimes.shift();
				}
				else {
					color="blue";
					time=nighttimes[0];
					nighttimes.shift();
				}
				if (time > lasttime){
					data+="<rect fill=\""+lastcolor+"\" x=\""+lasttime * 1000 / (24 * 60)
					+"\" y=\""+size/2+"\" width=\""+((time - lasttime) * 1000 / (24 * 60))+"\" height=\""+size+"\"/>\n";
				}
				lasttime=time;
				lastcolor=color;
			}
			data+="<rect fill=\"#ccc\" x=\"0\" y=\"0\" width=\"1000\" height=\""+size/2+"\"/>"
			data+="<rect fill=\"#ccc\" x=\"0\" y=\""+(size*1.5)+"\" width=\"1000\" height=\""+size/2+"\"/>\n"
			data+="<rect fill=\"transparent\" x=\""+size/16+"\" y=\""+size/2+"\" width=\""+(1000-size/8)+"\" height=\""+size
					+"\" stroke=\"black\" stroke-width=\""+size/8+"\"/>\n"
			var step;
			step=Math.min(12, Math.floor(size * 5 * 0.9 * 24 /1000));
			for (var j=step; j<24; j+= step){
				data+="<text font-family=\"sans-serif\" fill=\"000\" x=\""+j*1000/24+"\" y=\""+(size*3-5)+
					"\" font-size=\""+size+"\"  text-anchor=\"middle\">"+j+":00</text>"
			}
			for (var j=1; j<24; j++){
				data+="<line stroke-width=\""+size/8+"\" x1=\""+(j*1000/24)+"\" y1=\""+size+"\" x2=\""
					+(j*1000/24)+"\" y2=\""+size*1.5+"\" stroke=\"black\"/>";
			}
			data+="</svg>";
			//console.log(data);
			
			images[i].setAttribute("src","data:image/svg+xml;utf8,"+data.split("#").join("%23"));
		}
	}
}

function getDayNightTimes(day) {
	if (day === undefined) {
		console.error("invalid day: undefined");
	}
	var value=Cookies.get(day+"switch");
	if (value === undefined) {
		console.error("invalid cookie value: "+day+"switch");
		return;
	}
	data=JSON.parse(value);
	var daytimes=[];
	var nighttimes=[];
	for (var j=0; j<data.length; j++){
		var time=data[j].time.split(":");
		time=Number(time[0])*60+Number(time[1]);
		if (data[j].type==="day"){
			daytimes.push(time);
			}
		else if (data[j].type=="night") {
			nighttimes.push(time);
		}
		else {
			console.error("invalid value for time.type");
		}
	}
	daytimes.push(24*60);
	daytimes=daytimes.sort(function(x,y) {return x-y});
	nighttimes=nighttimes.sort(function(x,y) {return x-y});

	return [daytimes, nighttimes];
}

function goToDayPage(day) {
	Cookies.set("day",day);
	window.location.href="dayPlanning.html";
}

function createGoToPage(day){
	return function() {goToDayPage(day);};
}




setCookieDefaults(); //should be called before other script functions, before the page is loaded