/**
 * @author HTI students, Spring 2015, adjusted by N.Stash
 *
 */
//Change 100 to your group number
var ServerUrl = 'http://wwwis.win.tue.nl/2id40-ws/32';
//Backup server
//var ServerUrl = 'http://pcwin889.win.tue.nl/2id40-ws/32';

Type = {
    Day : 'day',
    Night : 'night'
};

Days = {
    Monday : 'Monday',
    Tuesday : 'Tuesday',
    Wednesday : 'Wednesday',
    Thursday : 'Thursday',
    Friday : 'Friday',
    Saturday : 'Saturday',
    Sunday : 'Sunday'
};

DaysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
			"Saturday", "Sunday"]

var MinTemperature = parseFloat(5.0);
var MaxTemperature = parseFloat(30.0);
var MaxSwitches = 5;

var Time;
var CurrentDay;
var DayTemperature;
var NightTemperature;
var CurrentTemperature;
var TargetTemperature;
var ProgramState;

var Program = {};
Program[Days.Monday]    = [];
Program[Days.Tuesday]   = [];
Program[Days.Wednesday] = [];
Program[Days.Thursday]  = [];
Program[Days.Friday]    = [];
Program[Days.Saturday]  = [];
Program[Days.Sunday]    = [];

/* Retrive day program
*/
function getProgram(day) {
    return Program[day];
}

/* Sorts the heating periods (the periods when the heating is on) and merges overlapping ones
*/
function sortMergeProgram(day) {
    var program = getProgram(day);
    program.sort(function(a, b){return parseTime(a[0])-parseTime(b[0])});
    for (var i = 0; i < program.length - 1; i++) {
        if (parseTime(program[i][1]) >= parseTime(program[i+1][0])) {
            var start = (program[i][0]);
            var end = (parseTime(program[i][1]) > parseTime(program[i+1][1])) ? program[i][1] : program[i+1][1];
            program.splice(i, 2);
            program.push([start, end]);
            sortMergeProgram(day);
            break;
        }
    }
}

/* Retrieves all data from the server except for weekProgram
*/
function get(attribute_name, xml_tag, callback) {
    return requestData(
        "/"+attribute_name,
        function(data) {
            var dat=$(data).find(xml_tag).text();
			if (callback){
				callback(dat);
			}
			else {
				return dat;
			}
        },
		callback
    );
}

/* Retrieves the week program
*/
function getWeekProgram() {
    return requestData(
        '/weekProgram',
        function(data) {
            $(data).find('day').each(function() {
                var day = $(this).attr('name');
                Program[day] = [];
                $(this).find('switch').each(function() {
                    if ($(this).attr('state') == 'on') {
                        if ($(this).attr('type') == Type.Day) {
                            getProgram(day).push([$(this).text(), '00:00']);
                        } else if (getProgram(day).length > 0) {
                            getProgram(day)[getProgram(day).length - 1][1] = $(this).text();
                        }
                    }
                })
            });
            return Program;
        }
    );
}

/* Uploads all data to the server except for currentTemperature and weekProgram
*/
function put(attribute_name, xml_tag, value){
    uploadData("/"+attribute_name, "<" + xml_tag + ">"+ value + "</" + xml_tag + ">");
}

function requestData(address, func, async) {
	if (async === undefined) {
		async = false;
	}
	else if (async !== false) {
		async = true;
	}
    var result;
    $.ajax({
        type: "get",
        url: ServerUrl + address,
        dataType: "xml",
        async: async,
        success: function(data) {
            result = func(data);
        }
    });
    return result;
}

/* Uploads the week program
*/
function setWeekProgram() {
    var doc = document.implementation.createDocument(null, null, null);
    var program = doc.createElement('week_program');
    program.setAttribute('state', ProgramState ? 'on' : 'off');
    for (var key in Program) {
        var day = doc.createElement('day');
        day.setAttribute('name', key);

        var daySwitches = [];
        var nightSwitches = [];

        var i, text, sw;
        var periods = getProgram(key);
        for (i = 0; i < periods.length; i++ ) {
            daySwitches.push(periods[i][0]);
            nightSwitches.push(periods[i][1]);
        }

        for (i = 0; i < MaxSwitches; i++) {
            sw = doc.createElement('switch');
            sw.setAttribute('type', Type.Day);

            if (i < daySwitches.length) {
                sw.setAttribute('state', 'on');
                text = doc.createTextNode(daySwitches[i]);
            } else {
                sw.setAttribute('state', 'off');
                text = doc.createTextNode('00:00');
            }
            sw.appendChild(text);
            day.appendChild(sw);
        }

        for (i = 0; i < MaxSwitches; i++ ) {
            sw = doc.createElement('switch');
            sw.setAttribute('type', Type.Night);

            if (i < nightSwitches.length && nightSwitches[i].substr(0,2)!=="24") {
				sw.setAttribute('state', 'on');
				text = doc.createTextNode(nightSwitches[i]);
            } else {
                sw.setAttribute('state', 'off');
                text = doc.createTextNode('00:00');
            }
            sw.appendChild(text);
            day.appendChild(sw);
        }
        program.appendChild(day);
    }
    doc.appendChild(program);
    uploadData('/weekProgram', (new XMLSerializer()).serializeToString(doc));
}

/* Creates the default week program
*/
function setDefault() {
    var doc = document.implementation.createDocument(null, null, null);
    var program = doc.createElement('week_program');
    program.setAttribute('state', ProgramState ? 'on' : 'off');
    for (var key in Program) {
        var day = doc.createElement('day');
        day.setAttribute('name', key);

        var daySwitches = [];
        var nightSwitches = [];

        var i, text, sw;

        for (i = 0; i < MaxSwitches; i++) {
            sw = doc.createElement('switch');
            sw.setAttribute('type', Type.Night);
            sw.setAttribute('state', 'off');
            text = doc.createTextNode('00:00');
            sw.appendChild(text);
            day.appendChild(sw);
        }

        for (i = 0; i < MaxSwitches; i++) {
            sw = doc.createElement('switch');
            sw.setAttribute('type', Type.Day);
            sw.setAttribute('state', 'off');
            text = doc.createTextNode('00:00');
            sw.appendChild(text);
            day.appendChild(sw);
        }

        program.appendChild(day);
    }
    doc.appendChild(program);
    uploadData('/weekProgram', (new XMLSerializer()).serializeToString(doc));
}


function uploadData(address, xml) {
    $.ajax({
        type: "put",
        url: ServerUrl + address,
        contentType: 'application/xml',
        data: xml,
        async: true
    });
}

function getDayIndex(day) {
	for (var i=0; i<DaysList.length; i++) {
		if (DaysList[i]===day){
			return i;
		}
	}
	return 5;
}

function parseTime(t) {
	var split=t.split(":");
    return parseFloat(split[0]) + parseFloat(split[1])/60; //this is a stupid function. Why risk using a float here when a int
	//is way more accurate. Also this assumes numbers below 12 are zero padded, which may not actually be true.
}

function unparseTime(t) {
	return Math.floor(t)+":"+Math.floor((t*60.0) % 60)
}

/* Adds a heating period for a specific day
*/
function addPeriod(day, start, end) {
    var program = getWeekProgram()[day];
    program.push([start, end]);
    sortMergeProgram(day);
    setWeekProgram();
}

/* Removes a heating period from a specific day.
   idx is the idex of the period with values from 0 to 4
*/
function removePeriod(day, idx) {
    var program = getWeekProgram()[day];
    var start = program[idx][0];
    var end = program[idx][1];
    program.splice(idx,1);
    setWeekProgram();
}

/* Checks whether the temperature is within the range [5.0,30.0]
*/
function inTemperatureBoundaries(temp) {
  temp = parseFloat(temp);
  return ( temp >= MinTemperature && temp <= MaxTemperature);
}
