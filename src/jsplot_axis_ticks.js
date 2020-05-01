// jsplot_axis_ticks.js

// -------------------------------------------------
// Copyright 2020 Dominic Ford.

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
 * JSPlot_AxisTics - A class representing a scheme for placing ticks along a graph axis.
 * @param settings {Object} - An object containing settings
 * @constructor
 */
function JSPlot_AxisTics(settings) {
    /** @type {?string} */
    this.ticDir = null;
    /** @type {?number} */
    this.tickMin = null;
    /** @type {?number} */
    this.tickMax = null;
    /** @type {?number} */
    this.tickStep = null;
    /** @type {Array.<{0: number, 1:string}>} */
    this.tickList = null;
    this.configure(settings);
}

/**
 * configure - Configure settings for a set of axis ticks
 * @param settings {Object} - An object containing settings
 */
JSPlot_AxisTics.prototype.configure = function (settings) {
    /** @type {JSPlot_AxisTics} */
    var self = this;

    $.each(settings, function (key, value) {
        switch (key) {
            case "ticDir":
                self.ticDir = value;
                break;
            case "tickList":
                self.tickList = value;
                break;
            case "tickMin":
                self.tickMin = value;
                break;
            case "tickMax":
                self.tickMax = value;
                break;
            case "tickStep":
                self.tickStep = value;
                break;
            default:
                throw "Unrecognised axis tick setting " + key;
        }
    });
};
