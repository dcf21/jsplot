// jsplot_axis.js

/**
 * JSPlot_Axis - A class representing a graph axis
 * @param enabled {boolean} - If false, then this axis is not rendered
 * @param settings {Object} - Settings for this axis
 * @constructor
 */
function JSPlot_Axis(enabled, settings) {
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
    this.log = false;
    /** @type {?number} */
    this.min = null;
    /** @type {?number} */
    this.max = null;
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
    /** @type {?string} */
    this.label = null;
    this.ticsM = new JSPlot_AxisTics({});
    this.tics = new JSPlot_AxisTics({});
    this.configure(settings);

    this.cleanWorkspace();
}

/**
 * configure - Configure settings for a graph axis
 * @param settings {Object} - An object containing settings
 */
JSPlot_Axis.prototype.configure = function (settings) {
    $.each(settings, function (key, value) {
        switch (key) {
            case "atZero":
                this.atZero = value;
                break;
            case "enabled":
                this.enabled = value;
                break;
            case "visible":
                this.visible = value;
                break;
            case "linkTo":
                this.linkTo = value;
                break;
            case "rangeReversed":
                this.rangeReversed = value;
                break;
            case "arrowType":
                this.arrowType = value;
                break;
            case "log":
                this.log = value;
                break;
            case "min":
                this.min = value;
                break;
            case "max":
                this.max = value;
                break;
            case "scrollEnabled":
                this.scrollEnabled = value;
                break;
            case "scrollMin":
                this.scrollMin = value;
                break;
            case "scrollMax":
                this.scrollMax = value;
                break;
            case "scrollSpan":
                this.scrollSpan = value;
                break;
            case "zoomEnabled":
                this.zoomEnabled = value;
                break;
            case "mirror":
                this.mirror = value;
                break;
            case "tickLabelRotation":
                this.tickLabelRotation = value;
                break;
            case "labelRotate":
                this.labelRotate = value;
                break;
            case "tickLabelRotate":
                this.tickLabelRotate = value;
                break;
            case "label":
                this.label = value;
                break;
            case "ticsM":
                this.ticsM.configure(value);
                break;
            case "tics":
                this.tics.configure(value);
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
    this.workspace.logFinal = this.log;
    this.workspace.rangeFinalised = null;
    this.workspace.activeFinal = null;
    this.workspace.pixel_len_major_ticks = null;
    this.workspace.pixel_len_minor_ticks = null;
    this.workspace.axisName = null;
    this.workspace.canvasId = null;
    this.workspace.mode0BackPropagated = false;
    this.workspace.axisLabelFinal = null;
    this.workspace.tickListFinal = null;
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

        if (!page.itemList[source.linkTo[0]].itemType !== "graph") {
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

    if ((mode === 1) && (source.workspace.rangeFinalised)) {
        JSPlot_Ticking(source, null);
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
            axis.workspace.rangeFinalised = 1;
            JSPlot_Ticking(axis, null);
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
