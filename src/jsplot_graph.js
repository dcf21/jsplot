// jsplot_graph.js

/**
 * JSPlot_Graph - A class representing a graph, to be rendered onto a <JSPlot_Canvas>
 * @param dataSets {Array<JSPlot_DataSet>} - A list of <JSPlot_DataSet> objects to plot on this graph
 * @param settings {Object} - An object containing settings
 * @constructor
 */
function JSPlot_Graph(dataSets, settings) {
    /** @type {?JSPlot_Canvas} */
    this.page = null;
    /** @type {string} */
    this.itemType = "graph";
    /** @type {number} */
    this.aspect = 2.0 / (1.0 + Math.sqrt(5));
    this.aspectZ = 2.0 / (1.0 + Math.sqrt(5));
    /** @type {JSPlot_Color} */
    this.axesColor = new JSPlot_Color(0, 0, 0, 1);
    /** @type {JSPlot_Color} */
    this.gridMajorColor = new JSPlot_Color(0.6, 0.6, 0.6, 1);
    /** @type {JSPlot_Color} */
    this.gridMinorColor = new JSPlot_Color(0.85, 0.85, 0.85, 1);
    /** @type {JSPlot_Color} */
    this.textColor = new JSPlot_Color(0, 0, 0, 1);
    /** @type {boolean} */
    this.clip = true;
    /** @type {boolean} */
    this.key = true;
    /** @type {?number} */
    this.keyColumns = null;
    /** @type {string} */
    this.keyPosition = "tr";

    /** @type {number} */
    this.bar = 1;
    /** @type {number} */
    this.fontSize = 1;
    /** @type {Array<string>} */
    this.gridAxes = ['x1', 'y1', 'z1']; // which axes should produce grid lines?

    /** @type {number} */
    this.boxFrom = null; // auto
    /** @type {number} */
    this.boxWidth = null; // auto

    /** @type {Array<number>} */
    this.keyOffset = [0, 0];
    /** @type {Array<number>} */
    this.origin = [0, 0];
    /** @type {Array<number>} */
    this.titleOffset = [0, 0];
    this.width = '90%';
    /** @type {?number} */
    this.viewAngleXY = 60;
    /** @type {?number} */
    this.viewAngleYZ = 30;
    /** @type {?string} */
    this.title = null;
    /** @type {boolean} */
    this.threeDimensional = false;

    // Axes
    /** @type {Object.<string, JSPlot_Axis>} */
    this.axes = {
        'x1': new JSPlot_Axis(true, {}),
        'x2': new JSPlot_Axis(false, {}),
        'y1': new JSPlot_Axis(true, {}),
        'y2': new JSPlot_Axis(false, {}),
        'z1': new JSPlot_Axis(true, {}),
        'z2': new JSPlot_Axis(false, {}),
    };

    // Data sets
    /** @type {Array<JSPlot_DataSet>} */
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
JSPlot_Graph.prototype.configure = function (settings) {
    $.each(settings, function (key, value) {
        switch (key) {
            case "aspect":
                this.aspect = value;
                break;
            case "aspectZ":
                this.aspectZ = value;
                break;
            case "axesColor":
                this.axesColor = value;
                break;
            case "clip":
                this.clip = value;
                break;
            case "gridMajorColor":
                this.gridMajorColor = value;
                break;
            case "gridMinorColor":
                this.gridMinorColor = value;
                break;
            case "key":
                this.key = value;
                break;
            case "keyColumns":
                this.keyColumns = value;
                break;
            case "keyPosition":
                this.keyPosition = value;
                break;
            case "textColor":
                this.textColor = value;
                break;
            case "bar":
                this.bar = value;
                break;
            case "fontSize":
                this.fontSize = value;
                break;
            case "gridAxes":
                this.gridAxes = value;
                break;
            case "keyOffset":
                this.keyOffset = value;
                break;
            case "origin":
                this.origin = value;
                break;
            case "titleOffset":
                this.titleOffset = value;
                break;
            case "width":
                this.width = value;
                break;
            case "viewAngleXY":
                this.viewAngleXY = value;
                break;
            case "viewAngleYZ":
                this.viewAngleYZ = value;
                break;
            case "title":
                this.title = value;
                break;
            case "threeDimensional":
                this.threeDimensional = value;
                break;
            default:
                throw "Unrecognised graph setting " + key;
        }
    });
};

/**
 * cleanWorkspace - Create a clean workspace to be used for plotting this graph
 */
JSPlot_Graph.prototype.cleanWorkspace = function () {
    // Temporary data fields which are used when rendering a plot
    this.workspace = [];
    /** @type {number} */
    this.workspace.defaultColorCounter = 0;
    /** @type {number} */
    this.workspace.defaultLineTypeCounter = 0;
    /** @type {number} */
    this.workspace.defaultPointTypeCounter = 0;
    /** @type {?JSPlot_Plotter} */
    this.workspace.plotter = null;
    /** @type {?Array<number>} */
    this.workspace.screen_size = null; // pixel lengths of (x, y, z) axes
    /** @type {?Array<number>} */
    this.workspace.screen_bearing = null; // directions of (x, y, z) axes

    if (!isNaN(this.width)) {
        /** @type {number} */
        this.workspace.width_pixels = parseFloat(this.width);
    } else if ((this.width.charAt(this.width.length - 1) === '%') &&
        (this.page !== null) &&
        !isNaN(this.width.substring(0, this.width.length - 1))) {
        this.workspace.width_pixels = parseFloat(this.width.substring(0, this.width.length - 1)) * 0.01 * this.page.page_width;
    } else {
        this.workspace.width_pixels = 1024;
    }
};

/**
 * insertDefaultStyles - Take the styling associated with a particular data set, and where parameters are unset,
 * replace them with defaults. For example, set lines to have incremental line styles, colored items to have incremental
 * colors, points to have incremental point styles.
 * @param style - The styling associated with the data set we are operating on
 */
JSPlot_Graph.prototype.insertDefaultStyles = function (style) {
    if (style.color === null) {
        style.color = this.page.styling.defaultColors[this.workspace.defaultColorCounter];
        this.workspace.defaultColorCounter++;
        if (this.workspace.defaultColorCounter >= this.page.styling.defaultColors.length - 1) {
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
        if (this.workspace.defaultPointTypeCounter >= this.page.styling.pointTypes.length - 1) {
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
    var width = this.workspace.width_pixels;
    var height = this.workspace.width_pixels * this.aspect;
    var zdepth = this.workspace.width_pixels * this.aspectZ;

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
    var width = this.workspace.width_pixels;
    var height = this.workspace.width_pixels * this.aspect;

    // Convert (xin,yin,zin) to axis positions on the range of 0-1
    var xap = axis_x.getPosition(xin, 1);
    var yap = axis_y.getPosition(yin, 1);
    var zap = 0.5;
    var output = {'xap': xap, 'yap': yap, 'zap': zap};

    if (this.threeDimensional) zap = axis_z.getPosition(zin, 1);

    if ((!isFinite(xap)) || (!isFinite(yap)) || (!isFinite(zap))) {
        return {'xpos': NaN, 'ypos': NaN, 'xap': NaN, 'yap': NaN, 'zap': NaN};
    }
    // Crop axis positions to range 0-1
    if ((!allowOffBounds) && ((xap < 0) || (xap > 1) || (yap < 0) || (yap > 1) || (zap < 0) || (zap > 1))) {
        return {'xpos': NaN, 'ypos': NaN, 'xap': NaN, 'yap': NaN, 'zap': NaN};
    }

    // 3D plots
    if (this.threeDimensional) {
        var position = this.project3d(xap, yap, zap);

        output['xpos'] = position.xpos;
        output['ypos'] = position.ypos;
        output['depth'] = position.depth;

        var theta_x = Math.atan2(
            Math.cos(this.viewAngleXY * Math.PI / 180),
            -Math.sin(this.viewAngleXY * Math.PI / 180) * Math.sin(this.viewAngleYZ * Math.PI / 180));
        var theta_y = Math.atan2(
            Math.sin(this.viewAngleXY * Math.PI / 180),
            Math.cos(this.viewAngleXY * Math.PI / 180) * Math.sin(this.viewAngleYZ * Math.PI / 180));
        var theta_z = Math.atan2(
            0,
            Math.cos(this.viewAngleYZ * Math.PI / 180));

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
    var i, j, axis_name;

    // Set pointer to the graphics canvas that we're rendering onto
    this.page = page;
    this.cleanWorkspace();
    this.workspace.plotter = new JSPlot_Plotter(page, this);

    // Start constructing a bounding box
    var bounding_box = new JSPlot_BoundingBox();

    // Work out projected lengths and directions of (x,y,z) axes on screen
    this.workspace.screen_size = [
        this.workspace.width_pixels,
        this.workspace.width_pixels * this.aspect,
        this.workspace.width_pixels * this.aspectZ
    ];
    this.workspace.screen_bearing = [Math.PI / 2, 0, 0];

    if (this.threeDimensional) {
        for (j = 0; j < 3; j++) {
            var ptA = this.project3d((j === 0) ? 0 : 0.5, (j === 1) ? 0 : 0.5, (j === 2) ? 0 : 0.5);
            var ptB = this.project3d((j === 0) ? 1 : 0.5, (j === 1) ? 1 : 0.5, (j === 2) ? 1 : 0.5);
            this.workspace.screen_size   [j] = Math.hypot(ptB['xpos'] - ptA['xpos'], ptB['ypos'] - ptA['ypos']);
            this.workspace.screen_bearing[j] = Math.atan2(ptB['xpos'] - ptA['xpos'], ptB['ypos'] - ptA['ypos']);
            if (!isFinite(this.workspace.screen_size   [j])) this.workspace.screen_size   [j] = 0.0;
            if (!isFinite(this.workspace.screen_bearing[j])) this.workspace.screen_bearing[j] = 0.0;
        }
    }

    // Populate the bounding box of the plot
    var margin = 40;
    if (!this.threeDimensional) {
        bounding_box.includePoint(this.origin[0] - margin, this.origin[1] - margin);
        bounding_box.includePoint(this.origin[0] + this.workspace.width_pixels + margin,
            this.origin[1] + this.workspace.width_pixels * this.aspect + margin);
    } else {
        for (var xap = 0; xap <= 1; xap += 1)
            for (var yap = 0; yap <= 1; yap += 1)
                for (var zap = 0; zap <= 1; zap += 1) {
                    var pt = this.project3d(xap, yap, zap);
                    bounding_box.includePoint(
                        pt['xpos'] + this.origin[0] - margin,
                        pt['ypos'] + this.origin[1] - margin);
                    bounding_box.includePoint(
                        pt['xpos'] + this.origin[0] + margin,
                        pt['ypos'] + this.origin[1] + margin);
                }
    }

    // Clear all range information from all axes.
    // Also, transfer range information from [Min,Max] to [HardMin,HardMax].
    for (j = 0; j < 3; j++) {
        var pixel_len_major_ticks = this.workspace.screen_size[j] / (0.015 + 0.01 * Math.abs(Math.sin(this.workspace.screen_bearing[j])));
        var pixel_len_minor_ticks = this.workspace.screen_size[j] / 0.004;

        for (i = 0; i < 2; i++) {
            axis_name = ['x', 'y', 'z'][j] + (i + 1);
            this.axes[axis_name].cleanWorkspace();
            this.axes[axis_name].workspace.pixel_len_major_ticks = pixel_len_major_ticks;
            this.axes[axis_name].workspace.pixel_len_minor_ticks = pixel_len_minor_ticks;
        }
    }

    // Return bounding box
    return bounding_box;
};

/**
 * calculateDataRanges - Step 2 of the rendering process: calculate the range of the data plotted against each axis.
 * Then finalise the ranges of all the axes and decide on their ticking schemes.
 */
JSPlot_Graph.prototype.calculateDataRanges = function () {
    var self = this;
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
        item.workspace.requiredColumns = self.workspace.plotter.data_columns_required(item.workspace.styleFinal.plotStyle);

        // Mark up the axes used by this data set as being active
        $.each(item.axes, function (index, axisName) {
            self.axes[axisName].workspace.activeFinal = true;
        });

        // Update axes to reflect usage
        self.workspace.plotter.update_axis_usage(item, item.workspace.styleFinal.plotStyle,
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
            // TODO !!! JSPlot_Ticking(axis, null);
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
        this.workspace.width_pixels,
        this.workspace.width_pixels * this.aspect,
        this.workspace.width_pixels * this.aspectZ
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
                vertices.push(this.project3d(xap, yap, zap));
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

    // Keep track of bounding box of all axes, so we can put title at the very top
    var axes_bounding_box = new JSPlot_BoundingBox();

    // Render axes (back)
    this.axes_paint(false, axes_bounding_box);

    // Activate three-dimensional buffer if graph is 3D
    if (self.threeDimensional) self.page.threeDimensionalBuffer.activate();

    // Render each dataset in turn
    $.each(this.dataSets, function (index, item) {
        item.render(self);
    });

    // Render text labels and arrows
    // !!! TODO JSPlot_LabelsArrows(self);

    // Deactivate three-dimensional buffer
    self.page.threeDimensionalBuffer.deactivate();

    // Turn off clipping if 'set clip' is set
    if (self.clip) {
        self.page.canvas._unsetClip();

    }

    // Render axes (front)
    this.axes_paint(true, axes_bounding_box);

    // Render legend
    // !!! TODO JSPlot_GraphLegendRender(self);

    // Put the title on the top of the graph
    if ((self.title !== null) && (self.title !== "") && self.textColor.isVisible()) {
        self.page.canvas._fillStyle(self.textColor.toHTML());
        self.page.canvas._text(
            self.origin[0] + size[0] / 2,
            axes_bounding_box.top, 0, 1, 1, self.title, 0, 0);
    }
};

/**
 * axes_paint - Draw all of the axes around this graph
 * @param front_axes {boolean} - If true, draw all the axes which are in front of the data (on 3D plots). If false,
 * draw the axes behind the data.
 * @param bounding_box {JSPlot_BoundingBox} - Factor this axis (and attached labels) into this bounding box.
 */
JSPlot_Graph.prototype.axes_paint = function (front_axes, bounding_box) {
    /** @type JSPlot_Graph */
    var self = this;

    // 2D graphs don't have any back axes
    if ((!this.threeDimensional) && (!front_axes)) return;

    // Fetch coordinates of the centre of the graph
    /** @type {number} */
    var x_centre = 0, y_centre = 0;

    if (!this.threeDimensional) {
        x_centre = this.origin[0] + this.workspace.screen_size[0] / 2;
        y_centre = this.origin[1] + this.workspace.screen_size[1] / 2;
    } else {
        var pos = this.project3d(0.5, 0.5, 0.5);
        x_centre = pos['xpos'];
        y_centre = pos['ypos'];
    }

    // Set crossedAtZero flags
    $.each(this.axes, function (axis_name, axis) {
        axis.workspace.crossedAtZero = false;
        if (axis_name[1] === '1') {
            if ((axis_name[0] !== 'x') && (self.axes['x1'].atZero)) axis.workspace.crossedAtZero = true;
            if ((axis_name[0] !== 'y') && (self.axes['y1'].atZero)) axis.workspace.crossedAtZero = true;
            if ((axis_name[0] !== 'z') && (self.axes['z1'].atZero)) axis.workspace.crossedAtZero = true;
        }
    })

    function render_one_side(side_key_strings, vertices, index_xyz, axis, axis_name, label) {
        $.each(side_key_strings, function (index_side, side_key_string) {
            /** @type Object.<string, number> */
            var axis_pos_0 = vertices[side_key_string][0];
            /** @type Object.<string, number> */
            var axis_pos_1 = vertices[side_key_string][1];

            var mean_depth = (axis_pos_0['depth'] + axis_pos_1['depth']) / 2;

            // Do not draw front axes on first pass, or back axes on second pass
            if (self.threeDimensional && (front_axes !== (mean_depth < 0))) return;

            // Work out whether to put axis labels on left side, or right side
            var b = Math.atan2(
                (axis_pos_0['xpos'] + axis_pos_1['xpos']) / 2 - x_centre,
                (axis_pos_0['ypos'] + axis_pos_1['ypos']) / 2 - y_centre) -
                self.workspace.screen_bearing[index_xyz];
            var right_side = Math.sin(b) > 0;

            // Work out what direction the axis ticks should point in
            /** @type Array<number> */
            var theta_ticks = [];

            for (var xyz = 0; xyz < 3; xyz++)
                if (index_xyz !== xyz) {
                    theta_ticks.push(self.workspace.screen_bearing[xyz] +
                    (axis_pos_0['axis_pos'][xyz] > 0) ? Math.PI : 0);
                }

            // Render this axis
            axis.render(self.page, self, axis_name, right_side,
                self.origin[0] + axis_pos_0['xpos'], self.origin[1] + axis_pos_0['ypos'], axis_pos_0['depth'],
                self.origin[0] + axis_pos_1['xpos'], self.origin[1] + axis_pos_1['ypos'], axis_pos_1['depth'],
                theta_ticks, label && (index_side === 0));

        });
    }

    // Loop over axis directions
    $.each(['x', 'y', 'z'], function (index_xyz, axis_xyz) {
        // 2D plots don't have z axes
        if (axis_xyz === 'z' && !self.threeDimensional) return;

        // Make array of all the corners of this graph
        /** @type Object.<string, Array<Object.<string, number>>> */
        var vertices = {}
        for (var xap = 0; xap <= 1; xap += 1)
            for (var yap = 0; yap <= 1; yap += 1)
                for (var zap = 0; zap <= 1; zap += 1) {
                    if (self.threeDimensional) {
                        var pt = self.project3d(xap, yap, zap);
                    } else {
                        pt = {
                            'xpos': self.origin[0] + xap * self.workspace.screen_size[0],
                            'ypos': self.origin[1] + yap * self.workspace.screen_size[1],
                            'depth': 0
                        }
                    }

                    pt['axis_pos'] = [xap, yap, zap];

                    // 2D axes appear on two sides of the plot (top and bottom)
                    // 3D axes appear on four sides of the plot each
                    var side_key_string = "";
                    if (axis_xyz !== 'x') side_key_string += xap.toString();
                    if (axis_xyz !== 'y') side_key_string += yap.toString();
                    if (axis_xyz !== 'z') side_key_string += zap.toString();

                    if (!vertices.hasOwnProperty(side_key_string)) vertices[side_key_string] = [];
                    vertices[side_key_string].push(pt);

                    // Make sure this vertex is factored into bounding box
                    bounding_box.includePoint(pt['xpos'], pt['ypos']);
                }

        // Draw each axis in this direction in turn
        $.each(self.axes, function (axis_name, axis) {
            // Reject if this axis is in the wrong direction, or not visible
            if (axis_name[0] !== axis_xyz) return;
            if (!axis.enabled || !axis.visible) return;

            if (!axis.workspace.atZero) {
                /** @type Array<string> */
                var side_key_strings;
                if (axis_name[1] === '1') {
                    // x1/y1 axis belongs on bottom / left
                    side_key_strings = self.threeDimensional ? ['00', '01'] : ['00'];
                } else {
                    // x2/y2 axis belongs on top / right
                    side_key_strings = self.threeDimensional ? ['10', '11'] : ['10'];
                }
                render_one_side(side_key_strings, vertices, index_xyz, axis, axis_name, true);
            }
        });

        // Render mirrored x1/y1 axes
        if ((!self.axes[axis_xyz + '1'].mirror) && (!self.axes[axis_xyz + '2'].enabled)) {
            // x2/y2 axis belongs on top / right
            var side_key_strings = self.threeDimensional ? ['10', '11'] : ['10'];
            var axis_name = axis_xyz + '2';
            var axis = self.axes[axis_xyz + '1'];
            render_one_side(side_key_strings, vertices, index_xyz, axis, axis_name, false);
        }
    });
};
