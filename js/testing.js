var gn = new GyroNorm();
var counter = 0;
var x = 0;
var y = 0;
var debug_boolean = false;
var elem = document.documentElement;
var started_boolean = false;

//Stopp recording Situps
function stop() {
  gn.stop();
  started_boolean = false;
  console.log("gn stopped");
  counter = 0;
  $("#counter_value").text(counter); //reset counter to zero
  closeFullscreen();
}

//Toogle to show Gyro values by altering debug_boolean value
function debug() {
  if (debug_boolean == false) {
    debug_boolean = true;
  } else {
    debug_boolean = false;
    $("#debug").text("");
  }
  console.log(debug_boolean);
}


// Starting to record situps
function start() {

  openFullscreen();
  $("#counter").text("Counter");//show "Counter" text
  $("#counter_value").text(0); //show zero on screen
  $("#intro").text(""); //remove intro

  var situpboolean = false;
  var situpbooleanLandscape = false;

  if (started_boolean == false) {
    started_boolean == true;
      //start reading gyrosscope data
  gn.init().then(function() {
    gn.start(function(data) {
      var tempValue = $("#counter_value").text();

      //show debug values if debug_boolean is true
      if (debug_boolean == true) {
        $("#debug").text("beta: " + x + " gamma:" + y);
      }


      x = data.do.beta; //get values
      y = data.do.gamma;
      y = Math.abs(y); //make gamma always positive

      if (situpboolean == false && situpbooleanLandscape == false) { //if no situp has been recorded
        if (x >= 60) { //wait until beta is higher than 60 degrees
          counter++;
          situpboolean = true;
          if (window.navigator && window.navigator.vibrate) {
            navigator.vibrate(200);//vibrate
            PlaySound("sound1");
          }
        } else if (y >= 50) { //or wait until gamma is higher than 50 degrees, in the case it is in landscape modus
          counter++;
          situpbooleanLandscape = true;
          if (window.navigator && window.navigator.vibrate) {
            navigator.vibrate(200);//vibrate
            PlaySound("sound1");
          }
        }
      //go back to original position i.e. lie down, to trigger new situps
      } else if (situpboolean == true && situpbooleanLandscape == false) {
        if (x <= 10) {
          situpboolean = false;
        }
      } else if (situpbooleanLandscape == true && situpboolean == false) {
        if (y <= 10) {
          situpbooleanLandscape = false;
        }
      }

      //Set new counter value and animation(fade-in)
      if (tempValue != counter) {
        $("#counter_value").addClass("fade-in");
        $("#counter_value").text(counter);
        setTimeout(function() {
          $("#counter_value").toggleClass("fade-in");
        }, 1000);
      }


      // Process:
      // data.do.alpha  ( deviceorientation event alpha value )
      // data.do.beta   ( deviceorientation event beta value )
      // data.do.gamma  ( deviceorientation event gamma value )
      // data.do.absolute ( deviceorientation event absolute value )

      // data.dm.x    ( devicemotion event acceleration x value )
      // data.dm.y    ( devicemotion event acceleration y value )
      // data.dm.z    ( devicemotion event acceleration z value )

      // data.dm.gx   ( devicemotion event accelerationIncludingGravity x value )
      // data.dm.gy   ( devicemotion event accelerationIncludingGravity y value )
      // data.dm.gz   ( devicemotion event accelerationIncludingGravity z value )

      // data.dm.alpha  ( devicemotion event rotationRate alpha value )
      // data.dm.beta   ( devicemotion event rotationRate beta value )
      // data.dm.gamma  ( devicemotion event rotationRate gamma value )
    });
  }).catch(function(e) {
    console.log("Not supported");
    // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
  });
  }



}

function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
    console
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

function PlaySound(soundObj) {
  var sound = document.getElementById(soundObj);
  sound.Play();
}