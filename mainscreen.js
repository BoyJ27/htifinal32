function updateMain() {

  var time = get('time', 'time');
  var day = get('day', 'day');
  var divtime = document.getElementById('currenttime');
  var divday = document.getElementById('currentday');
  divtime.id = 'divtime';
  divday.id = 'divday';
  divday.append(day);
  divtime.append(time);

}
