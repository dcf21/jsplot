// jsplot_axis.js

/**
 * JSPlot_Axis - A class representing a graph axis
 * @param graph {JSPlot_Graph} - The graph this axis belongs to
 * @param enabled {boolean} - If false, then this axis is not rendered
 * @param settings {Object} - Settings for this axis
 * @constructor
 */
function JSPlot_Axis(graph, enabled, settings) {
    /** @type {JSPlot_Graph} */
    this.graph = graph;
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
    /** @type {number} */
    this.tickLabelRotate = 0;
    /** @type {?JSPlot_TickingNumericLinear|JSPlot_TickingNumericLogarithmic|JSPlot_TickingTimestamp} */
    this.ticking_allocator = null;
    /** @type {?string} */
    this.label = null;
    /** @type {JSPlot_AxisTics} */
    this.ticsM = new JSPlot_AxisTics({});
    /** @type {JSPlot_AxisTics} */
    this.tics = new JSPlot_AxisTics({});
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
            case "tickLabelRotate":
                self.tickLabelRotate = value;
                break;
            case "tickLabelRotation":
                self.tickLabelRotation = value;
                break;
            case "ticsM":
                self.ticsM.configure(value);
                break;
            case "tics":
                self.tics.configure(value);
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
    this.workspace.crossedAtZero = null;
    this.workspace.minUsed = null;
    this.workspace.maxUsed = null;
    this.workspace.minFinal = null;
    this.workspace.maxFinal = null;
    this.workspace.minHard = this.min;
    this.workspace.maxHard = this.max;
    this.workspace.logFinal = this.logarithmic;
    this.workspace.rangeFinalised = false;
    this.workspace.pixel_len_major_ticks = null;
    this.workspace.pixel_len_minor_ticks = null;
    this.workspace.axisName = null;
    this.workspace.canvasId = null;
    this.workspace.mode0BackPropagated = false;
    this.workspace.axisLabelFinal = null;
    this.workspace.tickListFinal = null;

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
        source.ticking_allocator.process();
    }

    for (var index = chain.length - 2; index >= 0; index--) {
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
            axis.ticking_allocator.process();
        }
    }
};

/**
 * render - Draw an axis onto the canvas
 * @param page {JSPlot_Canvas} - The canvas page we are drawing this graph onto
 * @param graph {JSPlot_Graph} - The graph this axis belongs to
 * @param axis_name {string} - The name of this axis, e.g. 'x1'
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
JSPlot_Axis.prototype.render = function (page, graph, axis_name, right_side, x0, y0, z0, x1, y1, z1, tick_thetas, label) {
    // Stroke line of axis
    var arrow_renderer = new JSPlot_DrawArrow();
    arrow_renderer.primitive_arrow(page, this.arrowType,
        x0, y0, z0, x1, y1, z1,
        graph.axesColor, page.settings.EPS_AXES_LINEWIDTH, 0)
};

// Interactivity

/**
 * interactive_scroll - Apply interactive mouse-scroll event to this axis, for example when the user clicks and drags
 * the canvas.
 * @param page {JSPlot_Canvas} - The canvas page which triggered this scroll event
 * @param offset {number} - The numerical factor by which the canvas has been dragged, in units of the length of the
 * axis.
 */
JSPlot_Axis.prototype.interactive_scroll = function (page, offset) {
    if (this.scrollEnabled && (this.workspace.minFinal !== null) && (this.workspace.maxFinal !== null)) {
        // If the span of the axis is not defined, take it from the current automatic scaling
        if (this.scrollSpan === null) {
            if (!this.logarithmic) {
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
        if (!this.logarithmic) {
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
 */
JSPlot_Axis.prototype.interactive_zoom = function (page, delta) {
    /** @type {number} */
    var zoom_factor = 0.9;

    // Make sure scroll span is populated
    this.interactive_scroll(page, 0);

    // Apply zoom
    if (this.zoomEnabled && (this.scrollSpan !== null)) {
        if (delta > 0) {
            // Zoom in
            this.scrollSpan *= zoom_factor;
            this.interactive_scroll(page, -(1 - zoom_factor) / 2);
        } else {
            // Zoom out
            this.scrollSpan /= zoom_factor;

            // Make sure we have not zoomed out beyond allowed range
            if ((this.scrollMin !== null) && (this.scrollMax !== null)) {
                if (!this.logarithmic) {
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
            this.interactive_scroll(page, (1 - zoom_factor) / 2);
        }

        // Refresh display
        page.needs_refresh = true;
    }
};
