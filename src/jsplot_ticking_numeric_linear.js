// jsplot_ticking_numeric_linear.js

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
 * JSPlot_TickingNumericLinear - A class used to place ticks along linear numeric axes
 * @param axis {JSPlot_Axis} - The axis we are to place ticks along
 * @constructor
 */
function JSPlot_TickingNumericLinear(axis) {
    /** @type {JSPlot_Axis} */
    this.axis = axis;
    this.max_allowed_ticks = 256;
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
                var axis_min = Math.min(self.axis.workspace.minFinal, self.axis.workspace.maxFinal);
                var axis_max = Math.max(self.axis.workspace.minFinal, self.axis.workspace.maxFinal);

                var ticks_min = tick_list.tickMin;
                if (ticks_min < axis_min) {
                    ticks_min += Math.ceil((axis_min - ticks_min) / tick_list.tickStep) * tick_list.tickStep;
                }

                // Create a maximum of 100 ticks
                for (var count = 0; count < 100; count++) {
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

            // Automatic ticking
            self.automatic_ticking(tick_level);
        });
    }
};

/**
 * Create a list of potential schemes for placing ticks along this axis
 */
JSPlot_TickingNumericLinear.prototype.ticking_schemes = function (order_of_magnitude, is_log) {
    // The maximum number of ticks allowed along any axis
    var ticks_maximum = 256;

    // How many orders of magnitude within the span of the axis have we descended?
    var level_descend = 0;

    // List of potential ticking schemes (each representing a particular spacing of ticks)
    var output = [];

    // Factors of 100. We can divide the span 0-1 into divisions of 0.01, 0.02, 0.04, etc
    var factor_multiply = 2;
    var factors = [1, 2, 4, 5, 10, 20, 25, 50, 100];
    var n_factors = factors.length;

    // Repeatedly descend into 10 times more detail along the axis
    while (Math.pow(10, level_descend) < 10 * ticks_maximum) {
        // The current order of magnitude which we are sub-dividing
        var order_magnitude_scan = order_of_magnitude / Math.pow(10, level_descend);

        if (is_log && (order_magnitude_scan < 0.9)) {
            // For logarithmic axis, if we are sub-dividing a single order of magnitude, do so by putting ticks at
            // evenly spaced intervals - for example at 1, 2, 5, 10. But if we are dividing many orders of magnitude
            // we tick the axis like a linear axis, but with linear steps in the exponent
            var log_ticker = new JSPlot_TickingNumericLogarithmic(this.axis);
            output = output.concat(log_ticker.ticking_schemes());
            break;
        } else {
            // Loop over each factor we can use to divide this order of magnitude
            for (var i = n_factors - 1; i >= 0; i--) {
                var tick_separation = factors[i] * order_magnitude_scan / Math.pow(10, factor_multiply);

                // Don't allow fractional steps finer than one order-of-magnitude on log axes
                if (is_log && (Math.abs(Math.round(tick_separation) - tick_separation)) > 1e-6) continue;

                // Data structure representing this ticking scheme
                output.push({
                    'multipliers': [1],
                    'tick_separation': tick_separation,
                    'offset': 0
                })
            }
        }

        // Next order of magnitude
        level_descend++;
    }

    return output;
};

/**
 * Assign automatically placed ticks along this axis
 * @param tick_level {string} - Either 'major' or 'minor'
 */
JSPlot_TickingNumericLinear.prototype.automatic_ticking = function (tick_level) {
    /** @type {JSPlot_TickingNumericLinear} */
    var self = this;

    var axis_min = Math.min(this.axis.workspace.minFinal, this.axis.workspace.maxFinal);
    var axis_max = Math.max(this.axis.workspace.minFinal, this.axis.workspace.maxFinal);

    var order_of_magnitude = Math.pow(10, Math.ceil(Math.log10(axis_max - axis_min)));
    var outer_min = Math.floor(axis_min / order_of_magnitude) * order_of_magnitude;
    var outer_max = Math.ceil(axis_max / order_of_magnitude) * order_of_magnitude;

    // Estimate how many ticks belong along this axis
    var target_tick_count = ((tick_level === 'major') ?
        this.axis.workspace.target_number_major_ticks :
        this.axis.workspace.target_number_minor_ticks);
    target_tick_count = Math.max(target_tick_count, 2);
    target_tick_count = Math.min(target_tick_count, this.max_allowed_ticks);

    // Generate a list of candidate tick schemes for this axis
    var tick_schemes = this.ticking_schemes(order_of_magnitude, false);

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
            if (candidate_ticking_scheme.length > self.max_allowed_ticks) break;

            $.each(tick_scheme['multipliers'], function (index2, multiplier) {
                var x = tick_scheme_min + j * tick_scheme['tick_separation'];
                if (Math.abs(x) < 1e-8 * tick_scheme['tick_separation']) x = 0;
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
                    if (Math.abs(major_tick[0] - minor_tick) / (axis_max - axis_min) < 1e-6) {
                        matched = true;
                    }
                });
                if (!matched) overlay_match = false;
            });
        }
        if (!overlay_match) return;

        // See if this ticking scheme is better than the previous best

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
        tick_list.push([tick_value, self.numeric_display(tick_value)])
    });
    this.axis.workspace.tickListFinal[tick_level] = tick_list;
};


/**
 * Convert a number into a string, expressed to a sensible precision
 * @param input {number} - The number to turn into a string
 */
JSPlot_TickingNumericLinear.prototype.numeric_display = function (input) {
    /** @type {number} */
    var x, required_accuracy, max_decimals;
    /** @type {number} */
    var significant_figures = 8;
    /** @type {string} */
    var output;

    // Treat zero as a special case
    if (input === 0) {
        return "0";
    }

    // Display numbers between 1e5 and 1e-3 in %f format
    if ((Math.abs(input) < 1e5) && (Math.abs(input) > 1e-3)) {
        x = Math.abs(input);
        required_accuracy = Math.pow(10, -significant_figures);
        max_decimals = significant_figures - Math.log10(x);

        // Work out how many decimal places are needed to convey this number to required significant figures
        for (var decimal_place = 0; decimal_place < max_decimals; decimal_place++) {
            var rounded_value = Math.round(x * Math.pow(10, decimal_place)) / Math.pow(10, decimal_place);
            var error_ratio = Math.abs(rounded_value - x) / x;

            if (error_ratio < required_accuracy) {
                break;
            }
        }

        // Return result in the %f string format
        output = input.toFixed(decimal_place);
        output = output.replace("-", "–"); // Render minus signs as &ndash;
        return output;
    }

    // Display number in scientific format
    x = Math.abs(input);
    x /= Math.pow(10, Math.floor(Math.log10(x)));
    accuracy = x * (1.0 + Math.pow(10, -significant_figures));

    // Work out how many decimal places are needed to convey this number to required significant figures
    for (decimal_place = 0; decimal_place < significant_figures; decimal_place++) {
        if ((x - ((Math.floor(x * Math.pow(10, decimal_place)) / Math.pow(10, decimal_place)) - x)) < accuracy) {
            break;
        }
    }

    // Return result in the %e string format
    output = input.toExponential(decimal_place);

    // If we have trailing decimal zeros, get rid of them

    // Search for decimal point in number
    var i = 0;
    while ((i < output.length) && (output.charAt(i) !== '.') && (output.charAt(i) !== 'e')) i++;
    if ((output.charAt(i) !== '.') && (output.charAt(i) !== 'e')) {
        return output;
    }

    // Then search through subsequent decimal digits
    var j = i;
    if (output.charAt(i) === '.') j++;
    while (!isNaN(output.charAt(j))) j++;

    // Convert exponential character into a nice UTF-8 string
    var output_1 = output.substr(0, j);
    if (output.charAt(j + 1) === "+") j++;
    var output_2_in = output.substr(j + 1, output.length - j - 1);
    var output_2 = "×10" + this.superscript(output_2_in);

    // Render minus signs as &ndash;
    output_1 = output_1.replace("-", "–");

    // Now work backwards through any trailing zeros in the decimal digits
    var k = j - 1;
    while ((k > i) && (output_1.charAt(k) === '0')) k--;

    // Remove trailing zeros
    output_1 = output_1.substr(0, k + 1);

    // Remove trailing decimal point, if present
    if (output_1.charAt(output_1.length - 1) === '.') {
        output_1 = output_1.substr(0, output_1.length - 1);
    }

    // Remove 1× from the beginning of 1×10²
    output = output_1 + output_2;
    if (output.substr(0,2) === "1×") {
        output = output.substr(2, output.length-2);
    }

    return output;
};

/**
 * Convert a string into a UTF-8 string of superscript characters
 * @param input {string} - The string to render into superscript characters
 */
JSPlot_TickingNumericLinear.prototype.superscript = function (input) {
    var superscript_mapping = {
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹',
        '+': '⁺',
        '-': '⁻',
        'a': 'ᵃ',
        'b': 'ᵇ',
        'c': 'ᶜ',
        'd': 'ᵈ',
        'e': 'ᵉ',
        'f': 'ᶠ',
        'g': 'ᵍ',
        'h': 'ʰ',
        'i': 'ⁱ',
        'j': 'ʲ',
        'k': 'ᵏ',
        'l': 'ˡ',
        'm': 'ᵐ',
        'n': 'ⁿ',
        'o': 'ᵒ',
        'p': 'ᵖ',
        'r': 'ʳ',
        's': 'ˢ',
        't': 'ᵗ',
        'u': 'ᵘ',
        'v': 'ᵛ',
        'w': 'ʷ',
        'x': 'ˣ',
        'y': 'ʸ',
        'z': 'ᶻ'
    }

    return input.split('').map(function (c) {
        var superscipt_character = superscript_mapping[c];
        if (superscipt_character) {
            return superscipt_character;
        }
        return '';
    }).join('');
};
