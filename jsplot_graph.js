// jsplot_graph.js

function JSPlot_Color(red, green, blue, alpha) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
}

JSPlot_Color.prototype.isVisible = function () {
    return this.alpha > 0;
};

JSPlot_Color.prototype.toHTML = function () {
    var component = function (x) {
        var int_val = Math.floor(255 * x);
        if (int_val < 0) int_val = 0;
        if (int_val > 255) int_val = 255;
        return int_val;
    };

    return "rgba(" + component(this.red) + "," + component(this.green) + "," + component(this.blue) + "," +
        (component(this.alpha) / 255) + ")";
};

function JSPlot_Style() {
    this.color = null; // auto
    this.fillColor = new JSPlot_Color(0, 0, 0, 0); // transparent
    this.plotStyle = 'lines';
    this.lineType = 1;
    this.pointType = 1;
    this.lineWidth = 1;
    this.pointLineWidth = 1;
    this.pointSize = 1;
}

function JSPlot_AxisTics() {
    this.logBase = null;
    this.ticDir = null;
    this.tickMin = null;
    this.tickMax = null;
    this.tickStep = null;
    this.tickList = [];
}

function JSPlot_Axis(enabled) {
    this.atZero = false;
    this.enabled = enabled;
    this.visible = true;
    this.linkTo = null; // Set to, e.g. ['myPlot','x1']
    this.rangeReversed = false;
    this.arrowType = 'none';  // options are 'single', 'double', 'none'
    this.log = false;
    this.min = null;
    this.max = null;
    this.mirror = false;
    this.tickLabelRotation = 0;
    this.labelRotate = 0;
    this.tickLabelRotate = 0;
    this.label = null;
    this.ticsM = new JSPlot_AxisTics();
    this.tics = new JSPlot_AxisTics();

    // Temporary data fields which are used when rendering an axis
    this.workspace = [];
    this.workspace.crossedAtZero = null;
    this.workspace.minUsed = null;
    this.workspace.maxUsed = null;
    this.workspace.minFinal = null;
    this.workspace.maxFinal = null;
    this.workspace.minHard = null;
    this.workspace.maxHard = null;
    this.workspace.logFinal = null;
    this.workspace.rangeFinalised = null;
    this.workspace.activeFinal = null;
    this.workspace.physicalLengthMajor = null;
    this.workspace.physicalLengthMinor = null;
    this.workspace.axisName = null;
    this.workspace.canvasId = null;
    this.workspace.axisLabelFinal = null;
    this.workspace.tickListFinal = null;
}

function JSPlot_DataSet() {
    this.title = null; // Title for this data set to put into the graph legend
    this.style = new JSPlot_Style(); // Styling for this data set
    this.axes = {1: 'x1', 2: 'y1', 3: 'z1'}; // Which axes do we plot this data set against?
    this.data = [];
}

function JSPlot_Graph() {
    this.aspect = 2.0 / (1.0 + Math.sqrt(5));
    this.aspectZ = 2.0 / (1.0 + Math.sqrt(5));
    this.axesColor = new JSPlot_Color(0, 0, 0, 1);
    this.clip = true;
    this.gridMajorColor = new JSPlot_Color(0.6, 0.6, 0.6, 1);
    this.gridMinorColor = new JSPlot_Color(0.85, 0.85, 0.85, 1);
    this.key = true;
    this.keyColumns = null;
    this.keyPosition = "tr";
    this.textColor = new JSPlot_Color(0, 0, 0, 1);

    this.bar = 1;
    this.fontSize = 1;
    this.gridAxes = ['x1', 'y1', 'z1']; // which axes should produce grid lines?

    this.boxFrom = null; // auto
    this.boxWidth = null; // auto

    this.keyOffset = [0, 0];
    this.origin = [0, 0];
    this.titleOffset = [0, 0];
    this.width = 400;
    this.viewAngleXY = 60;
    this.viewAngleYZ = 30;
    this.title = null;
    this.threeDimensional = false;

    // Axes
    this.axes = {
        'x1': new JSPlot_Axis(true),
        'x2': new JSPlot_Axis(false),
        'y1': new JSPlot_Axis(true),
        'y2': new JSPlot_Axis(false)
    };

    // Data sets
    this.data_sets = [];  // This should be a list of JSPlot_DataSet instances

    // Annotations
    this.arrows = [];
    this.labels = [];
}

JSPlot_Axis.prototype.getPosition = function (x_in, allowOffBounds) {
    if (!allowOffBounds) {
        if (this.workspace.maxFinal > this.workspace.minFinal) {
            if ((x_in < this.workspace.minFinal) || (x_in > this.workspace.maxFinal)) return NaN;
        } else {
            if ((x_in > this.workspace.minFinal) || (x_in < this.workspace.maxFinal)) return NaN;
        }
    }
    if ((this.workspace.logFinal) && (x_in <= 0)) return NaN;
    if (this.workspace.logFinal) {
        // Either linear...
        return (x_in - this.workspace.minFinal) / (this.workspace.maxFinal - this.workspace.minFinal);
    } else {
        // ... or logarithmic
    }
    return (Math.log(x_in) - Math.log(this.workspace.minFinal)) / (Math.log(this.workspace.maxFinal) - Math.log(this.workspace.minFinal));
};

// What is the value of this axis at point xin, in the range 0 (left) to 1 (right)?
JSPlot_Axis.prototype.invGetPosition = function(x_in)
{
    if (this.workspace.logFinal) {
        // Either linear...
        return this.workspace.minFinal + x_in * (this.workspace.maxFinal - this.workspace.minFinal);
    } else {
        // ... or logarithmic
        return this.workspace.minFinal * pow(this.workspace.maxFinal / this.workspace.minFinal, x_in);
    }
};
