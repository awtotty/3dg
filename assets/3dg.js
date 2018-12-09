/*
 * Code for getting and using user form data to create and display a 3d graph
 * of a function on the page.
 */

// Default function string for initial display
var fString = "Math.sin(x/50)*Math.cos(y/50)*50 + 50"; // fString is the string version of the input function
var useDefaultFunction = true;	// boolen for using default fString

// Vars for axis params and density of mesh
var axisMin, axisMax, steps;
var stepCap = 150; // maximum number of steps allowed to prevent performance issues

var typingTimer;                // timer identifier
var doneTypingInterval = 1500;  // time in ms, used to time pause between typing and graphing

// Used on keyup, start the countdown
// after doneTypingInterval, draw graph with given function
function startTimer() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(graph, doneTypingInterval);
}

// TODO unneeded? remove
// clear the countdown
//function restartTimer() {
//  clearTimeout(typingTimer);
//}

function setFunction() {
  if (!useDefaultFunction)
    fString = document.getElementById("fname").value;
  // console.log(new Function("x","y", "return " + fString));

  // if default funciton has been used once, don't use it again
  useDefaultFunction = false;
}

function setParams() {
  // if any of these is not defined, use default values
  axisMin = document.getElementById("axisMin").value
  if (axisMin === "" || isNaN(axisMin))
    axisMin = 0;

  axisMax = document.getElementById("axisMax").value
  if (axisMax === "" || isNaN(axisMax))
    axisMax = 314;

  // number of data points will be steps*steps
  steps = document.getElementById("steps").value
  if (steps === "" || isNaN(steps))
    steps = 25;
  if (steps > stepCap) // TODO tell user about cap and actual steps val
    steps = stepCap
}

// TODO optimize by creating the function once and returning it
// Parses fString into a function and returns the value of the function at (x,y)
function f(x,y) {
  if (fString === "")
    return 0;
  try {
    var func = new Function("x","y", "return " + fString + ";");
    return func(x,y);
  } catch(err) { // TODO move catch to graph and break loop so default graph displays?
    return 0;	// TODO but then a single undefined point on the graph will kill the graph.
  }
}

// Creates the graph of the function. Called after the timer reaches doneTypingInterval
function graph() {
  // update function string
  setFunction();

  // get params from user
  setParams();

  var counter = 0; // creates ids for the points
  var axisStep = (axisMax-axisMin) / steps; // TODO: correct value?

  // create blank data set to populate with point data
  var data = new vis.DataSet();

  // build data points
  for (var x = axisMin; x < axisMax; x+=axisStep) {
      for (var y = axisMin; y < axisMax; y+=axisStep) {
          console.log("(" + x + ", " + y + ")"); // TODO: major crashing for axisMin not 0. 
          var z = f(x,y); //
          data.add({id:counter++, x:x, y:y, z:z, style:z});
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

  // Instantiate the graph object.
  var container = document.getElementById('visualization'); // where to create the graph on the page
  try {
    var graph3d = new vis.Graph3d(container, data, options);
  } catch (e) { // If the graph cannot be made, create a blank graph with (0,0,0) as a placeholder
    console.log("Unable to produce graph.");
    data = new vis.DataSet();
    data.add({id:0,x:0,y:0,z:0,style:value});
    var graph3d = new vis.Graph3d(container, data, options);
  }
}
