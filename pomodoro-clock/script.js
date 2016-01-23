$(document).ready(function() {
  var stopwatchTitleElem = $("#stopwatch-title"),
      stopwatchTimeElem = $("#stopwatch-time"),
      sessionSelectorElem = $("#session-selector span"),
      breakSelectorElem = $("#break-selector span"),
      timerSound = new Audio("http://www.wavsource.com/snds_2015-08-30_2631914784717256/sfx/alarm_beep.wav"),
      breakTime = 5,
      sessionTime = 25,
      sessionStarted = false;

  stopwatchTitleElem.text("Session");
  stopwatchTimeElem.text(sessionTime);

  breakSelectorElem.text(breakTime);
  sessionSelectorElem.text(sessionTime);
//----------------------------------------------------

//-----------------event listeners--------------------
  $("#break-selector .plus").click(function() {
    breakTime++;
    breakSelectorElem.text(breakTime);
  });

  $("#break-selector .minus").click(function() {
    breakTime--;

    if(breakTime < 0) {
      breakTime = 0;
    }

    breakSelectorElem.text(breakTime);
  });

  $("#session-selector .plus").click(function() {
    sessionTime++;

    sessionSelectorElem.text(sessionTime);
    stopwatchTimeElem.text(sessionTime);
  });

  $("#session-selector .minus").click(function() {
    sessionTime--;

    if(sessionTime < 0) {
      sessionTime = 0;
    }

    sessionSelectorElem.text(sessionTime);
    stopwatchTimeElem.text(sessionTime);
  });

  $("#stopwatch-start").click(function() {
    timer(sessionTime * 60);
  });
  //---------------------------------------------

  //--------------functions----------------------
  function timer(length) {
    var duration = length;

    setInterval(function() {
      var minutes = parseInt(duration / 60, 10);
      var seconds = parseInt(duration % 60, 10);

      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      stopwatchTimeElem.text(minutes + ":" + seconds);

      duration--;

      if (duration < 0) {
        timerSound.play();
        stopwatchTitleElem.text("Break");
        duration = breakTime * 60;
      }
    }, 1000);

  }
});
