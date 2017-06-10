



function setCookieDefaults () {
	if (Cookies.get("mondayswitch")===undefined){
		Cookies.set("mondayswitch", [{type: "day", time: "12:45"}, {type: "night", time: "1:13"}]);
	}
}

function buildDayTables() {
	var images=document.getElementsByClassName("dayTable");
	for (var i=0; i<images.length; i++){
		if (images[i].tagName==="IMG"){
			var day;
			if (images[i].getAttribute("day")){
				day=images[i].getAttribute("day");
			}
			else {
				day=Cookies.get("day");
			}
			
			data=JSON.parse(Cookies.get(day+"switch"));
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
			daytimes=daytimes.sort(function(x,y) {return x-y});
			daytimes.push(24*60);
			nighttimes=nighttimes.sort(function(x,y) {return x-y});
			
			var data="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1000\" height=\"100\" id=\"svg999\" version=\"1.1\">";
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
					+"\" y=\"0\" width=\""+((time - lasttime) * 1000 / (24 * 60))+"\" height=\"100\"/>\n";
				}
				lasttime=time;
				lastcolor=color;
			}
			data+="</svg>";
			
			images[i].setAttribute("src","data:image/svg+xml;utf8,"+data);
		}
	}
}


setCookieDefaults(); //should be called before other script functions, before the page is loaded