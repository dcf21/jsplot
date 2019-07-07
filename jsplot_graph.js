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
    this.lineType = null;
    this.pointType = null;
    this.lineWidth = 1;
    this.pointLineWidth = 1;
    this.pointSize = 1;
}

JSPlot_Style.prototype.clone = function () {
    var other = new JSPlot_Style();
    other.color = new JSPlot_Color(this.color.red, this.color.green, this.color.blue, this.color.alpha);
    other.fillColor = new JSPlot_Color(this.fillColor.red, this.fillColor.green, this.fillColor.blue, this.fillColor.alpha);
    other.plotStyle = this.plotStyle;
    other.lineType = this.lineType;
    other.pointType = this.pointType;
    other.lineWidth = this.lineWidth;
    other.pointLineWidth = this.pointLineWidth;
    other.pointSize = this.pointSize;
};

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

    this.cleanWorkspace();
}

function JSPlot_DataSet() {
    this.title = null; // Title for this data set to put into the graph legend
    this.style = new JSPlot_Style(); // Styling for this data set
    this.axes = {1: 'x1', 2: 'y1', 3: 'z1'}; // Which axes do we plot this data set against?
    this.data = [];
    this.cleanWorkspace();
}

JSPlot_DataSet.prototype.cleanWorkspace = function () {
    this.workspace = [];
    this.workspace.styleFinal = null;
    this.workspace.requiredColumns = null;
};


function JSPlot_Graph() {
    this.page = null;
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
    this.dataSets = [];  // This should be a list of JSPlot_DataSet instances

    // Annotations
    this.arrows = [];
    this.labels = [];

    this.cleanWorkspace();
}

JSPlot_Graph.prototype.cleanWorkspace = function () {
    // Temporary data fields which are used when rendering a plot
    this.workspace = [];
    this.workspace.defaultColorCounter = 0;
    this.workspace.defaultLineTypeCounter = 0;
    this.workspace.defaultPointTypeCounter = 0;
};

// Line types
JSPlot_Graph.prototype.setLineType = function (color, lineType, lineWidth, offset) {
    var dash_pattern;

    lineType = (lineType - 1) % 9;
    while (lineType < 0) lineType += 9;

    switch (lineType) {
        case 0:
            // solid
            dash_pattern = [offset];
            break;
        case 1:
            // dashed
            dash_pattern = [2 * lineWidth, offset];
            break;
        case 2:
            // dotted
            dash_pattern = [2 * lineWidth, offset];
            break;
        case 3:
            // dash-dotted
            dash_pattern = [2 * lineWidth, 2 * lineWidth, 2 * lineWidth, offset];
            break;
        case 4:
            // long dash
            dash_pattern = [7 * lineWidth, 2 * lineWidth, offset];
            break;
        case 5:
            // long dash - dot
            dash_pattern = [7 * lineWidth, 2 * lineWidth, 2 * lineWidth, offset];
            break;
        case 6:
            // long dash - dot dot
            dash_pattern = [7 * lineWidth, 2 * lineWidth, 2 * lineWidth, 2 * lineWidth, offset];
            break;
        case 7:
            // long dash - dot dot dot
            dash_pattern = [7 * lineWidth, 2 * lineWidth, 2 * lineWidth, 2 * lineWidth, 2 * lineWidth, offset];
            break;
        case 8:
            // long dash - dash
            dash_pattern = [7 * lineWidth, 2 * lineWidth, 2 * lineWidth, 2 * lineWidth, offset];
            break;
    }

    this.page.canvas._strokeStyle(color, lineWidth);
};

JSPlot_Graph.prototype.insertDefaultStyles = function (style) {
    if (style.color === null) {
        style.color = this.page.defaultColors[this.workspace.defaultColorCounter];
        this.workspace.defaultColorCounter++;
        if (this.workspace.defaultColorCounter >= this.page.defaultColors.length - 1) {
            this.workspace.defaultColorCounter = 0;
        }
    }

    if (style.lineType === null) {
        style.lineType = this.workspace.defaultLineTypeCounter;
        this.workspace.defaultLineTypeCounter++;
    }

    if (style.pointType === null) {
        style.pointType = this.workspace.defaultPointTypeCounter;
        this.workspace.defaultPointTypeCounter++;
        if (this.workspace.defaultPointTypeCounter >= this.page.pointTypes.length - 1) {
            this.workspace.defaultPointTypeCounter = 0;
        }
    }
};

JSPlot_Axis.prototype.cleanWorkspace = function () {
    // Temporary data fields which are used when rendering an axis
    this.workspace = [];
    this.workspace.crossedAtZero = null;
    this.workspace.minUsed = null;
    this.workspace.maxUsed = null;
    this.workspace.minFinal = null;
    this.workspace.maxFinal = null;
    this.workspace.minHard = this.min;
    this.workspace.maxHard = this.max;
    this.workspace.logFinal = this.log;
    this.workspace.rangeFinalised = null;
    this.workspace.activeFinal = null;
    this.workspace.physicalLengthMajor = null;
    this.workspace.physicalLengthMinor = null;
    this.workspace.axisName = null;
    this.workspace.canvasId = null;
    this.workspace.mode0BackPropagated = false;
    this.workspace.axisLabelFinal = null;
    this.workspace.tickListFinal = null;
};

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
    var x_min = null, x_max = null;

    if (this.workspace.minHard !== null) {
        x_min = this.workspace.minHard;
    }
    if (this.workspace.maxHard !== null) {
        x_max = this.workspace.maxHard;
    }

    if (this.min === null) {
        x_min = null;
    }
    if (this.max === null) {
        x_max = null;
    }

    if (this.rangeReversed) {
        var tmp = x_min;
        x_min = x_max;
        x_max = tmp;
    }

    if ((x_min !== null) && (x_max !== null)) {
        return (((x_in >= x_min) && (x_in <= x_max)) || ((x_in <= x_min) && (x_in >= x_max)));
    }
    if (x_min !== null) return (x_in > x_min);
    if (x_max !== null) return (x_in < x_max);

    // Axis range is not fixed
    return true;
};

JSPlot_Graph.prototype.project3d = function (xap, yap, zap) {
    var width = this.width;
    var height = this.width * this.aspect;
    var zdepth = this.width * this.aspectZ;

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

JSPlot_Graph.prototype.projectPoint = function (xin, yin, zin, axis_x, axis_y, axis_z, allowOffBounds) {
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
        output = this.project3d(xap, yap, zap);
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

JSPlot_Graph.prototype.calculateBoundingBox = function (page) {
    var i, j, axisName;

    // Set pointer to the graphics canvas that we're rendering onto
    this.page = page;

    // Start constructing a bounding box
    var boundingBox = new JSPlot_BoundingBox();

    // Work out lengths of x-, y- and z-axes
    var size = [
        this.width,
        this.width * this.aspect,
        this.width * this.aspectZ
    ];

    // Work out projected lengths of these axes on screen
    var screenSize, screenBearing;
    if (!this.threeDimensional) {
        screenSize = size;
        screenBearing = [Math.PI / 2, 0, 0];
    } else {
        for (j = 0; j < 3; j++) {
            var ptA = this.project3d((j === 0) ? 0 : 0.5, (j === 1) ? 0 : 0.5, (j === 2) ? 0 : 0.5);
            var ptB = this.project3d((j === 0) ? 1 : 0.5, (j === 1) ? 1 : 0.5, (j === 2) ? 1 : 0.5);
            screenSize   [j] = Math.hypot(ptB['xpos'] - ptA['xpos'], ptB['ypos'] - ptA['ypos']);
            screenBearing[j] = Math.atan2(ptB['xpos'] - ptA['xpos'], ptB['ypos'] - ptA['ypos']);
            if (!isFinite(screenSize   [j])) screenSize   [j] = 0.0;
            if (!isFinite(screenBearing[j])) screenBearing[j] = 0.0;

            boundingBox.includePoint(ptA['xpos'] + this.origin[0], ptA['ypos'] + this.origin[1]);
            boundingBox.includePoint(ptB['xpos'] + this.origin[0], ptB['ypos'] + this.origin[1]);
        }
    }

    // First clear all range information from all axes.
    // Also, transfer range information from [Min,Max,unit] to [HardMin,HardMax,HardUnit].
    for (j = 0; j < 3; j++) {
        var physicalLengthMajor = screenSize[j] / (0.015 + 0.01 * Math.abs(Math.sin(screenBearing[j])));
        var physicalLengthMinor = screenSize[j] / 0.004;

        for (i = 0; i < 2; i++) {
            axisName = ['x', 'y', 'z'][j] + (i + 1);
            this.axes[axisName].cleanWorkspace();
            this.axes[axisName].workspace.physicalLengthMajor = physicalLengthMajor;
            this.axes[axisName].workspace.physicalLengthMinor = physicalLengthMinor;
        }
    }
};

JSPlot_Graph.prototype.calculateDataRanges = function () {
    var i, j, axisName;

    // Propagate range information to linked axes
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 2; i++) {
            axisName = ['x', 'y', 'z'][j] + (i + 1);
            self.linkedAxisForwardPropagate(this.axes[axisName], 0);
        }
    }

    // Loop over all the data sets we are going to plot
    $.each(this.dataSets, function (index, item) {
        item.cleanWorkspace();

        // Create final set of styling information for this dataset
        item.workspace.styleFinal = item.style.clone();
        self.insertDefaultStyles(item.workspace.styleFinal);

        // Work out how many columns of data this data set expects
        item.workspace.requiredColumns = JSPlot_PlotStyles_NDataColumns(self, item.workspace.styleFinal.plotStyle);

        // Mark up the axes used by this data set as being active
        $.each(item.axes, function (index, axisName) {
            self.axes[axisName].workspace.activeFinal = true;
        });

        // Update axes to reflect usage
        JSPlot_PlotStyles_UpdateUsage(self, item, item.workspace.styleFinal.plotStyle, self.axes[item.axes[1]], x, self.axes[item.axes[2]], self.axes[item.axes[3]]);
        self.linkedAxisBackPropagate(self.axes[item.axes[1]]);
        self.linkedAxisBackPropagate(self.axes[item.axes[2]]);
        self.linkedAxisBackPropagate(self.axes[item.axes[3]]);
    });

    // Return bounding box
    return boundingBox;
};

JSPlot_Graph.prototype.render = function () {
    var self = this;
    var i;

    // Work out lengths of x-, y- and z-axes
    var size = [
        this.width,
        this.width * this.aspect,
        this.width * this.aspectZ
    ];

    // Turn on clipping if 'set clip' is set
    if (this.clip) {
        if (this.threeDimensional) {
            // 3D clip region is the edge of a cuboidal box
            var vertices = [];
            for (i = 0; i < 8; i++) {
                var xap = ((i & 1) !== 0);
                var yap = ((i & 2) !== 0);
                var zap = ((i & 4) !== 0);
                vertices.append(this.project3d(xap, yap, zap));
            }

            // Sort vertices into order of distance from centre of the canvas
            vertices.sort(function (a, b) {
                return Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]);
            });

            // Reject the two points nearest the centre
            vertices.shift();
            vertices.shift();

            // Sort the remaining points into azimuth order
            vertices.sort(function (a, b) {
                return Math.atan2(a[0], a[1]) - Math.atan2(b[0], b[1]);
            });

            // Create a path around the vertices
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(vertices[0][0] + self.origin[0], vertices[0][1] + self.origin[1]);

            for (i = 1; i < vertices.length; i++) {
                self.page.canvas._lineTo(vertices[i][0] + self.origin[0], vertices[i][1] + self.origin[1]);

            }
            self.page.canvas._setClip();
        } else {
            // 2D clip region is a simple rectangular box
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(self.origin[0], self.origin[1]);
            self.page.canvas._lineTo(self.origin[0] + size[0], self.origin[1]);
            self.page.canvas._lineTo(self.origin[0] + size[0], self.origin[1] + size[1]);
            self.page.canvas._lineTo(self.origin[0], self.origin[1] + size[1]);
            self.page.canvas._setClip();
        }
    }

    // Activate three-dimensional buffer if graph is 3D
    if (self.threeDimensional) self.page.threeDimensionalBuffer.activate();

    // Render axes (back)
    JSPlot_AxesPaint(self, 0);

    // Render each dataset in turn
    $.each(this.dataSets, function (index, item) {

        JSPlot_PlotDataSet(self, item);
    });

    // Render text labels and arrows
    JSPlot_LabelsArrows(self);

    // Deactivate three-dimensional buffer
    self.page.threeDimensionalBuffer.deactivate();

    // Turn off clipping if 'set clip' is set
    if (self.clip) {
        self.page.canvas._unsetClip();

    }

    // Render axes (front)
    JSPlot_AxesPaint(self, 1);

    // Render legend
    JSPlot_GraphLegendRender(self);

    // Put the title on the top of the graph
    if ((self.title !== null) && (self.title !== "") && self.textColor.isVisible()) {
        self.page.canvas._fillStyle(self.textColor.toHTML());
        self.page.canvas._text(self.origin[0] + size[0] / 2, self.origin[1] + size[1] / 2, self.plotTopMargin, 0, 1, 1, self.title, 0, 0);
    }
};
