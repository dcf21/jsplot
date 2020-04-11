// jsplot_data_set.js

/**
 * JSPlot_DataSet - A class representing a single data set to be plotted on a graph.
 * @param title {string} - The text to display in the graph's legend next to this data set
 * @param styling {Object} - Settings to associate with the JSPlot_PlotStyle to associate with this data set
 * @param data {Array<Array<number>>} The data to be plotted, as a list of rows, each represented as a list of columns
 * @constructor
 */
function JSPlot_DataSet(title, styling, data) {
    /** @type {string} */
    this.title = title; // Title for this data set to put into the graph legend
    /** @type {JSPlot_PlotStyle} */
    this.style = new JSPlot_PlotStyle(styling); // Styling for this data set
    /** @type {Object.<number, string>} */
    this.axes = {1: 'x1', 2: 'y1', 3: 'z1'}; // Which axes do we plot this data set against?
    /** @type {Array<Array<number>>} */
    this.data = data;
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
