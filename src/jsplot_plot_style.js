// jsplot_plot_style.js

/**
 * JSPlot_PlotStyle - A container for holding the styling information associated with a particular data set that is
 * to be plotted on a graph
 * @constructor
 */
function JSPlot_PlotStyle() {
    this.color = null; // auto
    this.fillColor = new JSPlot_Color(0, 0, 0, 0); // transparent
    this.plotStyle = 'lines';
    this.lineType = null;
    this.pointType = null;
    this.lineWidth = 1;
    this.pointLineWidth = 1;
    this.pointSize = 1;
}

/**
 * Clone a JSPlot_PlotStyle container into a new container
 */
JSPlot_PlotStyle.prototype.clone = function () {
    var other = new JSPlot_PlotStyle();
    other.color = new JSPlot_Color(this.color.red, this.color.green, this.color.blue, this.color.alpha);
    other.fillColor = new JSPlot_Color(this.fillColor.red, this.fillColor.green, this.fillColor.blue, this.fillColor.alpha);
    other.plotStyle = this.plotStyle;
    other.lineType = this.lineType;
    other.pointType = this.pointType;
    other.lineWidth = this.lineWidth;
    other.pointLineWidth = this.pointLineWidth;
    other.pointSize = this.pointSize;
};
