// jsplot_ticking_timestamp.js

/**
 * JSPlot_TickingTimestamp - A class used to place ticks along timestamp axes
 * @param axis {JSPlot_Axis} - The axis we are to place ticks along
 * @constructor
 */
function JSPlot_TickingTimestamp(axis) {
    /** @type {JSPlot_Axis} */
    this.axis = axis;
}

JSPlot_TickingTimestamp.prototype.process = function () {
    /** @type {JSPlot_TickingTimestamp} */
    var self = this;

    var acceptable_intervals =
        [1, 2, 5, 10, 20, 30, 60,
            120, 300, 600, 900, 1800, 3600,
            7200, 10800, 14400, 21600, 43200, 86400,
            172800, 259200, 345600, 604800];

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
            axis_max_data = axis_min_data + 60;
        } else {
            axis_min_data = 946684800.;
            axis_max_data = 978307200.;
        }

        // If there's no spread of data, make a range up
        if (Math.abs(axis_max_data - axis_min_data) <= 1e-14 * Math.max(axis_min_data, axis_max_data)) {
            if (hard_min_set && hard_max_set) {
                this.axis.graph.page.workspace.errorLog += "Axis range set to zero. Ignoring manually set range.\n"
            }

            var expansion = 30;
            axis_min_data -= expansion;
            axis_max_data += expansion;
        }

        // If axis does not have a user-specified range, round it outwards
        for (var i = 0; i < acceptable_intervals.length; i++) {
            if (acceptable_intervals[i] > Math.abs(axis_max_data - axis_min_data)) {
                break;
            }
        }
        i = Math.min(0, i - 2);

        axis_min_data = Math.floor(axis_min_data / acceptable_intervals[i]) * acceptable_intervals[i];
        axis_max_data = Math.ceil(axis_max_data / acceptable_intervals[i]) * acceptable_intervals[i];

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

                    // Add tick
                    self.axis.workspace.tickListFinal[tick_level].push(
                        [tick_pos, self.date_display(tick_pos, tick_list.tickStep)]
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
JSPlot_TickingTimestamp.prototype.automatic_ticking = function (tick_level) {

};

/**
 * date_display - convert a unix time into a string representation
 * @param timestamp {number} - The unix time to render
 * @param tick_interval {number} - The interval in seconds between the ticks we are placing along the axis
 */
JSPlot_TickingTimestamp.prototype.date_display = function (timestamp, tick_interval) {
    var month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
}

/**
 * timestamp_to_calendar - convert a unix timestamp into a calendar representation
 * @param timestamp {number} - The unix time to render
 * @returns {(number)[]}
 */
JSPlot_TickingTimestamp.prototype.timestamp_to_calendar = function (timestamp) {
    // Convert unix timestamp into Julian day number
    var JD = timestamp / 86400.0 + 2440587.5;

    // Magic due to Jean Meeus
    var dayFraction = (JD + 0.5) - Math.floor(JD + 0.5);
    var hour = Math.floor(24 * dayFraction);
    var min = Math.floor((1440 * dayFraction) % 60);
    var sec = (86400 * dayFraction) % 60;

    // Number of whole Julian days. b = Number of centuries since the Council of Nicaea. c = Julian Day number as if century leap years happened.
    var a, b, c, d, e, f, day, month, year;
    a = Math.floor(JD + 0.5);
    if (a < 2361222.0) {
        c = Math.floor(a + 1524); // Julian calendar
    } else {
        b = Math.floor((a - 1867216.25) / 36524.25);
        c = Math.floor(a + b - Math.floor(b / 4) + 1525); // Gregorian calendar
    }
    d = Math.floor((c - 122.1) / 365.25);   // Number of 365.25 periods, starting the year at the end of February
    e = Math.floor(365 * d + Math.floor(d / 4)); // Number of days accounted for by these
    f = Math.floor((c - e) / 30.6001);      // Number of 30.6001 days periods (a.k.a. months) in remainder
    day = Math.floor(c - e - Math.floor(30.6001 * f));
    month = Math.floor(f - 1 - 12 * (f >= 14 ? 1 : 0));
    year = Math.floor(d - 4715 - (month >= 3 ? 1 : 0));
    return [year, month, day, hour, min, sec];
};

/**
 * calendar_to_timestamp - convert a calendar date into a unix timestamp
 * @param year {number}
 * @param month {number}
 * @param day {number}
 * @param hour {number}
 * @param min {number}
 * @param sec {number}
 * @returns {number|*}
 */
JSPlot_TickingTimestamp.prototype.calendar_to_timestamp = function (year, month, day, hour, min, sec) {
    // Magic due to Jean Meeus
    var b, JD, dayFraction;
    var lastJulian = 17520902.0;
    var firstGregorian = 17520914.0;
    var reqDate = 10000.0 * year + 100 * month + day;

    if (month <= 2) {
        month += 12;
        year -= 1;
    }

    if (reqDate <= lastJulian) {
        b = -2 + (Math.floor(year + 4716) / 4) - 1179; // Julian calendar
    } else if (reqDate >= firstGregorian) {
        b = Math.floor(year / 400) - Math.floor(year / 100) + Math.floor(year / 4); // Gregorian calendar
    } else {
        return 0;
    }

    JD = 365.0 * Math.floor(year) - 679004.0 + 2400000.5 + b + Math.floor(30.6001 * (month + 1)) + day;
    dayFraction = (Math.abs(hour) + Math.abs(min) / 60.0 + Math.abs(sec) / 3600.0) / 24.0;
    var JD_final = JD + dayFraction;

    // Convert output from Julian day number into a unix timestamp
    return 86400.0 * (JD_final - 2440587.5);
};
