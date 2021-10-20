// jsplot_function_evaluator.js

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
 * JSPlot_FunctionEvaluator - Evaluate a list of functions to create columns of data in a <JSPlot_DataSet>.
 * @param title {string} - Text to display next to this item in the graph legend
 * @param styling {Object} - Settings to associate with the JSPlot_PlotStyle to associate with this data set
 * @param functions {Array<function>} - The list of functions to be evaluated in each column of the <JSPlot_DataSet>
 * @constructor
 */
function JSPlot_FunctionEvaluator(title, styling, functions) {
    this.title = title;
    this.styling = styling;
    this.functions = functions;
}

/**
 * evaluate_linear_raster - Evaluate the functions on a linearly-spaced raster of <point_count> points.
 * @param x_min {number} - The lower limit of the values of x to evaluate
 * @param x_max {number} - The upper limit of the values of x to evaluate
 * @param point_count {number} - The number of rows that the output data set should contain
 * @param auto_update {boolean} - Should this function evaluation be automatically recomputed if user scrolls the graph?
 */
JSPlot_FunctionEvaluator.prototype.evaluate_linear_raster = function (x_min, x_max, point_count, auto_update) {
    /** @type {JSPlot_FunctionEvaluator} */
    var self = this;

    /**
     * compute_data - Compute data to put inside dataset
     * @param x_min {number} - The lower limit of the values of x to evaluate
     * @param x_max {number} - The upper limit of the values of x to evaluate
     * @returns {[]}
     */
    var compute_data = function (x_min, x_max) {
        var data = [];
        for (var i = 0; i < point_count; i++) {
            var x = x_min + (x_max - x_min) / (point_count - 1) * i;
            var point = [x];
            for (var j = 0; j < self.functions.length; j++) {
                point.push(self.functions[j](x));
            }
            data.push(point);
        }
        return data;
    }

    /**
     * auto_update_range - Callback function which recomputes the data set in the event of the user changing axis limits
     * @param data_set {JSPlot_DataSet} - The data set to update
     * @param new_x_min {number} - The lower limit of the values of x to evaluate
     * @param new_x_max {number} - The upper limit of the values of x to evaluate
     */
    var auto_update_range = function (data_set, new_x_min, new_x_max) {
        if (auto_update) data_set.data = compute_data(new_x_min, new_x_max);
    }

    return new JSPlot_DataSet(this.title, this.styling, compute_data(x_min, x_max), auto_update_range);
};

/**
 * evaluate_linear_raster - Evaluate the functions on a logarithmically-spaced raster of <point_count> points.
 * @param x_min {number} - The lower limit of the values of x to evaluate
 * @param x_max {number} - The upper limit of the values of x to evaluate
 * @param point_count {number} - The number of rows that the output data set should contain
 * @param auto_update {boolean} - Should this function evaluation be automatically recomputed if user scrolls the graph?
 */
JSPlot_FunctionEvaluator.prototype.evaluate_log_raster = function (x_min, x_max, point_count, auto_update) {
    /** @type {JSPlot_FunctionEvaluator} */
    var self = this;

    /**
     * compute_data - Compute data to put inside dataset
     * @param x_min {number} - The lower limit of the values of x to evaluate
     * @param x_max {number} - The upper limit of the values of x to evaluate
     * @returns {[]}
     */
    var compute_data = function (x_min, x_max) {
        var data = [];
        for (var i = 0; i < point_count; i++) {
            var x = x_min * Math.pow(x_max / x_min, i / (point_count - 1));
            var point = [x];
            for (var j = 0; j < self.functions.length; j++) {
                point.push(self.functions[j](x));
            }
            data.push(point);
        }
        return data;
    }

    /**
     * auto_update_range - Callback function which recomputes the data set in the event of the user changing axis limits
     * @param data_set {JSPlot_DataSet} - The data set to update
     * @param new_x_min {number} - The lower limit of the values of x to evaluate
     * @param new_x_max {number} - The upper limit of the values of x to evaluate
     */
    var auto_update_range = function (data_set, new_x_min, new_x_max) {
        if (auto_update) data_set.data = compute_data(new_x_min, new_x_max);
    }

    return new JSPlot_DataSet(this.title, this.styling, compute_data(x_min, x_max), auto_update_range);
};

/**
 * evaluate_over_grid - Evaluate the functions on a linearly-spaced grid raster of <point_count> points.
 * @param x_min {number} - The lower limit of the values of x to evaluate
 * @param x_max {number} - The upper limit of the values of x to evaluate
 * @param point_count_x {number} - The number of rows that the output data set should contain along x axis
 * @param y_min {number} - The lower limit of the values of y to evaluate
 * @param y_max {number} - The upper limit of the values of y to evaluate
 * @param point_count_y {number} - The number of rows that the output data set should contain along y axis
 */
JSPlot_FunctionEvaluator.prototype.evaluate_over_grid = function (x_min, x_max, point_count_x,
                                                                  y_min, y_max, point_count_y) {
    /** @type {JSPlot_FunctionEvaluator} */
    var self = this;

    // Loop over grid of data points evaluating the supplied functions
    var data = [];
    for (var i = 0; i < point_count_x; i++) {
        for (var j = 0; j < point_count_y; j++) {
            var x = x_min + (x_max - x_min) / (point_count_x - 1) * i;
            var y = y_min + (y_max - y_min) / (point_count_y - 1) * j;
            var point = [x, y];
            for (var k = 0; k < self.functions.length; k++) {
                point.push(self.functions[k](x, y));
            }
            data.push(point);
        }
    }

    var data_set = new JSPlot_DataSet(this.title, this.styling, data, null);
    data_set.grid = true;
    data_set.grid_dimensions = [point_count_x, point_count_y];

    return data_set;
};
