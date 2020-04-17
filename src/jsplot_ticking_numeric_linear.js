// jsplot_ticking_numeric_linear.js

/**
 * JSPlot_TickingNumericLinear - A class used to place ticks along linear numeric axes
 * @param axis {JSPlot_Axis} - The axis we are to place ticks along
 * @constructor
 */
function JSPlot_TickingNumericLinear(axis) {
    /** @type {JSPlot_Axis} */
    this.axis = axis;
}

JSPlot_TickingNumericLinear.prototype.process = function () {
    /** @type {JSPlot_TickingNumericLinear} */
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
            axis_max_data = axis_min_data + 20;
        } else {
            axis_min_data = 0;
            axis_max_data = 10;
        }

        // If there's no spread of data, make a range up
        if (Math.abs(axis_max_data - axis_min_data) <= 1e-14 * Math.max(axis_min_data, axis_max_data)) {
            if (hard_min_set && hard_max_set) {
                this.axis.graph.page.workspace.errorLog += "Axis range set to zero. Ignoring manually set range.\n"
            }

            var expansion = Math.max(1, 1e-3 * Math.abs(axis_min_data));
            axis_min_data -= expansion;
            axis_max_data += expansion;
        }

        // If axis does not have a user-specified range, round it outwards to a round number
        var order_of_magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(axis_max_data - axis_min_data) / 5)))

        axis_min_data = Math.floor(axis_min_data / order_of_magnitude) * order_of_magnitude;
        axis_max_data = Math.ceil(axis_max_data / order_of_magnitude) * order_of_magnitude;

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
                        [parseFloat(tick_item[0]), ""+tick_item[1]]
                    );
                });

                // Finished
                return;
            }

            // If a tick scheme has been specified via min, max and step, use that scheme
            if (tick_list.tickStep !== null) {
                var axis_min = Math.min(self.axis.workspace.minFinal, self.axis.workspace.maxFinal);
                var axis_max = Math.min(self.axis.workspace.minFinal, self.axis.workspace.maxFinal);

                var ticks_min = tick_list.tickMin;
                if (ticks_min < axis_min) {
                    ticks_min += Math.ceil((axis_min - ticks_min) / tick_list.tickStep) * tick_list.tickStep;
                }

                // Create a maximum of 100 ticks
                for (var count=0; count<100; count++) {
                    var tick_pos = ticks_min + count * tick_list.tickStep;

                    // Stop if we've exceeded axis range
                    if (tick_pos > axis_max) {
                        break;
                    }

                    // Ensure ticks at zero display correctly
                    if (Math.abs(tick_pos) < tick_list.tickStep * 1e-12) {
                        tick_pos = 0;
                    }

                    // Add tick
                    self.axis.workspace.tickListFinal[tick_level].push(
                        [tick_pos, self.numeric_display(tick_pos)]
                    );
                }

                // Finished
                return;
            }
        })
    }
};

/**
 * Convert a number into a string, expressed to a sensible precision
 * @param input {number} - The number to turn into a string
 */
JSPlot_TickingNumericLinear.prototype.numeric_display = function (input) {

};