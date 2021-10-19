// jsplot_ticking_numeric_logarithmic.js

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
            var tick_list = index ? self.axis.ticksMinor : self.axis.ticks;

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
                var axis_max = Math.max(self.axis.workspace.minFinal, self.axis.workspace.maxFinal);

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
 * Create a list of potential schemes for placing ticks along this axis
 */
JSPlot_TickingNumericLogarithmic.prototype.ticking_schemes = function () {
    var output = [];

    // For log axes, dividing a single order of magnitude, e.g. 1 -> 10, we place N ticks at evenly-spaced intervals
    // between 1 and 10. For example, at 1, 2, 5, 10.
    var divisor = 1; // The number of ticks to place between 1 and 10
    while (true) {
        var fail = false;
        var multiplier_list = []; // List of positions where we place ticks, e.g. 1, 2, 5, 10
        var previous_value = null;

        for (var i = 0; i < divisor; i++) {
            // Work out the position of this tick
            var new_value = Math.round(Math.pow(10, i / divisor));

            // If we're creating a scheme which places two ticks at, for example, 2, reject it
            if (new_value === previous_value) {
                fail = true;
                break;
            }

            // Add this multiplier to the list
            multiplier_list.push(new_value);
            previous_value = new_value;
        }

        // Reject tick schemes which failed
        if (fail) break;

        output.push({
            'multipliers': multiplier_list,
            'tick_separation': 1,
            'offset': 0
        });

        // If we successfully fitted 2 ticks between 1 and 10, let's try 3, then 4...
        divisor++;
    }

    // For completeness, try and tick scheme where every multiplier is ticked
    output.push({
        'multipliers': [1, 2, 3, 4, 5, 6, 7, 8, 9],
        'tick_separation': 1,
        'offset': 0
    });

    return output;
};

/**
 * Assign automatically placed ticks along this axis
 * @param tick_level {string} - Either 'major' or 'minor'
 */
JSPlot_TickingNumericLogarithmic.prototype.automatic_ticking = function (tick_level) {
    /** @type {JSPlot_TickingNumericLogarithmic} */
    var self = this;

    var axis_min = Math.min(this.axis.workspace.minFinal, this.axis.workspace.maxFinal);
    var axis_max = Math.max(this.axis.workspace.minFinal, this.axis.workspace.maxFinal);

    var is_log = this.axis.workspace.logFinal && (axis_max / axis_min > 3);

    var linear_ticker = new JSPlot_TickingNumericLinear(this.axis);

    if (!is_log) {
        linear_ticker.automatic_ticking(tick_level);
        return;
    }

    var axis_min_log = Math.log10(axis_min);
    var axis_max_log = Math.log10(axis_max);

    var order_of_magnitude = Math.pow(10, Math.ceil(Math.log10(axis_max_log - axis_min_log)));
    var outer_min = Math.floor(axis_min_log / order_of_magnitude) * order_of_magnitude;
    var outer_max = Math.ceil(axis_max_log / order_of_magnitude) * order_of_magnitude;

    // Estimate how many ticks belong along this axis
    var target_tick_count = ((tick_level === 'major') ?
        this.axis.workspace.target_number_major_ticks :
        this.axis.workspace.target_number_minor_ticks);
    target_tick_count = Math.max(target_tick_count, 2);
    target_tick_count = Math.min(target_tick_count, linear_ticker.max_allowed_ticks);

    // Generate a list of candidate tick schemes for this axis
    var tick_schemes = linear_ticker.ticking_schemes(order_of_magnitude, true);

    // Try each ticking scheme in turn
    var ticking_scheme_best = [];
    var too_many_ticks = false;

    $.each(tick_schemes, function (index, tick_scheme) {
        // Once one ticking scheme has produced too many ticks, subsequent schemes will only produce more
        if (too_many_ticks) return;

        // Data structures for holding this list of ticks
        var candidate_ticking_scheme = [];
        var tick_scheme_min = outer_min + tick_scheme['offset'];

        for (var j = 0; j < (outer_max - outer_min) / tick_scheme['tick_separation'] + 2; j++) {
            if (candidate_ticking_scheme.length > linear_ticker.max_allowed_ticks) break;

            $.each(tick_scheme['multipliers'], function (index2, multiplier) {
                var x = tick_scheme_min + j * tick_scheme['tick_separation'];
                if (Math.abs(x) < 1e-8 * tick_scheme['tick_separation']) x = 0;
                x = Math.pow(10, x);
                x *= multiplier;
                if ((x < axis_min) || (x > axis_max)) return;
                candidate_ticking_scheme.push(x);
            });
        }

        // If we're allocating minor ticks, we need to ensure this scheme overlays the major ticks
        var overlay_match = true;
        if (tick_level !== 'major') {
            $.each(self.axis.workspace.tickListFinal['major'], function (index3, major_tick) {
                if (!overlay_match) return;
                var matched = false;
                $.each(candidate_ticking_scheme, function (index4, minor_tick) {
                    if (matched) return;
                    if (Math.abs(Math.log10(major_tick[0] / minor_tick)) / (axis_max_log - axis_min_log) < 1e-6) {
                        matched = true;
                    }
                });
                if (!matched) overlay_match = false;
            });
        }
        if (!overlay_match) return;

        // See if this ticking scheme is better than the previous best

        // Log ticking schemes with ticks at 1,2,3...10 are a special case, which are allowed three times more ticks.
        if ((tick_level !== 'major') && (tick_scheme['multipliers'].length === 10)) {
            if (candidate_ticking_scheme.length > target_tick_count * 3) {
                too_many_ticks = true;
                return;
            } else {
                ticking_scheme_best = candidate_ticking_scheme;
                return;
            }
        }

        // Other log ticking schemes are also a special case, as we don't set <too_many_ticks> if they fail. This is
        // because they will be followed by a scheme where all of 1,2,3...10 are ticked, which may be accepted.
        if (tick_scheme['multipliers'].length > 1) {
            if (candidate_ticking_scheme.length > target_tick_count) {
                return;
            } else {
                ticking_scheme_best = candidate_ticking_scheme;
                return;
            }
        }

        // Linear ticking schemes only introduce more ticks in successive schemes, so if this scheme has too many
        // ticks, we don't need to trial any more schemes.
        if (candidate_ticking_scheme.length > target_tick_count) {
            too_many_ticks = true;
        } else {
            ticking_scheme_best = candidate_ticking_scheme;
        }
    });

    // Commit the best list of ticks we've found
    var tick_list = [];
    $.each(ticking_scheme_best, function (index, tick_value) {
        tick_list.push([tick_value, linear_ticker.numeric_display(tick_value)])
    });
    this.axis.workspace.tickListFinal[tick_level] = tick_list;
};
