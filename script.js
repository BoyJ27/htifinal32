



function setCookieDefaults () {
	if (Cookies.get("mondayswitch")===undefined){
		Cookies.set("mondayswitch", [{type: "day", time: "12:45"}, {type: "night", time: "1:13"}]);
	}
}


setCookieDefaults(); //should be called before other script functions, before the page is loaded