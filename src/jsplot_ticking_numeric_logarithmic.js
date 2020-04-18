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
    /** @type {JSPlot_TickingNumericLogarithmic} */
    var self = this;

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
        axis_max_data = Math.pow(10, axis_max_data);

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

    // Fix the axis ticks
    if (this.axis.workspace.tickListFinal === null) {
        // Create empty data structure for ticks
        this.axis.workspace.tickListFinal = {
            'major': [],
            'minor': []
        }

        // Allocate major ticks first, and then minor ticks
        $.each(['major', 'minor'], function (index, tick_level) {
            /** @type {JSPlot_AxisTics} */
            var tick_list = index ? self.axis.ticsM : self.axis.tics;

            // If a list of ticks has been explicitly supplied, use that
            if (tick_list.tickList !== null) {
                $.each(tick_list.tickList, function (tick_index, tick_item) {
                    self.axis.workspace.tickListFinal[tick_level].push(
                        [parseFloat(tick_item[0]), "" + tick_item[1]]
                    );
                });

                // Finished
                return;
            }

            // If a tick scheme has been specified via min, max and step, use that scheme
            if (tick_list.tickStep !== null) {
                var linear_ticker = new JSPlot_TickingNumericLinear(self.axis);
                var axis_min = Math.min(self.axis.workspace.minFinal, self.axis.workspace.maxFinal);
                var axis_max = Math.min(self.axis.workspace.minFinal, self.axis.workspace.maxFinal);

                var ticks_min = tick_list.tickMin;
                if (ticks_min < axis_min) {
                    ticks_min *= Math.exp(Math.ceil(Math.log(axis_min / ticks_min) / Math.log(tick_list.tickStep)) *
                        Math.log(tick_list.tickStep));
                }

                // Create a maximum of 100 ticks
                for (var count = 0; count < 100; count++) {
                    var tick_pos = ticks_min * Math.pow(tick_list.tickStep, count);

                    // Stop if we've exceeded axis range
                    if (tick_pos > axis_max) {
                        break;
                    }

                    // Add tick
                    self.axis.workspace.tickListFinal[tick_level].push(
                        [tick_pos, linear_ticker.numeric_display(tick_pos)]
                    );
                }

                // Finished
                return;
            }

            // Automatic ticking
            self.automatic_ticking(tick_level);
        });
    }
};

/**
 * Assign automatically placed ticks along this axis
 * @param tick_level {string} - Either 'major' or 'minor'
 */
JSPlot_TickingNumericLogarithmic.prototype.automatic_ticking = function (tick_level) {

};
