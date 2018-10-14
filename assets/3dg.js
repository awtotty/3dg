// function for testing: Math.sin(x/50) * Math.cos(y/50) * 50 + 50

// create expression variable?
var fString = "Math.sin(x/50)*Math.cos(y/50)*50 + 50";
var typingTimer;                //timer identifier
var doneTypingInterval = 1500;  //time in ms, 5 second for example
// document.getElementById("fname").defaultValue = "Goofy";

//on keyup, start the countdown
function startTimer() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(graph, doneTypingInterval);
}

//on keydown, clear the countdown
function restartTimer() {
  clearTimeout(typingTimer);
}

function setFunction() {
  fString = document.getElementById("fname").value;
  // console.log(new Function("x","y", "return " + fString));
}

// function to be graphed
function f(x,y) {
  if (fString === "")
    return 0;
  try {
    var func = new Function("x","y", "return " + fString + ";");
    return func(x,y);
  } catch(err) {
    return 0;
  }
}

function graph() {
  // Create blank data set and populate a data table.
  var data = new vis.DataSet();
  var counter = 0;
  var steps = 25;  // number of datapoints will be steps*steps
  var axisMax = 314;
  var axisStep = axisMax / steps;
  for (var x = 0; x < axisMax; x+=axisStep) {
      for (var y = 0; y < axisMax; y+=axisStep) {
          var value = f(x,y);
          data.add({id:counter++,x:x,y:y,z:value,style:value});
      }
  }

  // specify options for graph
  var options = {
      width:  '600px',
      height: '600px',
      style: 'surface',
      showPerspective: true,
      showGrid: true,
      showShadow: false,
      keepAspectRatio: true,
      verticalRatio: 0.5
  };

  // Instantiate our graph object.
  var container = document.getElementById('visualization');
  try {
    var graph3d = new vis.Graph3d(container, data, options);
  } catch (e) {
    console.log("Unable to produce graph.");
    var data = new vis.DataSet();
    data.add({id:0,x:0,y:0,z:0,style:value});
    var graph3d = new vis.Graph3d(container, data, options);
  }
}
