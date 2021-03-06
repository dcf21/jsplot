// jsplot_graph.js

// -------------------------------------------------
// Copyright 2020-2022 Dominic Ford.

// This file is part of JSPlot.

// JSPlot is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// JSPlot is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with JSPlot.  If not, see <http://www.gnu.org/licenses/>.
// -------------------------------------------------

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
    this.z_index = 0;
    /** @type {?number} */
    this.aspect = null;
    /** @type {number} */
    this.aspectZ = 1;
    /** @type {JSPlot_Color} */
    this.axesColor = new JSPlot_Color(0, 0, 0, 1);
    /** @type {JSPlot_Color} */
    this.gridMajorColor = new JSPlot_Color(0.8, 0.8, 0.8, 1);
    /** @type {JSPlot_Color} */
    this.gridMinorColor = new JSPlot_Color(0.8, 0.8, 0.8, 1);
    /** @type {JSPlot_Color} */
    this.textColor = new JSPlot_Color(0, 0, 0, 1);
    /** @type {boolean} */
    this.clip = true;
    /** @type {boolean} */
    this.key = false;
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

    /** @type {?number} */
    this.boxFrom = null; // auto
    /** @type {?number} */
    this.boxWidth = null; // auto

    /** @type {Array<number>} */
    this.keyOffset = [0, 0];
    /** @type {Array<number>} */
    this.origin = [0, 0];
    /** @type {number} */
    this.titleVerticalOffset = 60;
    /** @type {Array<number>} */
    this.titleOffset = [0, 0];
    /** @type {?number|string} */
    this.width = null;  // Either null (automatic width); a numerical number of pixels; or a string percentage eg '90%'
    /** @type {boolean} */
    this.widthIncludesAxes = true;
    /** @type {?number} */
    this.viewAngleXY = 60;
    /** @type {?number} */
    this.viewAngleYZ = 30;
    /** @type {?string} */
    this.title = null;
    /** @type {boolean} */
    this.threeDimensional = false;

    /** @type {string} */
    this.interactiveMode = "none";  // Options are "none", "pan", "rotate"

    // Axes
    /** @type {Object.<string, JSPlot_Axis>} */
    this.axes = {
        'x1': new JSPlot_Axis(this, 'x1', true, {}),
        'x2': new JSPlot_Axis(this, 'x2', false, {}),
        'y1': new JSPlot_Axis(this, 'y1', true, {}),
        'y2': new JSPlot_Axis(this, 'y2', false, {}),
        'z1': new JSPlot_Axis(this, 'z1', true, {}),
        'z2': new JSPlot_Axis(this, 'z2', false, {})
    };

    // Data sets
    /** @type {Array<JSPlot_DataSet>} */
    this.dataSets = dataSets;  // This should be a list of JSPlot_DataSet instances

    // Annotations
    /** @type {Array<JSPlot_Label_Arrow|JSPlot_Label_Text>} */
    this.annotations = [];

    // Read user supplied settings
    this.configure(settings);
    this.cleanWorkspace();
}

/**
 * configure - Configure settings for a graph
 * @param settings {Object} - An object containing settings
 */
JSPlot_Graph.prototype.configure = function (settings) {
    /** @type {JSPlot_Graph} */
    var self = this;

    $.each(settings, function (key, value) {
        switch (key) {
            case "annotations":
                self.annotations = value;
                break;
            case "aspect":
                self.aspect = value;
                break;
            case "aspectZ":
                self.aspectZ = value;
                break;
            case "axesColor":
                self.axesColor = value;
                break;
            case "boxFrom":
                self.boxFrom = value;
                break;
            case "boxWidth":
                self.boxWidth = value;
                break;
            case "clip":
                self.clip = value;
                break;
            case "gridMajorColor":
                self.gridMajorColor = value;
                break;
            case "gridMinorColor":
                self.gridMinorColor = value;
                break;
            case "key":
                self.key = value;
                break;
            case "keyColumns":
                self.keyColumns = value;
                break;
            case "keyPosition":
                self.keyPosition = value;
                break;
            case "textColor":
                self.textColor = value;
                break;
            case "bar":
                self.bar = value;
                break;
            case "fontSize":
                self.fontSize = value;
                break;
            case "gridAxes":
                self.gridAxes = value;
                break;
            case "interactiveMode":
                self.interactiveMode = value;
                break;
            case "keyOffset":
                self.keyOffset = value;
                break;
            case "origin":
                self.origin = value;
                break;
            case "threeDimensional":
                self.threeDimensional = value;
                break;
            case "title":
                self.title = value;
                break;
            case "titleOffset":
                self.titleOffset = value;
                break;
            case "width":
                self.width = value;
                break;
            case "widthIncludesAxes":
                self.widthIncludesAxes = value;
                break;
            case "viewAngleXY":
                self.viewAngleXY = value;
                break;
            case "viewAngleYZ":
                self.viewAngleYZ = value;
                break;
            case "x1_axis":
            case "x2_axis":
            case "y1_axis":
            case "y2_axis":
            case "z1_axis":
            case "z2_axis":
                self.axes[key.substring(0, 2)].configure(value)
                break;
            case "z_index":
                self.z_index = value;
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

    // Work out aspect ratio for this plot
    /** @type {number} */
    this.workspace.aspect = this.aspect;
    /** @type {number} */
    this.workspace.aspectZ = this.aspectZ;
    if (this.aspect === null) {
        if (!this.threeDimensional) {
            this.workspace.aspect = 2.0 / (1.0 + Math.sqrt(5));
        } else {
            this.workspace.aspect = 1;
        }
    }

    // The y-axis of plots should run up - whereas HTML canvases count the y-axis down from the top.
    this.workspace.aspect *= -1

    /** @type {number} */
    this.workspace.defaultColorCounter = 0;
    /** @type {number} */
    this.workspace.defaultLineTypeCounter = 0;
    /** @type {number} */
    this.workspace.defaultPointTypeCounter = 0;
    /** @type {?JSPlot_Plotter} */
    this.workspace.plotter = null;
    /** @type {?Array<number>} */
    this.workspace.axis_length = null; // pixel lengths of (x, y, z) axes
    /** @type {?Array<number>} */
    this.workspace.axis_bearing = null; // directions of (x, y, z) axes

    // Work out the width of this plot, in pixels
    /** @type {number} */
    this.workspace.width_pixels = 1024;

    // Clean workspace of all axes
    $.each(this.axes, function(axis_name, axis_object) {
        axis_object.cleanWorkspace();
    });

    // Parse width requested for this graph
    if (this.page !== null) {
        if (this.width === null) {
            // Case 1: width is null. We use a default graph size.
            if (this.widthIncludesAxes) {
                // Fill the entire width of the canvas by default
                this.workspace.width_pixels = this.page.page_width - 1;
            } else {
                // If default width is not to include axis furniture, pick a sensible value, around half available width
                if (!this.threeDimensional) {
                    this.workspace.width_pixels = Math.min(0.85 * this.page.page_width, this.page.page_width - 120);
                } else {
                    this.workspace.width_pixels = Math.min(0.5 * this.page.page_width, this.page.page_width - 160);
                }
            }
        } else if (!isNaN(this.width)) {
            // Case 2: width is specified as a numerical number of pixels
            /** @type {number} */
            this.workspace.width_pixels = parseFloat(this.width);
        } else if ((this.width.charAt(this.width.length - 1) === '%') &&
            (this.page !== null) &&
            !isNaN(this.width.substring(0, this.width.length - 1))) {
            // Case 3: width is specified as a percentage of the screen width, in a a string, e.g. '90%'
            this.workspace.width_pixels = parseFloat(this.width.substring(0, this.width.length - 1)) * 0.01 * this.page.page_width;
        } else {
            // Case 4: width is not properly specified
            this.page.workspace.errorLog += "Graph width of <" + this.width + "> could not be parsed.\n";
        }
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
    var height = this.workspace.width_pixels * this.workspace.aspect;
    var zdepth = this.workspace.width_pixels * this.workspace.aspectZ;

    var x = width * (xap - 0.5);
    var y = height * (yap - 0.5);
    var z = zdepth * (zap - 0.5);

    var x2 = x * Math.cos(this.viewAngleXY * Math.PI / 180) + y * Math.sin(this.viewAngleXY * Math.PI / 180);
    var y2 = -x * Math.sin(this.viewAngleXY * Math.PI / 180) + y * Math.cos(this.viewAngleXY * Math.PI / 180);
    var z2 = z;

    var x3 = x2;
    var y3 = +y2 * Math.cos(this.viewAngleYZ * Math.PI / 180) + z2 * Math.sin(this.viewAngleYZ * Math.PI / 180);
    var z3 = -y2 * Math.sin(this.viewAngleYZ * Math.PI / 180) + z2 * Math.cos(this.viewAngleYZ * Math.PI / 180);

    return {
        "xpos": this.origin[0] + x3,
        "ypos": this.origin[1] - z3,
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
JSPlot_Graph.prototype.projectPoint = function (xin, yin, zin,
                                                axis_x, axis_y, axis_z,
                                                allowOffBounds) {
    var width = this.workspace.width_pixels;
    var height = this.workspace.width_pixels * this.workspace.aspect;

    // Convert (xin,yin,zin) to axis positions on the range of 0-1
    // This are in the (x,y,z) axes used for this data set, which may be permuted relative to physical axes
    var axis_positions = {
        'xap': axis_x.getPosition(xin, true),
        'yap': axis_y.getPosition(yin, true),
        'zap': 0.5
    };
    if (this.threeDimensional) axis_positions['zap'] = axis_z.getPosition(zin, true);

    // Start building output data structure
    var output = {'xap': 0.5, 'yap': 0.5, 'zap': 0.5, 'theta_x': 0, 'theta_y': 0, 'theta_z': 0};

    // Convert from the axes the data set sees to physical axes
    $.each({'x': axis_x, 'y': axis_y, 'z': axis_z}, function (dataset_letter, axis) {
        var physical_letter = axis.axis_name[0];
        output[physical_letter + 'ap'] = axis_positions[dataset_letter + 'ap']
    });

    // Return NaNs if the data point doesn't map to screen
    if ((!isFinite(output['xap'])) || (!isFinite(output['yap'])) || (!isFinite(output['zap']))) {
        return {'xpos': NaN, 'ypos': NaN, 'xap': NaN, 'yap': NaN, 'zap': NaN};
    }

    // Crop axis positions to range 0-1, if requested
    if ((!allowOffBounds) &&
        (
            (output['xap'] < 0) || (output['xap'] > 1) ||
            (output['yap'] < 0) || (output['yap'] > 1) ||
            (output['zap'] < 0) || (output['zap'] > 1)
        )) {
        return {'xpos': NaN, 'ypos': NaN, 'xap': NaN, 'yap': NaN, 'zap': NaN};
    }

    // 3D plots
    var theta = {'x': 0, 'y': 0, 'z': 0};
    if (this.threeDimensional) {
        var position = this.project3d(output['xap'], output['yap'], output['zap']);

        output['xpos'] = position.xpos;
        output['ypos'] = position.ypos;
        output['depth'] = position.depth;

        // Directions of physical axes
        theta['x'] = Math.atan2(
            Math.cos(this.viewAngleXY * Math.PI / 180),
            -Math.sin(this.viewAngleXY * Math.PI / 180) * Math.sin(this.viewAngleYZ * Math.PI / 180));
        theta['y'] = Math.atan2(
            Math.sin(this.viewAngleXY * Math.PI / 180),
            Math.cos(this.viewAngleXY * Math.PI / 180) * Math.sin(this.viewAngleYZ * Math.PI / 180));
        theta['z'] = Math.atan2(
            0,
            Math.cos(this.viewAngleYZ * Math.PI / 180));
    } else // 2D plots
    {
        output['xpos'] = this.origin[0] + width * output['xap'];
        output['ypos'] = this.origin[1] + height * output['yap'];
        output['depth'] = 0.0;

        // Directions of physical axes
        theta['x'] = Math.PI / 2;
        theta['y'] = Math.PI;
        theta['z'] = 0.0;
    }

    // Convert directions of physical axes into the direction of the data set's axes
    $.each({'x': axis_x, 'y': axis_y, 'z': axis_z}, function (dataset_letter, axis) {
        var physical_letter = axis.axis_name[0];
        if (isFinite(theta[physical_letter])) {
            output['theta_' + dataset_letter] = theta[physical_letter];
        }
    });

    return output;
};

/**
 * determineWidth - Step 0 of the rendering process
 * @param page {JSPlot_Canvas} - The canvas that this graph will be rendered onto
 */
JSPlot_Graph.prototype.determineWidth = function (page) {
    var self = this;

    // Set pointer to the graphics canvas that we're rendering onto
    this.page = page;
    this.cleanWorkspace();
    this.workspace.plotter = new JSPlot_Plotter(page, this);

    // Loop over all the data sets we are going to plot, ensuring all plot style settings are specified
    $.each(this.dataSets, function (index, item) {
        item.cleanWorkspace();

        // Create final set of styling information for this dataset
        item.workspace.styleFinal = item.style.clone();
        self.insertDefaultStyles(item.workspace.styleFinal);

        // Work out how many columns of data this data set expects
        item.workspace.requiredColumns = self.workspace.plotter.data_columns_required(item.workspace.styleFinal.plotStyle);
    });

    // If allotted width for graph includes axes, we need to numerically determine how long to make the axes to make
    // the graph fit within the allotted space
    if (this.widthIncludesAxes) {
        var target_physical_width = this.workspace.width_pixels;
        var width_interval_min = target_physical_width * 0.2;
        var width_interval_max = target_physical_width;
        var iteration_count = 8;

        // Determine length of horizontal axis by process of bisection
        for (var i=0; i<iteration_count; i++) {
            var trial_width = (width_interval_min + width_interval_max) / 2;
            this.workspace.width_pixels = trial_width;
            this.calculateDataRanges(this.page);
            var boundingBox = this.calculateBoundingBox();
            var physical_width = Math.abs(boundingBox.right - boundingBox.left);

            if (physical_width < target_physical_width) {
                width_interval_min = trial_width;
            } else {
                width_interval_max = trial_width;
            }
        }

        // Update length of horizontal axes
        this.workspace.width_pixels = width_interval_min;
    }
};

/**
 * calculateDataRanges - Step 1 of the rendering process: calculate the range of the data plotted against each axis.
 * Then finalise the ranges of all the axes and decide on their ticking schemes.
 */
JSPlot_Graph.prototype.calculateDataRanges = function () {
    var self = this;
    var i, j, axisName;

    // Work out projected lengths and directions of (x,y,z) axes on screen
    this.workspace.axis_length = [
        this.workspace.width_pixels,
        Math.abs(this.workspace.width_pixels * this.workspace.aspect),
        Math.abs(this.workspace.width_pixels * this.workspace.aspectZ)
    ];

    this.workspace.axis_bearing = [
        (this.workspace.width_pixels > 0) ? (Math.PI / 2) : (3 * Math.PI / 2),
        (this.workspace.width_pixels * this.workspace.aspect > 0) ? 0 : Math.PI,
        0];

    if (this.threeDimensional) {
        for (j = 0; j < 3; j++) {
            var ptA = this.project3d((j === 0) ? 0 : 0.5, (j === 1) ? 0 : 0.5, (j === 2) ? 0 : 0.5);
            var ptB = this.project3d((j === 0) ? 1 : 0.5, (j === 1) ? 1 : 0.5, (j === 2) ? 1 : 0.5);
            this.workspace.axis_length [j] = Math.hypot(ptB['xpos'] - ptA['xpos'], ptB['ypos'] - ptA['ypos']);
            this.workspace.axis_bearing[j] = Math.atan2(ptB['xpos'] - ptA['xpos'], ptB['ypos'] - ptA['ypos']);
            if (!isFinite(this.workspace.axis_length [j])) this.workspace.axis_length [j] = 0.0;
            if (!isFinite(this.workspace.axis_bearing[j])) this.workspace.axis_bearing[j] = 0.0;
        }
    }

    // Clear all range information from all axes.
    for (j = 0; j < 3; j++) {
        // Estimate how many axis ticks we want to put along this axis
        var target_number_major_ticks = this.workspace.axis_length[j] / (50 + 50 * Math.abs(Math.sin(this.workspace.axis_bearing[j])));
        var target_number_minor_ticks = this.workspace.axis_length[j] / 20;

        for (i = 0; i < 2; i++) {
            var axis_name = ['x', 'y', 'z'][j] + (i + 1);
            this.axes[axis_name].cleanWorkspace();
            this.axes[axis_name].workspace.target_number_major_ticks = target_number_major_ticks;
            this.axes[axis_name].workspace.target_number_minor_ticks = target_number_minor_ticks;
        }
    }

    // Propagate range information to linked axes
    for (j = 0; j < 3; j++) {
        for (i = 0; i < 2; i++) {
            axisName = ['x', 'y', 'z'][j] + (i + 1);
            this.axes[axisName].linkedAxisForwardPropagate(self.page, 0);
        }
    }

    // Loop over all the data sets we are going to plot
    $.each(this.dataSets, function (index, item) {
        // Consider re-evaluating data set
        /** @type {string} */
        var x_axis_name = item.axes[1];
        /** @type {JSPlot_Axis} */
        var x_axis = self.axes[x_axis_name];
        /** @type {?number} */
        var x_min = x_axis.workspace.minHard;
        /** @type {?number} */
        var x_max = x_axis.workspace.maxHard;

        if ((x_min !== null) && (x_max !== null)) item.axisRangeUpdated(x_min, x_max);

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
            axis.ticking_allocator.process();
        }

    });
};

/**
 * calculateBoundingBox - Step 2 of rendering process: return the bounding box of this graph
 * @returns {JSPlot_BoundingBox}
 */
JSPlot_Graph.prototype.calculateBoundingBox = function () {
    // Start constructing a bounding box
    var bounding_box = new JSPlot_BoundingBox();

    // Populate the bounding box of the plot
    var margin_left = Math.max(60, this.axes['y1'].workspace.max_tick_label_width + 20 + ((this.axes['y1'].label !== null) ? 20 : 0));
    var margin_right = Math.max(20, this.axes['y2'].workspace.max_tick_label_width + 20 + ((this.axes['y2'].label !== null) ? 20 : 0));
    var margin_bottom = Math.max(60, this.axes['x1'].workspace.max_tick_label_width + 20 + ((this.axes['x1'].label !== null) ? 20 : 0));
    var margin_top = Math.max(20, this.axes['x2'].workspace.max_tick_label_width + 20 + ((this.axes['x2'].label !== null) ? 20 : 0));
    var pt = null;

    for (var xap = 0; xap <= 1; xap += 1)
        for (var yap = 0; yap <= 1; yap += 1)
            for (var zap = 0; zap <= 1; zap += 1) {
                if (!this.threeDimensional) {
                    pt = {
                        'xpos': this.origin[0] + xap * this.workspace.width_pixels,
                        'ypos': this.origin[1] + yap * this.workspace.width_pixels * this.workspace.aspect
                    };
                } else {
                    pt = this.project3d(xap, yap, zap);
                }
                bounding_box.includePoint(
                    pt['xpos'] - margin_left,
                    pt['ypos'] - margin_top);
                bounding_box.includePoint(
                    pt['xpos'] + margin_right,
                    pt['ypos'] + margin_bottom);
            }

    // For 3D interactive plots, we increase the bounding box to cover the whole area the plot might cover when rotated
    if (this.threeDimensional && (this.interactiveMode === 'rotate')) {
        // Interior diagonal of a cube has length sqrt(3)
        var maximum_half_size = Math.max(
            this.workspace.width_pixels,
            Math.abs(this.workspace.width_pixels * this.workspace.aspect),
            Math.abs(this.workspace.width_pixels * this.workspace.aspectZ)
        ) * Math.sqrt(3) / 2;

        bounding_box.includePoint(
            this.origin[0] - maximum_half_size - margin_left,
            this.origin[1] - maximum_half_size - margin_top);
        bounding_box.includePoint(
            this.origin[0] + maximum_half_size + margin_right,
            this.origin[1] + maximum_half_size + margin_bottom);
    }

    // Set graph bounding box
    this.graph_bounding_box = bounding_box.copy();

    // Now lay out the legend
    this.legend_renderer = new JSPlot_Plot_Legend(this.page, this);
    this.legend_renderer.calculateLayout();

    // Factor legend into graph bounding box
    bounding_box.includeBox(this.legend_renderer.boundingBox());

    // Possibly factor title into bounding box
    if ((this.title !== null) && (this.title !== "") && this.textColor.isVisible()) {
        var titleFontSize = this.page.constants.LEGEND_fontSize * this.fontSize * 2;
        bounding_box.includePoint(
            (this.graph_bounding_box.left + this.graph_bounding_box.right)/2,
            this.graph_bounding_box.top - this.titleVerticalOffset - titleFontSize);
    }

    // Return bounding box
    return bounding_box;
};

/**
 * render - Step 3 of the plotting process: render the graph
 */
JSPlot_Graph.prototype.render = function () {
    /** @type {JSPlot_Graph} */
    var self = this;
    var i;

    // Work out lengths of x-, y- and z-axes
    var size = [
        this.workspace.width_pixels,
        this.workspace.width_pixels * this.workspace.aspect,
        this.workspace.width_pixels * this.workspace.aspectZ
    ];

    // Keep track of bounding box of all axes, so we can put title at the very top
    var axes_bounding_box = new JSPlot_BoundingBox();

    // Render grid lines
    this.grid_lines_paint();

    // Render axes (back)
    this.axes_paint(false, axes_bounding_box);

    // Turn on clipping if 'set clip' is set
    if (this.clip) {
        if (this.threeDimensional) {
            // 3D clip region is the edge of a cuboidal box
            var vertices = [];
            for (i = 0; i < 8; i++) {
                var xap = toInt((i & 1) !== 0);
                var yap = toInt((i & 2) !== 0);
                var zap = toInt((i & 4) !== 0);
                var point = this.project3d(xap, yap, zap);
                vertices.push([point['xpos'] - this.origin[0], point['ypos'] - this.origin[1]]);
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

    // Render each dataset in turn
    $.each(this.dataSets, function (index, item) {
        self.workspace.plotter.renderDataSet(self, item, item.workspace.styleFinal.plotStyle,
            item.axes[1], item.axes[2], item.axes[3]);
    });

    // Render text labels and arrows
    self.render_annotations()

    // Deactivate three-dimensional buffer
    self.page.threeDimensionalBuffer.deactivate();

    // Turn off clipping if 'set clip' is set
    if (self.clip) {
        self.page.canvas._unsetClip();

    }

    // Render axes (front)
    this.axes_paint(true, axes_bounding_box);

    // Render legend
    self.legend_renderer.render();

    // Put the title on the top of the graph
    if ((self.title !== null) && (self.title !== "") && self.textColor.isVisible()) {
        self.page.canvas._fillStyle(self.textColor.toHTML());
        self.page.canvas._textStyle(self.page.constants.LEGEND_fontFamily,
            self.page.constants.LEGEND_fontSize * self.fontSize * 2,
            self.page.constants.LEGEND_fontWeight, self.page.constants.LEGEND_fontStyle);
        self.page.canvas._text(
            self.origin[0] + size[0] / 2,
            axes_bounding_box.top - self.titleVerticalOffset,
            0, 1, 1, self.title, 0, 0);
    }
};

/**
 * render_annotations - Draw all the text labels and arrows which go on this graph
 */
JSPlot_Graph.prototype.render_annotations = function () {
    /** @type JSPlot_Graph */
    var self = this;

    // Look up the z-index of each annotation
    var sorted_item_list = [];
    $.each(this.annotations, function (index, item) {
        sorted_item_list.push([item.fetch_z_index(self), item]);
    });

    // Sort list of annotations into order of depth
    sorted_item_list.sort(function (a, b) {
        return b[0] - a[0];
    });

    // Render each annotation in turn
    $.each(sorted_item_list, function (index, item) {
        item[1].render(self);
    });
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
    var x_sign = (this.workspace.width_pixels > 0) ? 1 : -1;
    var y_sign = (this.workspace.width_pixels * this.workspace.aspect > 0) ? 1 : -1;

    if (!this.threeDimensional) {
        x_centre = this.origin[0] + this.workspace.axis_length[0] / 2 * x_sign;
        y_centre = this.origin[1] + this.workspace.axis_length[1] / 2 * y_sign;
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
            if (self.threeDimensional && (front_axes !== (mean_depth > 0))) return;

            // Work out whether to put axis labels on left side, or right side
            var b = Math.atan2(
                    (axis_pos_0['xpos'] + axis_pos_1['xpos']) / 2 - x_centre,
                    (axis_pos_0['ypos'] + axis_pos_1['ypos']) / 2 - y_centre) -
                self.workspace.axis_bearing[index_xyz];
            var right_side = Math.sin(b) > 0;

            // Work out what direction the axis ticks should point in
            /** @type Array<number> */
            var theta_ticks = [];

            for (var xyz = 0; xyz < 3; xyz++) {
                if ((xyz === 2) && (!self.threeDimensional)) {
                    continue;
                }
                if (index_xyz !== xyz) {
                    theta_ticks.push(self.workspace.axis_bearing[xyz] +
                        ((axis_pos_0['axis_pos'][xyz] > 0) ? Math.PI : 0));
                }
            }

            // Render this axis
            axis.render(self.page, right_side,
                axis_pos_0['xpos'], axis_pos_0['ypos'], axis_pos_0['depth'],
                axis_pos_1['xpos'], axis_pos_1['ypos'], axis_pos_1['depth'],
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
                            'xpos': self.origin[0] + xap * self.workspace.axis_length[0] * x_sign,
                            'ypos': self.origin[1] + yap * self.workspace.axis_length[1] * y_sign,
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

/**
 * grid_lines_paint - Draw grid lines for this graph
 */
JSPlot_Graph.prototype.grid_lines_paint = function () {
    /** @type JSPlot_Graph */
    var self = this;

    // Work out which faces of 3D cube are at back
    var ap_back = [0, 0, 0];
    if (this.threeDimensional) {
        var pt_a = self.project3d(0.5, 0.5, 0.5);
        var pt_b = self.project3d(1.0, 0.5, 0.5);
        var pt_c = self.project3d(0.5, 1.0, 0.5);
        var pt_d = self.project3d(0.5, 0.5, 1.0);
        ap_back[0] = toInt(pt_a['depth'] > pt_b['depth']);
        ap_back[1] = toInt(pt_a['depth'] > pt_c['depth']);
        ap_back[2] = toInt(pt_a['depth'] > pt_d['depth']);
    }

    $.each(self.gridAxes, function (index3, axis_name) {
        var axis = self.axes[axis_name];

        // Do not sure grid lines from axes which are not active
        if ((axis_name.charAt(0) === 'z') && !self.threeDimensional) return;
        if ((!axis.workspace.activeFinal) || (axis.workspace.tickListFinal === null)) return;

        // Render major ticks and then minor ticks
        $.each(['major', 'minor'], function (index, tick_level) {
            if (tick_level === 'major') {
                self.page.canvas._strokeStyle(self.gridMajorColor.toHTML(), self.page.constants.GRID_MAJLINEWIDTH);
            } else {
                self.page.canvas._strokeStyle(self.gridMinorColor.toHTML(), self.page.constants.GRID_MINLINEWIDTH);
            }
            var tick_list = axis.workspace.tickListFinal[tick_level];

            // Loop over all ticks along this axis
            $.each(tick_list, function (index2, tick_item) {
                var axis_pos = axis.getPosition(tick_item[0], true);

                // Do not draw grid lines close to ends of axes
                if ((axis_pos < 0.001) || (axis_pos > 0.999)) return;

                // Draw grid line
                self.page.canvas._beginPath();
                if (!self.threeDimensional) {
                    if (axis_name.charAt(0) === 'x') {
                        self.page.canvas._moveTo(
                            self.origin[0] + axis_pos * self.workspace.width_pixels,
                            self.origin[1]);
                        self.page.canvas._lineTo(
                            self.origin[0] + axis_pos * self.workspace.width_pixels,
                            self.origin[1] + self.workspace.width_pixels * self.workspace.aspect);

                    } else {
                        self.page.canvas._moveTo(
                            self.origin[0],
                            self.origin[1] + axis_pos * self.workspace.width_pixels * self.workspace.aspect);
                        self.page.canvas._lineTo(
                            self.origin[0] + self.workspace.width_pixels,
                            self.origin[1] + axis_pos * self.workspace.width_pixels * self.workspace.aspect);
                    }
                } else {
                    var axis_xyz = {'x': 0, 'y': 1, 'z': 2}[axis_name.substr(0, 1)];
                    var other_axis_xyz = [[1, 2], [0, 2], [0, 1]][axis_xyz];
                    var axis_positions = [0, 0, 0];
                    var pt = null;
                    axis_positions[axis_xyz] = axis_pos;

                    axis_positions[other_axis_xyz[0]] = ap_back[other_axis_xyz[0]];
                    axis_positions[other_axis_xyz[1]] = 0;
                    pt = self.project3d(axis_positions[0], axis_positions[1], axis_positions[2]);
                    self.page.canvas._moveTo(pt['xpos'], pt['ypos']);
                    axis_positions[other_axis_xyz[1]] = 1;
                    pt = self.project3d(axis_positions[0], axis_positions[1], axis_positions[2]);
                    self.page.canvas._lineTo(pt['xpos'], pt['ypos']);

                    axis_positions[other_axis_xyz[1]] = ap_back[other_axis_xyz[1]];
                    axis_positions[other_axis_xyz[0]] = 0;
                    pt = self.project3d(axis_positions[0], axis_positions[1], axis_positions[2]);
                    self.page.canvas._moveTo(pt['xpos'], pt['ypos']);
                    axis_positions[other_axis_xyz[0]] = 1;
                    pt = self.project3d(axis_positions[0], axis_positions[1], axis_positions[2]);
                    self.page.canvas._lineTo(pt['xpos'], pt['ypos']);
                }
                self.page.canvas._stroke();
            });
        });
    });

};

// Interactivity

/**
 * interactive_scroll - Apply interactive mouse-scroll event to this graph, for example when the user clicks and drags
 * the canvas.
 * @param x_offset {number} - The numerical number of pixels by which the canvas has been dragged.
 * @param y_offset {number} - The numerical number of pixels by which the canvas has been dragged.
 */
JSPlot_Graph.prototype.interactive_scroll = function (x_offset, y_offset) {
    /** @type JSPlot_Graph */
    var self = this;

    if (this.interactiveMode === 'pan') {
        $.each(this.axes, function (axis_name, axis) {
            var axis_direction = axis_name.substring(0, 1);
            if (axis_direction === 'x') {
                axis.interactive_scroll(self.page, x_offset / self.workspace.axis_length[0], false);
            }
            if (axis_direction === 'y') {
                axis.interactive_scroll(self.page, y_offset / self.workspace.axis_length[1], false);
            }
        });

        this.page.needs_refresh = true;
    } else if (this.interactiveMode === 'rotate') {
        this.viewAngleXY += x_offset * 180. / this.workspace.width_pixels;
        this.viewAngleYZ += y_offset * 180. / this.workspace.width_pixels;

        // Set rotation limits
        if (this.viewAngleYZ > 90) this.viewAngleYZ = 90;
        if (this.viewAngleYZ < -90) this.viewAngleYZ = -90;
        if (this.viewAngleXY < 0) this.viewAngleXY += 360;
        if (this.viewAngleXY > 360) this.viewAngleXY -= 360;

        // Refresh display
        this.page.needs_refresh = true;
    }
};

/**
 * interactive_zoom - Apply interactive zoom event to this graph, for example when the user uses the mouse wheel to
 * zoom.
 * @param delta {number} - The numerical amount by which the canvas was zoomed
 * @return {boolean} - Flag indicating whether this canvas item responded to event
 */
JSPlot_Graph.prototype.interactive_zoom = function (delta) {
    /** @type JSPlot_Graph */
    var self = this;

    // Pass zoom event to all axes
    var handled = false;
    $.each(this.axes, function (axis_name, axis) {
        handled |= axis.interactive_zoom(self.page, delta);
    });

    return handled;
};
