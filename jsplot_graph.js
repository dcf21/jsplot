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
JSPlot_Axis.prototype.invGetPosition = function (x_in) {
    if (this.workspace.logFinal) {
        // Either linear...
        return this.workspace.minFinal + x_in * (this.workspace.maxFinal - this.workspace.minFinal);
    } else {
        // ... or logarithmic
        return this.workspace.minFinal * pow(this.workspace.maxFinal / this.workspace.minFinal, x_in);
    }
};

// Does a value fall within the span of this axis?
JSPlot_Axis.prototype.inRange = function (x_in) {
    var x_min_set = false, x_max_set = false;
    var x_min = 0, x_max = 0;

    if (this.hardMin !== null) {
        x_min_set = true;
        x_min = this.hardMin;
    }
    if (this.hardMax !== null) {
        x_max_set = true;
        x_max = this.hardMax;
    }
    if (this.min === null) {
        x_min_set = false;
    }
    if (this.max === null) {
        x_max_set = false;
    }

    if (this.rangeReversed) {
        var tmp = x_min_set;
        x_min_set = x_max_set;
        x_max_set = tmp;
        tmp = x_min;
        x_min = x_max;
        x_max = tmp;
    }

    if (x_min_set && x_max_set) return (((x_in >= x_min) && (x_in <= x_max)) || ((x_in <= x_min) && (x_in >= x_max)));
    if (x_min_set) return (x_in > x_min);
    if (x_max_set) return (x_in < x_max);
    return true; // Axis range is not fixed
};

JSPlot_Graph.prototype.project_3d = function (xap, yap, zap, zdepth) {
    var width = this.width;
    var height = this.width * this.aspect;

    var x = width * (xap - 0.5);
    var y = height * (yap - 0.5);
    var z = zdepth * (zap - 0.5);

    var x2 = x * Math.cos(this.viewAngleXY * Math.PI / 180) + y * Math.sin(this.viewAngleXY * Math.PI / 180);
    var y2 = -x * Math.sin(this.viewAngleXY * Math.PI / 180) + y * Math.cos(this.viewAngleXY * Math.PI / 180);
    var z2 = z;

    var x3 = x2;
    var y3 = y2 * Math.cos(this.viewAngleYZ * Math.PI / 180) - z2 * Math.sin(this.viewAngleYZ * Math.PI / 180);
    var z3 = y2 * Math.sin(this.viewAngleYZ * Math.PI / 180) + z2 * Math.cos(this.viewAngleYZ * Math.PI / 180);

    return {
        "xpos": this.origin[0] + x3,
        "ypos": this.origin[1] + z3,
        "depth": y3
    };
};

JSPlot_Graph.prototype.project_point = function (xin, yin, zin, axis_x, axis_y, axis_z, allowOffBounds) {
    var width = this.width;
    var height = this.width * this.aspect;
    var output = [];

    // Convert (xin,yin,zin) to axis positions on the range of 0-1
    var xap = axis_x.getPosition(xin, 1);
    var yap = axis_y.getPosition(yin, 1);
    var zap = 0.5;

    if (this.threeDimensional) zap = axis_z.getPosition(zin, 1);

    if ((!isFinite(xap)) || (!isFinite(yap)) || (!isFinite(zap))) {
        return {'xpos': NaN, 'ypos': NaN};
    }
    // Crop axis positions to range 0-1
    if ((!allowOffBounds) && ((xap < 0) || (xap > 1) || (yap < 0) || (yap > 1) || (zap < 0) || (zap > 1))) {
        return {'xpos': NaN, 'ypos': NaN};
    }

    // 3D plots
    if (this.threeDimensional) {
        output = this.project_3d(xap, yap, zap, zdepth);
        var theta_x = Math.atan2(Math.cos(this.viewAngleXY * Math.PI / 180),
            -Math.sin(this.viewAngleXY * Math.PI / 180) * Math.sin(this.viewAngleYZ * Math.PI / 180));
        var theta_y = Math.atan2(Math.sin(this.viewAngleXY * Math.PI / 180),
            Math.cos(this.viewAngleXY * Math.PI / 180) * Math.sin(this.viewAngleYZ * Math.PI / 180));
        var theta_z = Math.atan2(0, Math.cos(this.viewAngleYZ * Math.PI / 180));

        if (!isFinite(theta_x)) theta_x = 0.0;
        if (!isFinite(theta_y)) theta_y = 0.0;
        if (!isFinite(theta_z)) theta_z = 0.0;

        output['theta_x'] = theta_x;
        output['theta_y'] = theta_y;
        output['theta_z'] = theta_z;
    } else // 2D plots
    {
        output['xpos'] = this.origin[0] + width * xap;
        output['ypos'] = this.origin[1] + height * yap;
        output['depth'] = 0.0;

        output['theta_x'] = Math.PI / 2;
        output['theta_y'] = 0.0;
        output['theta_z'] = 0.0;
    }

    return output;
};
