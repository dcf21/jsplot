// jsplot_graph.js

/**
 * JSPlot_DataSet - A class representing a single data set to be plotted on a graph.
 * @param title {string} - The text to display in the graph's legend next to this data set
 * @param styling {Object} - Settings to associate with the JSPlot_PlotStyle to associate with this data set
 * @param data {Array<Array<number>>} The data to be plotted, as a list of rows, each represented as a list of columns
 * @constructor
 */
function JSPlot_DataSet(title, styling, data) {
    this.title = title; // Title for this data set to put into the graph legend
    this.style = new JSPlot_Style(styling); // Styling for this data set
    this.axes = {1: 'x1', 2: 'y1', 3: 'z1'}; // Which axes do we plot this data set against?
    this.data = data;
    this.cleanWorkspace();
}

/**
 * cleanWorkspace - Create a clean workspace to be used for plotting this data set
 */
JSPlot_DataSet.prototype.cleanWorkspace = function () {
    this.workspace = {};
    this.workspace.styleFinal = null;
    this.workspace.requiredColumns = null;
};

/**
 * JSPlot_Graph - A class representing a graph, to be rendered onto a <JSPlot_Canvas>
 * @param dataSets {Array<JSPlot_DataSet>} - A list of <JSPlot_DataSet> objects to plot on this graph
 * @param settings {Object} - An object containing settings
 * @constructor
 */
function JSPlot_Graph(dataSets, settings) {
    this.page = null;
    this.itemType = "graph";
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
        'x1': new JSPlot_Axis(true, {}),
        'x2': new JSPlot_Axis(false, {}),
        'y1': new JSPlot_Axis(true, {}),
        'y2': new JSPlot_Axis(false, {})
    };

    // Data sets
    this.dataSets = dataSets;  // This should be a list of JSPlot_DataSet instances

    // Annotations
    this.arrows = [];
    this.labels = [];

    this.configure(settings);
    this.cleanWorkspace();
}

/**
 * configure - Configure settings for a graph
 * @param settings {Object} - An object containing settings
 */
JSPlot_Graph.prototype.configure = function(settings) {
    $.each(settings, function (key, value) {
       switch (key) {
           case "aspect": this.aspect = value; break;
           case "aspectZ": this.aspectZ = value; break;
           case "axesColor": this.axesColor = value; break;
           case "clip": this.clip = value; break;
           case "gridMajorColor": this.gridMajorColor = value; break;
           case "gridMinorColor": this.gridMinorColor = value; break;
           case "key": this.key = value; break;
           case "keyColumns": this.keyColumns = value; break;
           case "keyPosition": this.keyPosition = value; break;
           case "textColor": this.textColor = value; break;
           case "bar": this.bar = value; break;
           case "fontSize": this.fontSize = value; break;
           case "gridAxes": this.gridAxes = value; break;
           case "keyOffset": this.keyOffset = value; break;
           case "origin": this.origin = value; break;
           case "titleOffset": this.titleOffset = value; break;
           case "width": this.width = value; break;
           case "viewAngleXY": this.viewAngleXY = value; break;
           case "viewAngleYZ": this.viewAngleYZ = value; break;
           case "title": this.title = value; break;
           case "threeDimensional": this.threeDimensional = value; break;
           default: throw "Unrecognised graph setting " + key;
       }
    });
};

/**
 * cleanWorkspace - Create a clean workspace to be used for plotting this graph
 */
JSPlot_Graph.prototype.cleanWorkspace = function () {
    // Temporary data fields which are used when rendering a plot
    this.workspace = [];
    this.workspace.defaultColorCounter = 0;
    this.workspace.defaultLineTypeCounter = 0;
    this.workspace.defaultPointTypeCounter = 0;
};

/**
 * insertDefaultStyles - Take the styling associated with a particular data set, and where parameters are unset,
 * replace them with defaults. For example, set lines to have incremental line styles, colored items to have incremental
 * colors, points to have incremental point styles.
 * @param style - The styling associated with the data set we are operating on
 */
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

/**
 * project3d - Take a point that is a certain fraction of the way along the x, y, and z axes, and convert it into
 * canvas coordinates, together with a depth into the page.
 * @param xap {number} - The fraction of the way along the x axis (in range 0 to 1)
 * @param yap {number} - The fraction of the way along the y axis (in range 0 to 1)
 * @param zap {number} - The fraction of the way along the z axis (in range 0 to 1)
 * @returns {{ypos: number, xpos: number, depth: number}}
 */
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

/**
 * projectPoint - Take a point defined by three numbers along the length of three axes, and turn this into canvas
 * coordinates. We also return the angle that each of the three axes make to the vertical.
 * @param xin {number} - The value where the point lies along the x axis
 * @param yin {number} - The value where the point lies along the y axis
 * @param zin {number} - The value where the point lies along the z axis
 * @param axis_x {JSPlot_Axis} - The x axis to reference against
 * @param axis_y {JSPlot_Axis} - The y axis to reference against
 * @param axis_z {JSPlot_Axis} - The z axis to reference against
 * @param allowOffBounds {boolean} - Flag indicating whether points outside the point area should be calculated
 * @returns {Object}
 */
JSPlot_Graph.prototype.projectPoint = function (xin, yin, zin, axis_x, axis_y, axis_z, allowOffBounds) {
    var width = this.width;
    var height = this.width * this.aspect;
    var output = {};

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

/**
 * calculateBoundingBox - Step 1 of rendering process: return the bounding box of this graph
 * @param page {JSPlot_Canvas} - The canvas that this graph will be rendered onto
 * @returns {JSPlot_BoundingBox}
 */
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
    // Also, transfer range information from [Min,Max] to [HardMin,HardMax].
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

    // Return bounding box
    return boundingBox;
};

/**
 * calculateDataRanges - Step 2 of the rendering process: calculate the range of the data plotted against each axis.
 * Then finalise the ranges of all the axes and decide on their ticking schemes.
 */
JSPlot_Graph.prototype.calculateDataRanges = function () {
    var i, j, axisName;

    // Propagate range information to linked axes
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 2; i++) {
            axisName = ['x', 'y', 'z'][j] + (i + 1);
            this.axes[axisName].linkedAxisForwardPropagate(self.page, 0);
        }
    }

    // Loop over all the data sets we are going to plot
    $.each(this.dataSets, function (index, item) {
        item.cleanWorkspace();

        // Create final set of styling information for this dataset
        item.workspace.styleFinal = item.style.clone();
        self.insertDefaultStyles(item.workspace.styleFinal);

        // Work out how many columns of data this data set expects
        item.workspace.requiredColumns = JSPlot_PlotStyles_NDataColumns(self.page, self,
            item.workspace.styleFinal.plotStyle);

        // Mark up the axes used by this data set as being active
        $.each(item.axes, function (index, axisName) {
            self.axes[axisName].workspace.activeFinal = true;
        });

        // Update axes to reflect usage
        JSPlot_PlotStyles_UpdateUsage(self, item, item.workspace.styleFinal.plotStyle,
            self.axes[item.axes[1]], self.axes[item.axes[2]], self.axes[item.axes[3]]);

        self.axes[item.axes[1]].linkedAxisBackPropagate(self.page);
        self.axes[item.axes[2]].linkedAxisBackPropagate(self.page);
        self.axes[item.axes[3]].linkedAxisBackPropagate(self.page);
    });

    // Decide the range of each axis in turn
    $.each(this.axes, function (name, axis) {
        if (!axis.workspace.rangeFinalised) {
            axis.linkedAxisForwardPropagate(self.page, 1);
        }
        if (axis.workspace.tickListFinal === null) {
            JSPlot_Ticking(axis, null);
        }

    });
};

/**
 * render - Step 3 of the plotting process: render the graph
 */
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
