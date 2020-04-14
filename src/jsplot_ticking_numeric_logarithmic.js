// jsplot_ticking_numeric_logarithmic.js

/**
 * JSPlot_TickingNumericLogarithmic - A class used to place ticks along logarithmic numeric axes
 * @param axis {JSPlot_Axis} - The axis we are to place ticks along
 * @constructor
 */
function JSPlot_TickingNumericLogarithmic(axis) {
    /** @type {JSPlot_Axis} */
    this.axis = axis;
}

JSPlot_TickingNumericLogarithmic.prototype.process = function () {
    // Fix the axis range
    if (!this.axis.workspace.rangeFinalised) {
        /** @type {boolean} */
        var hard_min_set = (this.axis.workspace.minHard !== null);
        /** @type {boolean} */
        var hard_max_set = (this.axis.workspace.maxHard !== null);

        /** @type {?number} */
        var axis_min_data = null, axis_max_data = null;

        if (hard_min_set) {
            axis_min_data = this.axis.workspace.minHard;
        } else if (this.axis.workspace.minUsed !== null) {
            axis_min_data = this.axis.workspace.minUsed;
        }

        if (hard_max_set) {
            axis_max_data = this.axis.workspace.maxHard;
        } else if (this.axis.workspace.maxUsed !== null) {
            axis_max_data = this.axis.workspace.maxUsed;
        } else if (axis_min_data !== null) {
            axis_max_data = axis_min_data * 100;
        } else {
            axis_min_data = 1;
            axis_max_data = 10;
        }

        // Check that log axis doesn't venture too close to zero
        if (axis_min_data <= 1e-200) {
            this.axis.graph.page.workspace.errorLog += "Logarithmic axis range with range set below zero.\n";
            axis_min_data = 1e-10;
        }
        if (axis_max_data <= 1e-200) {
            this.axis.graph.page.workspace.errorLog += "Logarithmic axis range with range set below zero.\n";
            axis_max_data = 1e-10;
        }

        // If there's no spread of data, make a range up
        if (Math.abs(axis_max_data - axis_min_data) <= 1e-14 * Math.max(axis_min_data, axis_max_data)) {
            if (hard_min_set && hard_max_set) {
                this.axis.graph.page.workspace.errorLog += "Axis range set to zero. Ignoring manually set range.\n";
            }
            if (axis_min_data > 1e-300) axis_min_data /= 10;
            if (axis_max_data < 1e300) axis_max_data *= 10;
        }

        // If axis does not have a user-specified range, round it outwards to a round number
        axis_min_data = Math.log10(axis_min_data);
        axis_max_data = Math.log10(axis_max_data);

        var order_of_magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(axis_max_data - axis_min_data) / 5)))

        axis_min_data = Math.floor(axis_min_data / order_of_magnitude) * order_of_magnitude;
        axis_max_data = Math.ceil(axis_max_data / order_of_magnitude) * order_of_magnitude;

        axis_min_data = Math.pow(10, axis_min_data);
        axis_max_data = Math.pow(10,axis_max_data);

        this.axis.workspace.minFinal = hard_min_set ? this.axis.workspace.minHard : axis_min_data;
        this.axis.workspace.maxFinal = hard_max_set ? this.axis.workspace.maxHard : axis_max_data;

        // If range is reversed, do this now
        if (this.axis.rangeReversed) {
            var tmp = this.axis.workspace.minFinal;
            this.axis.workspace.maxFinal = this.axis.workspace.minFinal;
            this.axis.workspace.minFinal = tmp;
        }

        // Range is now finalised
        this.axis.workspace.rangeFinalised = true;
    }
};
