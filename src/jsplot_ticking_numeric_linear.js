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
                        [parseFloat(tick_item[0]), "" + tick_item[1]]
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
        });
    }
};

/**
 * Convert a number into a string, expressed to a sensible precision
 * @param input {number} - The number to turn into a string
 */
JSPlot_TickingNumericLinear.prototype.numeric_display = function (input) {
    /** @type {number} */
    var x, accuracy, max_decimals;
    /** @type {number} */
    var significant_figures = 8;
    /** @type {string} */
    var output;

    // Treat zero as a special case
    if (input === 0) {
        return "0";
    }

    // Display numbers between 1e10 and 1e-3 in %f format
    if ((Math.abs(input) < 1e10) && (Math.abs(input) > 1e-3)) {
        x = Math.abs(input);
        accuracy = x * (1.0 + Math.pow(10, -significant_figures));
        max_decimals = significant_figures - Math.log10(x);

        // Work out how many decimal places are needed to convey this number to required significant figures
        for (var decimal_place = 0; decimal_place < max_decimals; decimal_place++) {
            if ((x - ((Math.floor(x * Math.pow(10, decimal_place)) / Math.pow(10, decimal_place)) - x)) < accuracy) {
                break;
            }
        }

        // Return result in the %f string format
        return input.toFixed(decimal_place);
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
    while ((i < output.length) && (output.charAt(i) !== '.')) i++;
    if (output.charAt(i) !== '.') {
        return output;
    }

    // Then search through subsequent decimal digits
    var j = i + 1;
    while (!isNaN(output.charAt(j))) j++;

    // Convert exponential character into a nice UTF-8 string
    output = output.substr(0, j - 1) + "×10" + this.superscript(output.substr(j + 1, output.length - j - 1));

    // If we found no decimal digits, don't need to remove any trailing zeros
    if (i === j) {
        return output;
    }

    // Now work backwards through any trailing zeros in the decimal digits
    var k = j - 1;
    while (output[k] === '0') k--;
    if (k === i) k--;
    k++;

    // If there were no, no need to remove trailing digits
    if (k === j) {
        return output;
    }

    // Remove trailing zeros
    return output.substr(0, k) + output.substr(j, output.length - j);
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
