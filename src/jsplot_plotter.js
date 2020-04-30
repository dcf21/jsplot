// jsplot_plotter.js

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
 * JSPlot_Plotter - A class which plots data sets onto graphs
 * @param page {JSPlot_Canvas} - The canvas that this graph is to be drawn onto
 * @param graph {JSPlot_Graph} - The graph that we are drawing data sets onto
 * @constructor
 */
function JSPlot_Plotter(page, graph) {
    /** @type {JSPlot_Canvas} */
    this.page = page;
    /** @type {JSPlot_Graph} */
    this.graph = graph;
}

/**
 * data_columns_required - Return the number of columns of data required by a particular named plot style
 * @param style {string} - The name of the plot style to be used
 * @returns {number} - The number of required columns
 */
JSPlot_Plotter.prototype.data_columns_required = function (style) {
    /** @type {boolean} */
    var is_3d = this.graph.threeDimensional;

    if (style === "points") return 2 + (is_3d ? 1 : 0);
    else if (style === "lines") return 2 + (is_3d ? 1 : 0);
    else if (style === "linespoints") return 2 + (is_3d ? 1 : 0);
    else if (style === "xerrorbars") return 3 + (is_3d ? 1 : 0);
    else if (style === "yerrorbars") return 3 + (is_3d ? 1 : 0);
    else if (style === "zerrorbars") return 3 + 1;
    else if (style === "xyerrorbars") return 4 + (is_3d ? 1 : 0);
    else if (style === "xzerrorbars") return 4 + 1;
    else if (style === "yzerrorbars") return 4 + 1;
    else if (style === "xyzerrorbars") return 5 + 1;
    else if (style === "xerrorrange") return 4 + (is_3d ? 1 : 0);
    else if (style === "yerrorrange") return 4 + (is_3d ? 1 : 0);
    else if (style === "zerrorrange") return 4 + 1;
    else if (style === "xyerrorrange") return 6 + (is_3d ? 1 : 0);
    else if (style === "xzerrorrange") return 6 + 1;
    else if (style === "yzerrorrange") return 6 + 1;
    else if (style === "xyzerrorrange") return 8 + 1;
    else if (style === "upperlimits") return 2 + (is_3d ? 1 : 0);
    else if (style === "lowerlimits") return 2 + (is_3d ? 1 : 0);
    else if (style === "dots") return 2 + (is_3d ? 1 : 0);
    else if (style === "impulses") return 2 + (is_3d ? 1 : 0);
    else if (style === "boxes") return 2;
    else if (style === "wboxes") return 3;
    else if (style === "steps") return 2;
    else if (style === "fsteps") return 2;
    else if (style === "histeps") return 2;
    else if (style === "arrows_head") return 4 + 2 * (is_3d ? 1 : 0);
    else if (style === "arrows_nohead") return 4 + 2 * (is_3d ? 1 : 0);
    else if (style === "arrows_twohead") return 4 + 2 * (is_3d ? 1 : 0);
    else if (style === "surface") return 3;

    this.page.workspace.errorLog += "Unrecognised style type passed to <data_columns_required>\n";
    return -1;
};

/**
 * update_axis_usage - Update the used range on each axis in response to the data we're plotting against it
 * @param data {JSPlot_DataSet} - The dataset that we are going to plot
 * @param style {string} - The name of the plot style we are going to use
 * @param a1 {JSPlot_Axis} - The axis we are going to use as an x axis
 * @param a2 {JSPlot_Axis} - The axis we are going to use as an y axis
 * @param a3 {JSPlot_Axis} - The axis we are going to use as an z axis
 */
JSPlot_Plotter.prototype.update_axis_usage = function (data, style, a1, a2, a3) {
    /** @type {JSPlot_Plotter} */
    var self = this;
    /** @type {boolean} */
    var is_3d = this.graph.threeDimensional;

    if (((style === "boxes") || (style === "impulses")) && (this.graph.boxFrom !== null)) {
        a2.includePoint(this.graph.boxFrom);
    }

    // Special treatment for bar charts
    if ((style === "boxes") || (style === "steps") || (style === "fsteps") || (style === "histeps")) {

        if ((style === "boxes") && (this.graph.boxWidth !== null)) {
            // We are rendering a series of boxes with a constant defined width
            $.each(data.data, function (index, dataPoint) {
                if (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1])) {
                    if (!a1.logarithmic) {
                        a1.includePoint(dataPoint[0] - self.graph.boxWidth / 2);
                        a1.includePoint(dataPoint[0] + self.graph.boxWidth / 2);
                    } else {
                        a1.includePoint(dataPoint[0] / Math.sqrt(self.graph.boxWidth));
                        a1.includePoint(dataPoint[0] * Math.sqrt(self.graph.boxWidth));
                    }
                    a2.includePoint(dataPoint[1]);
                }
            });
        } else {
            // We are rendering a series of boxes, with interfaces at the horizontal midpoints between boxes
            for (var i = 0; i < data.data.length; i++) {
                /** @type {?number} */
                var margin_left = null, margin_right = null;

                // Work out margin to leave on left side of box
                if (i > 0) {
                    if ((style === "boxes") || (style === "histeps")) {
                        if (!a1.logarithmic) {
                            margin_left = (data.data[i][0] - data.data[i - 1][0]) / 2;
                        } else {
                            margin_left = Math.sqrt(data.data[i][0] / data.data[i - 1][0]);
                        }
                    } else if (style === "steps") {
                        if (!a1.logarithmic) {
                            margin_left = data.data[i][0] - data.data[i - 1][0];
                        } else {
                            margin_left = data.data[i][0] / data.data[i - 1][0];
                        }
                    } else {
                        margin_left = a1.logarithmic ? 1 : 0;
                    }
                }

                // Work out margin to leave on right side of box
                if (i < data.data.length - 1) {
                    if ((style === "boxes") || (style === "histeps")) {
                        if (!a1.logarithmic) {
                            margin_right = (data.data[i + 1][0] - data.data[i][0]) / 2;
                        } else {
                            margin_right = Math.sqrt(data.data[i + 1][0] / data.data[i][0])
                        }
                    } else if (style === "steps") {
                        margin_right = a1.logarithmic ? 1 : 0;
                    } else {
                        if (!a1.logarithmic) {
                            margin_right = data.data[i + 1][0] - data.data[i][0];
                        } else {
                            margin_right = data.data[i + 1][0] / data.data[i][0];
                        }
                    }
                }

                // For the first and last boxes, we make width symmetrical on both sides
                if ((margin_left === null) && (margin_right === null)) {
                    // ... unless we only have one box, in which case we make up an arbitrary width
                    margin_left = margin_right = 0.5;
                } else if (margin_left === null) {
                    margin_left = margin_right
                } else if (margin_right === null) {
                    margin_right = margin_left;
                }

                // Factor this box into the ranges of each axis
                if (!a1.logarithmic) {
                    a1.includePoint(dataPoint[0] - margin_left);
                    a1.includePoint(dataPoint[0] + margin_right);
                } else {
                    a1.includePoint(dataPoint[0] / margin_left);
                    a1.includePoint(dataPoint[0] * margin_right);
                }
                a2.includePoint(dataPoint[1]);
            }
        }
    }

    // Cycle through data table, ensuring that axis ranges are sufficient to include all data
    $.each(data.data, function (index, dataPoint) {

        if ((style === "points") || (style === "lines") || (style === "linespoints") || (style === "lowerlimits") ||
            (style === "upperlimits") || (style === "dots")) {
            if (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && ((!is_3d) || a3.inRange(dataPoint[2]))) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                if (is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "xerrorbars") {
            if (a2.inRange(dataPoint[1]) && ((!is_3d) && a3.inRange(dataPoint[2])) &&
                (a1.inRange(dataPoint[0] - dataPoint[2 + is_3d])
                    || a1.inRange(dataPoint[0])
                    || a1.inRange(dataPoint[0] + dataPoint[2 + is_3d])
                )) {
                a1.includePoint(dataPoint[0]);
                a1.includePoint(dataPoint[0] - dataPoint[2 + is_3d]);
                a1.includePoint(dataPoint[0] + dataPoint[2 + is_3d]);
                a2.includePoint(dataPoint[1]);
                if (is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "yerrorbars") {
            if (a1.inRange(dataPoint[0]) && ((!is_3d) && a3.inRange(dataPoint[2])) &&
                (a2.inRange(dataPoint[1] - dataPoint[2 + is_3d])
                    || a2.inRange(dataPoint[1])
                    || a2.inRange(dataPoint[1] + dataPoint[2 + is_3d])
                )) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                a2.includePoint(dataPoint[1] - dataPoint[2 + is_3d]);
                a2.includePoint(dataPoint[1] + dataPoint[2 + is_3d]);
                if (is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "zerrorbars") {
            if (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) &&
                (a3.inRange(dataPoint[2])
                    || a3.inRange(dataPoint[2] - dataPoint[3])
                    || a3.inRange(dataPoint[2] + dataPoint[3])
                )) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                a3.includePoint(dataPoint[2]);
                a3.includePoint(dataPoint[2] - dataPoint[3]);
                a3.includePoint(dataPoint[2] + dataPoint[3]);
            }
        } else if (style === "xyerrorbars") {
            if (((!is_3d) || a3.inRange(dataPoint[2])) &&
                ((a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1] - dataPoint[3 + is_3d]))
                    || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]))
                    || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1] + dataPoint[3 + is_3d]))
                    || (a1.inRange(dataPoint[0] - dataPoint[2 + is_3d]) && a2.inRange(dataPoint[1]))
                    || (a1.inRange(dataPoint[0] + dataPoint[2 + is_3d]) && a2.inRange(dataPoint[1]))
                )) {
                a1.includePoint(dataPoint[0]);
                a1.includePoint(dataPoint[0] - dataPoint[2 + is_3d]);
                a1.includePoint(dataPoint[0] + dataPoint[2 + is_3d]);
                a2.includePoint(dataPoint[1]);
                a2.includePoint(dataPoint[1] - dataPoint[3 + is_3d]);
                a2.includePoint(dataPoint[1] + dataPoint[3 + is_3d]);
                if (is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "xzerrorbars") {
            if (a2.inRange(dataPoint[1]) &&
                ((a1.inRange(dataPoint[0]) && a3.inRange(dataPoint[2] - dataPoint[4]))
                    || (a1.inRange(dataPoint[0]) && a3.inRange(dataPoint[2]))
                    || (a1.inRange(dataPoint[0]) && a3.inRange(dataPoint[2] + dataPoint[4]))
                    || (a1.inRange(dataPoint[0] - dataPoint[3]) && a3.inRange(dataPoint[2]))
                    || (a1.inRange(dataPoint[0] + dataPoint[3]) && a3.inRange(dataPoint[2]))
                )) {
                a1.includePoint(dataPoint[0]);
                a1.includePoint(dataPoint[0] - dataPoint[3]);
                a1.includePoint(dataPoint[0] + dataPoint[3]);
                a2.includePoint(dataPoint[1]);
                a3.includePoint(dataPoint[2]);
                a3.includePoint(dataPoint[2] - dataPoint[4]);
                a3.includePoint(dataPoint[2] + dataPoint[4]);
            }
        } else if (style === "yzerrorbars") {
            if (a1.inRange(dataPoint[0]) &&
                ((a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2] - dataPoint[4]))
                    || (a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2]))
                    || (a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2] + dataPoint[4]))
                    || (a2.inRange(dataPoint[1] - dataPoint[3]) && a3.inRange(dataPoint[2]))
                    || (a2.inRange(dataPoint[1] + dataPoint[3]) && a3.inRange(dataPoint[2]))
                )) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                a2.includePoint(dataPoint[1] - dataPoint[3]);
                a2.includePoint(dataPoint[1] + dataPoint[3]);
                a3.includePoint(dataPoint[2]);
                a3.includePoint(dataPoint[2] - dataPoint[4]);
                a3.includePoint(dataPoint[2] + dataPoint[4]);
            }
        } else if (style === "xyzerrorbars") {
            if ((a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2] - dataPoint[5]))
                || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2]))
                || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2] + dataPoint[5]))
                || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1] - dataPoint[4]) && a3.inRange(dataPoint[2]))
                || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1] + dataPoint[4]) && a3.inRange(dataPoint[2]))
                || (a1.inRange(dataPoint[0] - dataPoint[3]) && a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2]))
                || (a1.inRange(dataPoint[0] + dataPoint[3]) && a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2]))
            ) {
                a1.includePoint(dataPoint[0]);
                a1.includePoint(dataPoint[0] - dataPoint[3]);
                a1.includePoint(dataPoint[0] + dataPoint[3]);
                a2.includePoint(dataPoint[1]);
                a2.includePoint(dataPoint[1] - dataPoint[4]);
                a2.includePoint(dataPoint[1] + dataPoint[4]);
                a3.includePoint(dataPoint[2]);
                a3.includePoint(dataPoint[2] - dataPoint[5]);
                a3.includePoint(dataPoint[2] + dataPoint[5]);
            }
        } else if (style === "xerrorrange") {
            if (a2.inRange(dataPoint[1]) && ((!is_3d) || a3.inRange(dataPoint[2])) &&
                (a1.inRange(dataPoint[2 + is_3d]) || a1.inRange(dataPoint[0]) || a1.inRange(dataPoint[3 + is_3d]))
            ) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                a1.includePoint(dataPoint[2 + is_3d]);
                a1.includePoint(dataPoint[3 + is_3d]);
                if (is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "yerrorrange") {
            if (a1.inRange(dataPoint[0]) && ((!is_3d) || a3.inRange(dataPoint[2])) &&
                (a2.inRange(dataPoint[2 + is_3d]) || a2.inRange(dataPoint[1]) || a2.inRange(dataPoint[3 + is_3d]))
            ) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                a2.includePoint(dataPoint[2 + is_3d]);
                a2.includePoint(dataPoint[3 + is_3d]);
                if (is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "zerrorrange") {
            if (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) &&
                (a3.inRange(dataPoint[2]) || a3.inRange(dataPoint[3]) || a3.inRange(dataPoint[4]))
            ) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                a3.includePoint(dataPoint[2]);
                a3.includePoint(dataPoint[3]);
                a3.includePoint(dataPoint[4]);
            }
        } else if (style === "xyerrorrange") {
            if (((!is_3d) || a3.inRange(dataPoint[2])) &&
                ((a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[4 + is_3d]))
                    || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]))
                    || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[5 + is_3d]))
                    || (a1.inRange(dataPoint[2 + is_3d]) && a2.inRange(dataPoint[1]))
                    || (a1.inRange(dataPoint[3 + is_3d]) && a2.inRange(dataPoint[1]))
                )) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                a1.includePoint(dataPoint[2 + is_3d]);
                a1.includePoint(dataPoint[3 + is_3d]);
                a2.includePoint(dataPoint[4 + is_3d]);
                a2.includePoint(dataPoint[5 + is_3d]);
                if (is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "xzerrorrange") {
            if (a2.inRange(dataPoint[1]) &&
                ((a1.inRange(dataPoint[0]) && a3.inRange(dataPoint[5]))
                    || (a1.inRange(dataPoint[0]) && a3.inRange(dataPoint[2]))
                    || (a1.inRange(dataPoint[0]) && a3.inRange(dataPoint[6]))
                    || (a1.inRange(dataPoint[3]) && a3.inRange(dataPoint[2]))
                    || (a1.inRange(dataPoint[4]) && a3.inRange(dataPoint[2]))
                )) {
                a2.includePoint(dataPoint[1]);
                a1.includePoint(dataPoint[0]);
                a1.includePoint(dataPoint[3]);
                a1.includePoint(dataPoint[4]);
                a3.includePoint(dataPoint[2]);
                a3.includePoint(dataPoint[5]);
                a3.includePoint(dataPoint[6]);
            }
        } else if (style === "yzerrorrange") {
            if (a1.inRange(dataPoint[0]) &&
                ((a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[5]))
                    || (a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2]))
                    || (a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[6]))
                    || (a2.inRange(dataPoint[3]) && a3.inRange(dataPoint[2]))
                    || (a2.inRange(dataPoint[4]) && a3.inRange(dataPoint[2]))
                )) {
                a1.includePoint(dataPoint[0]);
                a1.includePoint(dataPoint[3]);
                a1.includePoint(dataPoint[4]);
                a2.includePoint(dataPoint[1]);
                a2.includePoint(dataPoint[5]);
                a2.includePoint(dataPoint[6]);
                a3.includePoint(dataPoint[2]);
                a3.includePoint(dataPoint[7]);
                a3.includePoint(dataPoint[8]);
            }
        } else if (style === "xyzerrorrange") {
            if ((a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[7]))
                || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2]))
                || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[8]))
                || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[5]) && a3.inRange(dataPoint[2]))
                || (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[6]) && a3.inRange(dataPoint[2]))
                || (a1.inRange(dataPoint[3]) && a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2]))
                || (a1.inRange(dataPoint[4]) && a2.inRange(dataPoint[1]) && a3.inRange(dataPoint[2]))
            ) {
                a1.includePoint(dataPoint[0]);
                a1.includePoint(dataPoint[0] - dataPoint[3]);
                a1.includePoint(dataPoint[0] + dataPoint[3]);
                a2.includePoint(dataPoint[1]);
                a2.includePoint(dataPoint[1] - dataPoint[4]);
                a2.includePoint(dataPoint[1] + dataPoint[4]);
                a3.includePoint(dataPoint[2]);
                a3.includePoint(dataPoint[2] - dataPoint[5]);
                a3.includePoint(dataPoint[2] + dataPoint[5]);
            }
        } else if (style === "impulses") {
            if (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && ((!is_3d) || a3.inRange(dataPoint[2]))) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                if (is_3d) a3.includePoint(dataPoint[2]);
                a2.includePoint(self.graph.boxFrom);
            }
        } else if (style === "wboxes") {
            if (a2.inRange(dataPoint[1]) &&
                (a1.inRange(dataPoint[0]) || a1.inRange(dataPoint[0] - dataPoint[2]) || a1.inRange(dataPoint[0] + dataPoint[2]))) {
                a2.includePoint(dataPoint[1]);
                a1.includePoint(dataPoint[0]);
                a1.includePoint(dataPoint[0] - dataPoint[2]);
                a1.includePoint(dataPoint[0] + dataPoint[2]);
                a2.includePoint(self.graph.boxFrom);
            }
        } else if ((style === "arrows_head") || (style === "arrows_nohead") || (style === "arrows_twohead")) {
            if ((a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && ((!is_3d) || a3.inRange(dataPoint[2])))
                || (a1.inRange(dataPoint[2 + is_3d]) && a2.inRange(dataPoint[3 + is_3d]) && ((!is_3d) || a3.inRange(dataPoint[5])))
            ) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                a1.includePoint(dataPoint[2 + is_3d]);
                a2.includePoint(dataPoint[3 + is_3d]);
                if (is_3d) {
                    a3.includePoint(dataPoint[2]);
                    a3.includePoint(dataPoint[5]);
                }
            }
        }
    });

    return 0;
};


/**
 * renderDataSet - Render a data set onto a canvas
 * @param graph {JSPlot_Graph} - The graph we plot this data set onto
 * @param data {JSPlot_DataSet} - The dataset that we are going to plot
 * @param style {string} - The name of the plot style we are going to use
 * @param a1_name {string} - The name of the axis we are going to use as an x axis
 * @param a2_name {string} - The name of the axis we are going to use as an y axis
 * @param a3_name {string} - The name of the axis we are going to use as an z axis
 */
JSPlot_Plotter.prototype.renderDataSet = function (graph, data, style, a1_name, a2_name, a3_name) {
    /** @type {JSPlot_Axis} */
    var a1 = graph.axes[a1_name];
    /** @type {JSPlot_Axis} */
    var a2 = graph.axes[a2_name];
    /** @type {JSPlot_Axis} */
    var a3 = graph.axes[a3_name];

    if ((style === "lines") || (style === "linespoints")) {
        var line_draw = new JSPlot_LineDraw(graph.page, graph, a1, a2, a3,
            data.workspace.styleFinal.color.toHTML(),
            data.workspace.styleFinal.lineType, data.workspace.styleFinal.lineWidth);

        // Cycle through data table, plotting each point in turn
        $.each(data.data, function (index, dataPoint) {
            line_draw.point(dataPoint[0], dataPoint[1], graph.threeDimensional ? dataPoint[2] : 0,
                0, 0, 0, 0, 0, 0);
        });

        // Finish up
        line_draw.penUp();
        line_draw.renderLine();
    }

};