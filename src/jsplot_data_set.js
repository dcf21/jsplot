// jsplot_data_set.js

// -------------------------------------------------
// Copyright 2020-2021 Dominic Ford.

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
 * JSPlot_DataSet - A class representing a single data set to be plotted on a graph.
 * @param title {string} - The text to display in the graph's legend next to this data set
 * @param styling {Object} - Settings to associate with the JSPlot_PlotStyle to associate with this data set
 * @param data {Array<Array<number>>} - The data to be plotted, as a list of rows, each represented as a list of columns
 * @param update_callback {function} - An optional callback function which we call if the axis ranges ever change
 * @constructor
 */
function JSPlot_DataSet(title, styling, data, update_callback) {
    /** @type {string} */
    this.title = title; // Title for this data set to put into the graph legend
    /** @type {JSPlot_PlotStyle} */
    this.style = new JSPlot_PlotStyle(styling); // Styling for this data set
    /** @type {Object.<number, string>} */
    this.axes = {1: 'x1', 2: 'y1', 3: 'z1'}; // Which axes do we plot this data set against?
    /** @type {Array<Array<number>>} */
    this.data = data;
    /** @type {?function} */
    this.update_callback = update_callback;
    this.cleanWorkspace();
}

/**
 * cleanWorkspace - Create a clean workspace to be used for plotting this data set
 */
JSPlot_DataSet.prototype.cleanWorkspace = function () {
    this.workspace = {};
    /** @type {?JSPlot_PlotStyle} */
    this.workspace.styleFinal = null;
    /** @type {?number} */
    this.workspace.requiredColumns = null;
};

/**
 * axisRangeUpdated - Called when the parent graph's axis ranges are updated
 * @param new_x_min {number} - The new lower-limit of the x-axis
 * @param new_x_max {number} - The new upper-limit of the x-axis
 */
JSPlot_DataSet.prototype.axisRangeUpdated = function (new_x_min, new_x_max) {
    if (typeof this.update_callback === 'function') {
        this.update_callback(this, new_x_min, new_x_max)
    }
}