//jshint esversion:6

exports.getDate = function() {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US", options);
};

exports.getDay = function() {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US");
};

exports.random = function() {
  return Math.floor(Math.random()*100 + 1);
};

exports.currentTime = function() {
  let d = new Date();
  let n = d.getTime();
  var minutes = n/(60*1000);
	var hours = minutes / 60 + 8;
	var days = hours / 24;
	var years = days / 365;
  clockData = {
    clockMinutes: Math.floor(minutes%60),
    clockHours: Math.floor(hours%24),
    clockDays: days%365.25,
    clockDate : Math.floor((days/365.25)%30),
    clockMonth: Math.ceil(days%365.25/30)
  };
  return clockData;
};
