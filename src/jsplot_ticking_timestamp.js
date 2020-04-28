// jsplot_ticking_timestamp.js

/**
 * JSPlot_TickingTimestamp - A class used to place ticks along timestamp axes
 * @param axis {JSPlot_Axis} - The axis we are to place ticks along
 * @constructor
 */
function JSPlot_TickingTimestamp(axis) {
    /** @type {JSPlot_Axis} */
    this.axis = axis;
    this.max_allowed_ticks = 256;

    // Acceptable intervals between ticks
    this.acceptable_intervals =
        [1, 2, 5, 10, 20, 30, 60,
            120, 300, 600, 900, 1800, 3600,
            7200, 10800, 14400, 21600, 43200, 86400,
            172800, 259200, 345600, 604800];
}

JSPlot_TickingTimestamp.prototype.process = function () {
    /** @type {JSPlot_TickingTimestamp} */
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

            var expansion = 30;  // arbitrary span of 30 seconds either side of single data point
            axis_min_data -= expansion;
            axis_max_data += expansion;
        }

        // If axis does not have a user-specified range, round it outwards
        var data_span = Math.abs(axis_max_data - axis_min_data);

        if (data_span > 3 * 365 * 86400) {
            // For spans longer than 3 years, we round axis range outwards to encompass a whole number of years
            var calendar_date_min = this.timestamp_to_calendar(axis_min_data);
            var calendar_date_max = this.timestamp_to_calendar(axis_max_data);

            axis_min_data = this.calendar_to_timestamp(calendar_date_min[0], 1, 1, 0, 0, 0);
            axis_max_data = this.calendar_to_timestamp(calendar_date_max[0], 1, 1, 0, 0, 0);
        } else if (data_span > 90 * 86400) {
            // For spans longer than 3 months, we round axis range outwards to encompass a whole number of months
            calendar_date_min = this.timestamp_to_calendar(axis_min_data);
            calendar_date_max = this.timestamp_to_calendar(axis_max_data);

            // Find the start of the month following the one containing <calendar_date_max>
            if (calendar_date_max[1]++ > 12) {
                calendar_date_max[1] = 1;
                calendar_date_min[0]++;
            }

            axis_min_data = this.calendar_to_timestamp(calendar_date_min[0], calendar_date_min[1], 1, 0, 0, 0);
            axis_max_data = this.calendar_to_timestamp(calendar_date_max[0], calendar_date_max[1], 1, 0, 0, 0);

        } else {
            // For spans shorter than 3 months round outwards to some appropriate interval
            for (var i = 0; i < this.acceptable_intervals.length; i++) {
                if (this.acceptable_intervals[i] > Math.abs(axis_max_data - axis_min_data)) {
                    break;
                }
            }
            i = Math.min(0, i - 2);

            axis_min_data = Math.floor(axis_min_data / this.acceptable_intervals[i]) * this.acceptable_intervals[i];
            axis_max_data = Math.ceil(axis_max_data / this.acceptable_intervals[i]) * this.acceptable_intervals[i];
        }

        // Set final range of axis
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
                        [tick_pos, self.date_display(tick_pos, true, true, true, true)]
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
    /** @type {JSPlot_TickingTimestamp} */
    var self = this;

    var axis_min = Math.min(this.axis.workspace.minFinal, this.axis.workspace.maxFinal);
    var axis_max = Math.max(this.axis.workspace.minFinal, this.axis.workspace.maxFinal);

    // Estimate how many ticks belong along this axis
    var target_tick_count = ((tick_level === 'major') ?
        this.axis.workspace.target_number_major_ticks :
        this.axis.workspace.target_number_minor_ticks);
    target_tick_count = Math.max(target_tick_count, 2);
    target_tick_count = Math.min(target_tick_count, this.max_allowed_ticks);

    // Generate a list of candidate tick schemes for this axis
    var tick_schemes = [
        {'year_step': 1000},
        {'year_step': 500},
        {'year_step': 250},
        {'year_step': 200},
        {'year_step': 100},
        {'year_step': 50},
        {'year_step': 25},
        {'year_step': 20},
        {'year_step': 10},
        {'year_step': 5},
        {'year_step': 2},
        {'year_step': 1},
        {'month_step': 6},
        {'month_step': 4},
        {'month_step': 3},
        {'month_step': 2},
        {'month_step': 1},
    ]

    // Add candidate tick schemes where ticks are placed at fixed time intervals, not fixed calendar dates
    for (var i = this.acceptable_intervals.length - 1; i >= 0; i--) {
        tick_schemes.push({'tick_interval': this.acceptable_intervals[i]});
    }

    // Try each ticking scheme in turn
    var ticking_scheme_best = [[], null];
    var too_many_ticks = false;

    $.each(tick_schemes, function (index, tick_scheme) {
        // Once one ticking scheme has produced too many ticks, subsequent schemes will only produce more
        if (too_many_ticks) return;

        // Data structures for holding this list of ticks
        var candidate_ticking_scheme = [[], null];

        // Start realising this ticking scheme
        if (tick_scheme.hasOwnProperty('year_step')) {
            var year_min = self.timestamp_to_calendar(axis_min)[0];
            var year_max = self.timestamp_to_calendar(axis_max)[0];

            year_min = Math.floor(year_min / tick_scheme['year_step']) * tick_scheme['year_step'];

            for (var year = year_min; year <= year_max; year += tick_scheme['year_step']) {
                if (candidate_ticking_scheme[0].length > self.max_allowed_ticks) break;
                var timestamp = self.calendar_to_timestamp(year, 1, 1, 0, 0, 0);
                if ((timestamp < axis_min) || (timestamp > axis_max)) continue;
                candidate_ticking_scheme[0].push([
                    timestamp,
                    self.date_display(timestamp, true, false, false, false, false)
                ]);
            }
        } else if (tick_scheme.hasOwnProperty('month_step')) {
            var calendar_min = self.timestamp_to_calendar(axis_min);
            var calendar_max = self.timestamp_to_calendar(axis_max);
            var month_min = calendar_min[0] * 12 + calendar_min[1] - 1;
            var month_max = calendar_max[0] * 12 + calendar_max[1] - 1;

            month_min = Math.floor(month_min / tick_scheme['month_step']) * tick_scheme['month_step'];

            for (var month = month_min; month <= month_max; month += tick_scheme['month_step']) {
                if (candidate_ticking_scheme[0].length > self.max_allowed_ticks) break;
                timestamp = self.calendar_to_timestamp(Math.floor(month / 12), (month % 12) + 1, 1, 0, 0, 0);
                if ((timestamp < axis_min) || (timestamp > axis_max)) continue;
                candidate_ticking_scheme[0].push([
                    timestamp,
                    self.date_display(timestamp, (month % 12) === 0, true, false, false, false)
                ]);
            }
        } else {
            var interval = tick_scheme['tick_interval'];
            var show_year = (interval > 28 * 86400);
            var show_date = (interval > 7200);
            var tick_scheme_min = Math.floor(axis_min / interval) * interval;

            for (timestamp = tick_scheme_min; timestamp <= axis_max; timestamp += interval) {
                if (candidate_ticking_scheme[0].length > self.max_allowed_ticks) break;
                if ((timestamp < axis_min) || (timestamp > axis_max)) continue;

                candidate_ticking_scheme[0].push([
                    timestamp,
                    self.date_display(timestamp, show_year, show_date, show_date, (interval < 86400), (interval < 60))
                ]);
            }

            candidate_ticking_scheme[1] = function () {
                var year_min = self.date_display(axis_min, true, false, false, false, false);
                var year_max = self.date_display(axis_max, true, false, false, false, false);

                var date_min = self.date_display(axis_min, false, true, true, false, false);
                var date_max = self.date_display(axis_max, false, true, true, false, false);

                if (!show_date) {
                    if (year_max !== year_min) {
                        return date_min + " " + year_min + " – " + date_max + " " + year_max;
                    } else if (date_max !== date_min) {
                        return date_min + " – " + date_max + year_max;
                    } else {
                        return date_min + year_min;
                    }
                } else if (!show_year) {
                    if (year_max !== year_min) {
                        return year_min + " – " + year_max;
                    } else {
                        return year_min;
                    }
                } else {
                    return null;
                }
            }
        }

        // If we're allocating minor ticks, we need to ensure this scheme overlays the major ticks
        var overlay_match = true;
        if (tick_level !== 'major') {
            $.each(self.axis.workspace.tickListFinal['major'], function (index3, major_tick) {
                if (!overlay_match) return;
                var matched = false;
                $.each(candidate_ticking_scheme[0], function (index4, minor_tick) {
                    if (matched) return;
                    if (Math.abs(major_tick[0] - minor_tick[0]) < 1e-2) {
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
        if (candidate_ticking_scheme[0].length > target_tick_count) {
            too_many_ticks = true;
        } else {
            ticking_scheme_best = candidate_ticking_scheme;
        }
    });

    // Commit the best list of ticks we've found
    this.axis.workspace.tickListFinal[tick_level] = ticking_scheme_best[0];

    // Run callback function of the ticking scheme we accepted, which may append some text to the text label
    if ((tick_level === 'major') && (ticking_scheme_best[1] !== null)) {
        var label_suffix = ticking_scheme_best[1]();
        if (label_suffix !== null) {
            if ((this.axis.workspace.labelFinal === null) || (this.axis.workspace.labelFinal.length === 0)) {
                this.axis.workspace.labelFinal = label_suffix;
            } else {
                this.axis.workspace.labelFinal += ", within " + label_suffix;
            }
        }
    }
};

/**
 * date_display - convert a unix time into a string representation
 * @param timestamp {number} - The unix time to render
 * @param include_year {boolean} - Should the date string include the year?
 * @param include_month {boolean} - Should the date string include the month?
 * @param include_day {boolean} - Should the date string include the day?
 * @param include_time {boolean} - Should the date string include the time?
 * @param include_seconds {boolean} - Should the date string include the seconds?
 * @return {string} - A textual representation of the supplied unix timestamp
 */
JSPlot_TickingTimestamp.prototype.date_display = function (timestamp, include_year,
                                                           include_month, include_day,
                                                           include_time, include_seconds) {
    var month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Add a millisecond offset to input timestamp, to ensure data points at midnight round correctly
    var date = this.timestamp_to_calendar(timestamp + 1e-3);
    var output = "";

    if (include_day) {
        output += date[2] + " " + month_names[date[1] - 1] + " ";
    } else if (include_month) {
        output += month_names[date[1] - 1] + " ";
    }

    if (include_year) {
        output += date[0] + " ";
    }

    if (include_time) {
        output += padStr(date[3]) + ":" + padStr(date[4]);
    }

    if (include_seconds) {
        output += ":" + padStr(date[5].toFixed(0));
    }

    return output
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
