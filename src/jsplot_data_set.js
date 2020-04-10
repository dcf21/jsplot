// jsplot_data_set.js

/**
 * JSPlot_DataSet - A class representing a single data set to be plotted on a graph.
 * @param title {string} - The text to display in the graph's legend next to this data set
 * @param styling {Object} - Settings to associate with the JSPlot_PlotStyle to associate with this data set
 * @param data {Array<Array<number>>} The data to be plotted, as a list of rows, each represented as a list of columns
 * @constructor
 */
function JSPlot_DataSet(title, styling, data) {
    this.title = title; // Title for this data set to put into the graph legend
    this.style = new JSPlot_PlotStyle(styling); // Styling for this data set
    this.axes = {1: 'x1', 2: 'y1', 3: 'z1'}; // Which axes do we plot this data set against?
    this.data = data;
    this.cleanWorkspace();
}

/**
 * cleanWorkspace - Create a clean workspace to be used for plotting this data set
 */
JSPlot_DataSet.prototype.cleanWorkspace = function () {
    this.workspace = {};
    this.workspace.styleFinal = null;
    this.workspace.requiredColumns = null;
};

/**
 * render - Render a data set onto a canvas
 * @param graph {JSPlot_Graph} - The graph we plot this data set onto
 */
JSPlot_DataSet.prototype.render = function(graph) {

};
