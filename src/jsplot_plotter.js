// jsplot_plotter.js

/**
 * JSPlot_Plotter - A class which plots data sets onto graphs
 * @param page {JSPlot_Canvas} - The canvas that this graph is to be drawn onto
 * @param graph {JSPlot_Graph} - The graph that we are drawing data sets onto
 * @constructor
 */
function JSPlot_Plotter(page, graph) {
    this.page = page;
    this.graph = graph;
}

/**
 * data_columns_required - Return the number of columns of data required by a particular named plot style
 * @param style {string} - The name of the plot style to be used
 * @returns {number} - The number of required columns
 */
JSPlot_Plotter.prototype.data_columns_required = function (style) {

    let is_3d = this.graph.threeDimensional;
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

    page.workspace.errorLog += "Unrecognised style type passed to <data_columns_required>\n";
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
    var is_3d = this.graph.threeDimensional;

    // Cycle through data table, ensuring that axis ranges are sufficient to include all data
    $.each(data.data, function (index, dataPoint) {

        if (style === "points") {
            if (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && ((!this.is_3d) || a3.inRange(dataPoint[2]))) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                if (this.is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "lines") {
            if (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && ((!is_3d) || a3.inRange(dataPoint[2]))) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                if (is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "linespoints") {
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
        } else if (style === "lowerlimits") {
            if (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && ((!is_3d) || a3.inRange(dataPoint[2]))) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                if (is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "upperlimits") {
            if (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && ((!is_3d) || a3.inRange(dataPoint[2]))) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                if (is_3d) a3.includePoint(dataPoint[2]);
            }
        } else if (style === "dots") {
            if (a1.inRange(dataPoint[0]) && a2.inRange(dataPoint[1]) && ((!is_3d) && a3.inRange(dataPoint[2]))) {
                a1.includePoint(dataPoint[0]);
                a2.includePoint(dataPoint[1]);
                if (is_3d) a3.includePoint(dataPoint[2]);
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

