// jsplot_axis.js

// -------------------------------------------------
// Copyright 2020-2021 Dominic Ford.

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
 * JSPlot_Axis - A class representing a graph axis
 * @param graph {JSPlot_Graph} - The graph this axis belongs to
 * @param axis_name {string} - The name of this axis, e.g. 'x1'
 * @param enabled {boolean} - If false, then this axis is not rendered
 * @param settings {Object} - Settings for this axis
 * @constructor
 */
function JSPlot_Axis(graph, axis_name, enabled, settings) {
    /** @type {JSPlot_Graph} */
    this.graph = graph;
    /** @type {string} */
    this.axis_name = axis_name;
    /** @type {boolean} */
    this.atZero = false;
    /** @type {boolean} */
    this.enabled = enabled;
    /** @type {boolean} */
    this.visible = true;
    /** @type {?Array<string, string>} */
    this.linkTo = null; // Set to, e.g. ['myPlot','x1']
    /** @type {boolean} */
    this.rangeReversed = false;
    /** @type {string} */
    this.arrowType = 'none';  // options are 'single', 'double', 'none'
    /** @type {boolean} */
    this.logarithmic = false;
    /** @type {?number} */
    this.min = null;
    /** @type {?number} */
    this.max = null;
    /** @type {string} */
    this.data_type = 'numeric';  // options are 'numeric', 'timestamp'
    /** @type {boolean} */
    this.scrollEnabled = false;
    /** @type {?number} */
    this.scrollMin = null;
    /** @type {?number} */
    this.scrollMax = null;
    /** @type {?number} */
    this.scrollSpan = null;
    /** @type {boolean} */
    this.zoomEnabled = false;
    /** @type {boolean} */
    this.mirror = false;
    /** @type {number} */
    this.tickLabelRotation = 0;
    /** @type {number} */
    this.labelRotate = 0;
    /** @type {?JSPlot_TickingNumericLinear|JSPlot_TickingNumericLogarithmic|JSPlot_TickingTimestamp} */
    this.ticking_allocator = null;
    /** @type {?string} */
    this.label = null;
    /** @type {boolean} */
    this.showLabels = true;
    /** @type {JSPlot_AxisTics} */
    this.ticksMinor = new JSPlot_AxisTics({});
    /** @type {JSPlot_AxisTics} */
    this.ticks = new JSPlot_AxisTics({});
    this.configure(settings);

    this.cleanWorkspace();
}

/**
 * configure - Configure settings for a graph axis
 * @param settings {Object} - An object containing settings
 */
JSPlot_Axis.prototype.configure = function (settings) {
    /** @type {JSPlot_Axis} */
    var self = this;

    $.each(settings, function (key, value) {
        switch (key) {
            case "arrowType":
                self.arrowType = value;
                break;
            case "atZero":
                self.atZero = value;
                break;
            case "dataType":
                self.data_type = value;
                break;
            case "enabled":
                self.enabled = value;
                break;
            case "linkTo":
                self.linkTo = value;
                break;
            case "log":
                self.logarithmic = value;
                break;
            case "min":
                self.min = value;
                break;
            case "max":
                self.max = value;
                break;
            case "mirror":
                self.mirror = value;
                break;
            case "label":
                self.label = value;
                break;
            case "labelRotate":
                self.labelRotate = value;
                break;
            case "rangeReversed":
                self.rangeReversed = value;
                break;
            case "scrollEnabled":
                self.scrollEnabled = value;
                break;
            case "scrollMin":
                self.scrollMin = value;
                break;
            case "scrollMax":
                self.scrollMax = value;
                break;
            case "scrollSpan":
                self.scrollSpan = value;
                break;
            case "showLabels":
                self.showLabels = value;
                break;
            case "tickLabelRotation":
                self.tickLabelRotation = value;
                break;
            case "ticksMinor":
                self.ticksMinor.configure(value);
                break;
            case "ticks":
                self.ticks.configure(value);
                break;
            case "visible":
                self.visible = value;
                break;
            case "zoomEnabled":
                self.zoomEnabled = value;
                break;
            default:
                throw "Unrecognised axis setting " + key;
        }
    });
};

/**
 * cleanWorkspace - Prepare a clean, empty workspace for rendering this axis
 */
JSPlot_Axis.prototype.cleanWorkspace = function () {
    // Temporary data fields which are used when rendering an axis
    this.workspace = [];
    /** @type {?boolean} */
    this.workspace.crossedAtZero = null;
    /** @type {?boolean} */
    this.workspace.minUsed = null;
    /** @type {?boolean} */
    this.workspace.maxUsed = null;
    /** @type {?number} */
    this.workspace.minFinal = null;
    /** @type {?number} */
    this.workspace.maxFinal = null;
    /** @type {?number} */
    this.workspace.minHard = this.min;
    /** @type {?number} */
    this.workspace.maxHard = this.max;
    /** @type {?boolean} */
    this.workspace.logFinal = this.logarithmic;
    /** @type {?boolean} */
    this.workspace.rangeFinalised = false;
    /** @type {?number} */
    this.workspace.target_number_major_ticks = null;
    /** @type {?number} */
    this.workspace.target_number_minor_ticks = null;
    /** @type {?string} */
    this.workspace.axisName = null;
    /** @type {?string} */
    this.workspace.canvasId = null;
    /** @type {?string} */
    this.workspace.labelFinal = this.label;
    /** @type {?boolean} */
    this.workspace.mode0BackPropagated = false;
    this.workspace.tickListFinal = null;
    this.workspace.max_tick_label_width = 0;

    this.ticking_allocator = null;
}

/**
 * allocate_axis_ticks - Place ticks along this axis
 */
JSPlot_Axis.prototype.allocate_axis_ticks = function () {
    /** @type {JSPlot_Axis} */
    var self = this;

    // Class used for deciding ticking logic along this axis
    if (this.data_type === 'timestamp') {
        this.ticking_allocator = new JSPlot_TickingTimestamp(this);
    } else {
        if (!this.logarithmic) {
            this.ticking_allocator = new JSPlot_TickingNumericLinear(this);
        } else {
            this.ticking_allocator = new JSPlot_TickingNumericLogarithmic(this);

        }
    }

    // Assign axis ticks
    this.ticking_allocator.process();

    // Measure the physical size of each axis tick label to work out how much space is needed
    var measuring_canvas = document.createElement('canvas');
    var measuring_context = measuring_canvas.getContext("2d");
    measuring_context.font = "15px Arial,Helvetica,sans-serif";
    this.workspace.max_tick_label_width = 0;

    // Work out xyz index
    var xyz_index = {'x': 0, 'y': 1, 'z': 2}[this.axis_name.substr(0, 1)];

    // Work out rotation angle of tick labels
    var theta = -this.tickLabelRotation * Math.PI / 180;
    var theta_axis = this.graph.workspace.axis_bearing[xyz_index];
    var theta_pinpoint = theta + Math.PI / 2 + theta_axis;

    // Only major ticks have labels
    var tick_list = this.workspace.tickListFinal['major'];

    // Render each tick in turn
    $.each(tick_list, function (index2, tick_item) {
        if (tick_item[1] !== '') {
            var dimensions = measuring_context.measureText(tick_item[1]);
            var text_width = dimensions.width;
            var text_height = 15;
            var width = Math.abs(text_width * Math.sin(theta_pinpoint)) +
                Math.abs(text_height * Math.cos(theta_pinpoint));
            self.workspace.max_tick_label_width = Math.max(self.workspace.max_tick_label_width, width);
        }
    });
};

/**
 * includePoint - update the fields minUsed and maxUsed to include a data point
 * @param x {number} - The value that the axis should include
 */
JSPlot_Axis.prototype.includePoint = function (x) {
    if (!isFinite(x)) return;
    if ((this.workspace.minUsed === null) || (this.workspace.minUsed > x) &&
        ((!this.workspace.logFinal) || (x > 0.0))) {
        this.workspace.minUsed = x;
    }
    if ((this.workspace.maxUsed === null) || (this.workspace.maxUsed < x) &&
        ((!this.workspace.logFinal) || (x > 0.0))) {
        this.workspace.maxUsed = x;
    }
};

/**
 * getPosition - Get the position of a particular number along this axis. Return the fractional length along the axis,
 * in the range 0 to 1.
 * @param x_in {number} - The value we are seeking the position of
 * @param allowOffBounds {boolean} - Flag indicating whether to seek positions which lie off the ends of the axis
 * @returns {number}
 */
JSPlot_Axis.prototype.getPosition = function (x_in, allowOffBounds) {
    if (!allowOffBounds) {
        if (this.workspace.maxFinal > this.workspace.minFinal) {
            if ((x_in < this.workspace.minFinal) || (x_in > this.workspace.maxFinal)) return NaN;
        } else {
            if ((x_in > this.workspace.minFinal) || (x_in < this.workspace.maxFinal)) return NaN;
        }
    }
    if ((this.workspace.logFinal) && (x_in <= 0)) return NaN;
    if (!this.workspace.logFinal) {
        // Either linear...
        return (x_in - this.workspace.minFinal) / (this.workspace.maxFinal - this.workspace.minFinal);
    } else {
        // ... or logarithmic
        return (Math.log(x_in) - Math.log(this.workspace.minFinal)) /
            (Math.log(this.workspace.maxFinal) - Math.log(this.workspace.minFinal));
    }
};

// What is the value of this axis at point xin, in the range 0 (left) to 1 (right)?
/**
 * invGetPosition - Return the value of this axis at point <xin>, in the range 0 (left) to 1 (right)
 * @param x_in {number} - The fractional position along the axis, in the range 0 to 1
 * @returns {number}
 */
JSPlot_Axis.prototype.invGetPosition = function (x_in) {
    if (this.workspace.logFinal) {
        // Either linear...
        return this.workspace.minFinal + x_in * (this.workspace.maxFinal - this.workspace.minFinal);
    } else {
        // ... or logarithmic
        return this.workspace.minFinal * Math.pow(this.workspace.maxFinal / this.workspace.minFinal, x_in);
    }
};

/**
 * inRange - Test whether a particular value lies within the range of this axis
 * @param x_in {number} - The value we are seeking along the axis
 * @returns {boolean}
 */
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

    // If scrolling is enabled, we scale perpendicular axes to encompass the full range of data within scroll range
    if (this.scrollEnabled) {
        x_min = x_max = null;
        if (this.scrollMin !== null) {
            x_min = this.scrollMin;
        }
        if (this.scrollMax !== null) {
            x_max = this.scrollMax;
        }
    }

    // If axis has a reversed scale, then we flip the minimum and maximum
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

/**
 * linkedAxisBackPropagate - Whenever we update the usage variables MinUsed and MaxUsed for an axis, this procedure is
 * called. It checks whether the axis is linked, and if so, updates the usage variables for the axis which it is
 * linked to. This process may then iteration down a hierarchy of linked axes. As a rule, it is the axis at the bottom
 * of the linkage hierarchy (i.e. at the end of the linked list) that has the canonical usage variables. Axes further
 * up may not have complete information about the usage of the set of linked axes, since usage does not propagate UP
 * the hierarchy.
 * @param page {JSPlot_Canvas} - The canvas we are plotting this axis on to
 */
JSPlot_Axis.prototype.linkedAxisBackPropagate = function (page) {
    var self = this;

    // Propagate minUsed and maxUsed variables along links between axes
    var iterDepth;

    // loop over as many iterations of linkage as may be necessary
    var source = self;

    for (iterDepth = 0; iterDepth < 100; iterDepth++) {
        // proceed only if axis is linked and has usage information
        if (!((source.linkTo !== null) && ((source.workspace.minUsed !== null) || (source.workspace.maxUsed !== null)))) {
            break;
        }

        // Make sure that linked axis exists
        if (!page.itemList.hasOwnProperty(source.linkTo[0])) {
            page.workspace.errorLog += "Axis linked to plot <" + source.linkTo[0] + "> which doesn't exist.\n";
            break;
        }

        if (!page.itemList[source.linkTo[0]].itemType !== "graph") {
            page.workspace.errorLog += "Axis linked to plot <" + source.linkTo[0] + "> which is not a graph.\n";
            break;
        }

        if (!page.itemList[source.linkTo[0]].axes.hasOwnProperty(source.linkTo[1])) {
            page.workspace.errorLog += "Axis linked to axis <" + source.linkTo[1] + "> which doesn't exist.\n";
            break;
        }

        var target;
        target = page.itemList[source.linkTo[0]].axes[source.linkTo[1]];

        if ((source.workspace.minUsed !== null) && ((target.workspace.minUsed === null) || (target.workspace.minUsed > source.workspace.minUsed))) {
            target.workspace.minUsed = source.workspace.minUsed;
        }
        if ((source.workspace.maxUsed !== null) && ((target.workspace.minUsed === null) || (target.workspace.maxUsed < source.workspace.maxUsed))) {
            target.workspace.maxUsed = source.workspace.maxUsed;
        }

        source = target;
    }
};

/**
 * linkedAxisForwardPropagate - As part of the process of determining the range of axis xyz[axis_n], check whether
 * the axis is linking, and if so fetch usage information from the bottom of the linkage hierarchy. Propagate this
 * information up through all intermediate levels of the hierarchy before calling eps_plot_DecideAxisRange().
 * @param page {JSPlot_Canvas} - The canvas we are plotting this axis on to
 * @param mode
 */
JSPlot_Axis.prototype.linkedAxisForwardPropagate = function (page, mode) {
    var self = this;
    var originalMode = mode;

    // Propagate minUsed and maxUsed variables along links between axes
    var iterDepth;

    // Find the bottom of the hierarchy of linked axes. Loop over as many iterations of linkage as may be necessary
    var source = self;
    var chain = [self];

    for (iterDepth = 0; iterDepth < 100; iterDepth++) {
        // proceed only if axis is linked
        if (source.linkTo === null) {
            break;
        }

        // Make sure that linked axis exists
        if (!page.itemList.hasOwnProperty(source.linkTo[0])) {
            page.workspace.errorLog += "Axis linked to plot <" + source.linkTo[0] + "> which doesn't exist.\n";
            break;
        }

        if (page.itemList[source.linkTo[0]].itemType !== "graph") {
            page.workspace.errorLog += "Axis linked to plot <" + source.linkTo[0] + "> which is not a graph.\n";
            break;
        }

        if (!page.itemList[source.linkTo[0]].axes.hasOwnProperty(source.linkTo[1])) {
            page.workspace.errorLog += "Axis linked to axis <" + source.linkTo[1] + "> which doesn't exist.\n";
            break;
        }

        source = page.itemList[source.linkTo[0]].axes[source.linkTo[1]];
        chain.push(source);
    }

    if ((mode === 1) && (!source.workspace.rangeFinalised)) {
        source.allocate_axis_ticks();
    }

    for (var index = chain.length - 2; index >= 0; index--) {
        /** @type {JSPlot_Axis} */
        var axis = chain[index];

        if (axis.workspace.rangeFinalised) break;
        if (axis.linkTo === null) break; // proceed only if axis is linked
        if ((originalMode === 0) && (axis.workspace.mode0BackPropagated)) continue;
        axis.workspace.mode0BackPropagated = true;
        if (mode === 0) {
            // MODE 0: Propagate HardMin, HardMax
            axis.workspace.hardMin = source.workspace.hardMin;
            axis.workspace.hardMax = source.workspace.hardMax;
            axis.workspace.hardAutoMinSet = source.workspace.hardAutoMinSet;
            axis.workspace.hardAutoMaxSet = source.workspace.hardAutoMaxSet;
        } else if (mode === 1) {
            axis.workspace.logFinal = source.workspace.logFinal;
            axis.workspace.minFinal = source.workspace.minFinal;
            axis.workspace.maxFinal = source.workspace.maxFinal;
            axis.workspace.rangeFinalised = true;
            axis.allocate_axis_ticks();
        }
    }
};

JSPlot_Axis.prototype.axis_tick_text_alignment = function (theta) {
    theta = theta % (2 * Math.PI);
    while (theta < 0) theta += 2 * Math.PI;

    if (theta < 1 * Math.PI / 8) return [0, 1];
    if (theta < 3 * Math.PI / 8) return [-1, 1];
    if (theta < 5 * Math.PI / 8) return [-1, 0];
    if (theta < 7 * Math.PI / 8) return [-1, -1];
    if (theta < 9 * Math.PI / 8) return [0, -1];
    if (theta < 11 * Math.PI / 8) return [1, -1];
    if (theta < 13 * Math.PI / 8) return [1, 0];
    if (theta < 15 * Math.PI / 8) return [1, 1];
    return [0, -1];
};

/**
 * render - Draw an axis onto the canvas
 * @param page {JSPlot_Canvas} - The canvas page we are drawing this graph onto
 * @param right_side {boolean} - Should this axis be labelled on left side or right side
 * @param x0 {number} - The coordinates of the start point of the axis, in canvas pixels.
 * @param y0 {number} - The coordinates of the start point of the axis, in canvas pixels.
 * @param z0 {number} - The coordinates of the start point of the axis, in canvas pixels.
 * @param x1 {number} - The coordinates of the end point of the axis, in canvas pixels.
 * @param y1 {number} - The coordinates of the end point of the axis, in canvas pixels.
 * @param z1 {number} - The coordinates of the end point of the axis, in canvas pixels.
 * @param tick_thetas {Array<number>} - The list of angles to the vertical at which we draw tick marks
 * @param label {boolean} - Should we label this axis?
 */
JSPlot_Axis.prototype.render = function (page, right_side, x0, y0, z0, x1, y1, z1, tick_thetas, label) {
    /** @type {JSPlot_Axis} */
    var self = this;
    var left_side = !right_side;

    // Do not render axes which are not visible
    if (!this.visible) return;

    // Do not label axes where labels are disabled
    label = (label && this.showLabels);

    // Stroke line of axis
    var arrow_renderer = new JSPlot_DrawArrow();
    arrow_renderer.primitive_arrow(page, this.arrowType,
        x0, y0, z0, x1, y1, z1,
        this.graph.axesColor, page.constants.AXES_LINEWIDTH, 0);

    // Work out xyz index
    var xyz_index = {'x': 0, 'y': 1, 'z': 2}[this.axis_name.substr(0, 1)];

    // Work out rotation angle of tick labels
    var theta = -this.tickLabelRotation * Math.PI / 180;
    var theta_axis = this.graph.workspace.axis_bearing[xyz_index];
    var theta_pinpoint = theta + Math.PI / 2 + theta_axis + Math.PI * left_side;
    var label_alignment = this.axis_tick_text_alignment(theta_pinpoint);

    // Render major ticks and then minor ticks
    $.each(['major', 'minor'], function (index, tick_level) {
        var tick_length = ((tick_level === 'major') ?
            page.constants.AXES_MAJTICKLEN :
            page.constants.AXES_MINTICKLEN);
        var tick_list = self.workspace.tickListFinal[tick_level];

        // Render each tick in turn
        $.each(tick_list, function (index2, tick_item) {
            var tic_lab_xoff = 0.0;
            var axis_position = self.getPosition(tick_item[0], true);
            var tic_x1 = x0 + (x1 - x0) * axis_position;
            var tic_y1 = y0 + (y1 - y0) * axis_position;

            // Render tick marks
            $.each(tick_thetas, function (index3, tick_theta) {
                // bottom of tick
                var tic_x2 = tic_x1 + Math.sin(tick_theta) * tick_length;
                var tic_y2 = tic_y1 + Math.cos(tick_theta) * tick_length;

                // If this tick is at the end of an axis with an arrow head, don't render
                if ((axis_position < 1e-3) && (
                    (self.arrowType === 'back') || (self.arrowType === 'double')
                )) {
                    return;
                }

                if ((axis_position > 0.999) && (
                    (self.arrowType === 'single') || (self.arrowType === 'double')
                )) {
                    return;
                }

                // Do not draw grid lines close to ends of axes
                if ((axis_position > 0.001) && (axis_position < 0.999)) {
                    // Stroke tick mark
                    page.canvas._strokeStyle(self.graph.axesColor.toHTML(), page.constants.AXES_LINEWIDTH);
                    page.canvas._beginPath();
                    page.canvas._moveTo(tic_x1, tic_y1);
                    page.canvas._lineTo(tic_x2, tic_y2);
                    page.canvas._stroke();
                }

                // Write tick label
                if (label && (tick_level === 'major') && (tick_item[1] !== '')) {
                    var xlab = tic_x1 + (left_side ? -1.0 : 1.0) * Math.sin(theta_axis + Math.PI / 2) * page.constants.AXES_TEXTGAP + tic_lab_xoff;
                    var ylab = tic_y1 + (left_side ? -1.0 : 1.0) * Math.cos(theta_axis + Math.PI / 2) * page.constants.AXES_TEXTGAP;

                    page.canvas._translate(xlab, ylab, self.tickLabelRotation);
                    page.canvas._textStyle("Arial,Helvetica,sans-serif", 15, "", "");
                    page.canvas._fillStyle(self.graph.axesColor.toHTML());
                    page.canvas._text(0, 0, label_alignment[0], label_alignment[1], true, tick_item[1], false, true);
                    page.canvas._unsetTranslate();
                }
            });
        });
    });

    // Write axis label
    if (label && self.workspace.labelFinal !== null) {
        theta = -self.labelRotate;
        theta_pinpoint = theta + Math.PI * left_side; // Angle around textbox where it is anchored
        label_alignment = this.axis_tick_text_alignment(theta_pinpoint);

        var xlab = (x0 + x1) / 2 + ((left_side ? -1.0 : 1.0) *
            (this.workspace.max_tick_label_width + page.constants.AXES_LABELGAP) *
            Math.sin(theta_axis + Math.PI / 2)
        );
        var ylab = (y0 + y1) / 2 + ((left_side ? -1.0 : 1.0) *
            (this.workspace.max_tick_label_width + page.constants.AXES_LABELGAP) *
            Math.cos(theta_axis + Math.PI / 2)
        );

        var theta_text = theta + Math.PI / 2 - theta_axis;
        theta_text = theta_text % (2 * Math.PI);
        if (theta_text < -Math.PI) theta_text += 2 * Math.PI;
        if (theta_text > Math.PI) theta_text -= 2 * Math.PI;
        if (theta_text > Math.PI / 2) theta_text -= Math.PI;
        if (theta_text < -Math.PI / 2) theta_text += Math.PI;

        page.canvas._translate(xlab, ylab, theta_text);
        page.canvas._textStyle("Arial,Helvetica,sans-serif", 15, "", "");
        page.canvas._fillStyle(self.graph.axesColor.toHTML());
        page.canvas._text(0, 0, label_alignment[0], label_alignment[1], true,
            self.workspace.labelFinal, false, true);
        page.canvas._unsetTranslate();
    }
};

// Interactivity

/**
 * interactive_scroll - Apply interactive mouse-scroll event to this axis, for example when the user clicks and drags
 * the canvas.
 * @param page {JSPlot_Canvas} - The canvas page which triggered this scroll event
 * @param offset {number} - The numerical factor by which the canvas has been dragged, in units of the length of the
 * axis.
 * @param force {boolean} - Perform this scroll, even if scrolling is disabled for this axis
 */
JSPlot_Axis.prototype.interactive_scroll = function (page, offset, force) {
    if ((force || this.scrollEnabled) && (this.workspace.minFinal !== null) && (this.workspace.maxFinal !== null)) {
        // If the span of the axis is not defined, take it from the current automatic scaling
        if (this.scrollSpan === null) {
            if (!this.workspace.logFinal) {
                this.scrollSpan = Math.abs(this.workspace.maxFinal - this.workspace.minFinal)
            } else {
                this.scrollSpan = this.workspace.maxFinal / this.workspace.minFinal;
                if (this.scrollSpan < 1) {
                    this.scrollSpan = 1 / this.scrollSpan;
                }
            }
        }

        // If axis limits are not currently set, set them from the current automatic scaling
        if (this.min === null) {
            this.min = this.workspace.minFinal;
        }

        // Apply scroll
        if (!this.workspace.logFinal) {
            // Scroll axis
            this.min -= offset * this.scrollSpan;
            // Check if we've reached lower limit
            if ((this.scrollMin !== null) && (this.min < this.scrollMin)) {
                this.min = this.scrollMin;
            }
            // Check if we've reached upper limit
            if ((this.scrollMax !== null) && (this.min > this.scrollMax - this.scrollSpan)) {
                this.min = this.scrollMax - this.scrollSpan;
            }
            // Set upper limit of axis, based on the new lower limit
            this.max = this.min + this.scrollSpan;
        } else {
            // Scroll axis
            this.min /= Math.pow(this.scrollSpan, offset);
            // Check if we've reached lower limit
            if ((this.scrollMin !== null) && (this.min < this.scrollMin)) {
                this.min = this.scrollMin;
            }
            // Check if we've reached upper limit
            if ((this.scrollMax !== null) && (this.min > this.scrollMax / this.scrollSpan)) {
                this.min = this.scrollMax / this.scrollSpan;
            }
            // Set upper limit of axis, based on the new lower limit
            this.max = this.min * this.scrollSpan;
        }

        // Refresh display
        page.needs_refresh = true;
    }
};

/**
 * interactive_zoom - Apply interactive zoom event to this axis, for example when the user uses the mouse wheel to zoom.
 * @param page {JSPlot_Canvas} - The canvas page which triggered this zoom event
 * @param delta {number} - The numerical amount by which the canvas was zoomed
 * @return {boolean} - Flag indicating whether this axis responded to event
 */
JSPlot_Axis.prototype.interactive_zoom = function (page, delta) {
    /** @type {number} */
    var zoom_factor = 0.9;
    /** @type {number} */
    var scroll_span_old = this.scrollSpan;

    // Make sure scroll span is populated
    this.interactive_scroll(page, 0, this.zoomEnabled);

    // Apply zoom
    if (this.zoomEnabled && (this.scrollSpan !== null)) {
        if (delta > 0) {
            // Zoom in
            this.scrollSpan *= zoom_factor;
            this.interactive_scroll(page, -(1 - zoom_factor) / 2, true);
        } else {
            // Zoom out
            this.scrollSpan /= zoom_factor;

            // Make sure we have not zoomed out beyond allowed range
            if ((this.scrollMin !== null) && (this.scrollMax !== null)) {
                if (!this.workspace.logFinal) {
                    if (this.scrollSpan > this.scrollMax - this.scrollMin) {
                        this.scrollSpan = this.scrollMax - this.scrollMin;
                    }
                } else {
                    if (this.scrollSpan > this.scrollMax / this.scrollMin) {
                        this.scrollSpan = this.scrollMax / this.scrollMin;
                    }

                }
            }

            // Update axis range
            this.interactive_scroll(page, (1 - zoom_factor) / 2, true);
        }

        // Refresh display
        page.needs_refresh = true;
    }

    return (this.zoomEnabled && (this.scrollSpan !== scroll_span_old));
};
