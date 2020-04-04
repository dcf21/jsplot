// jsplot_function_evaluator.js

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
 */
JSPlot_FunctionEvaluator.prototype.evaluate_linear_raster = function(x_min, x_max, point_count) {
    var data = [];
    for (var i=0; i<point_count; i++) {
        var x = x_min + (x_max - x_min) / (point_count-1) * i;
        var point = [x];
        for (var j=0; j<this.functions.length; j++) {
            point.push(this.functions[j](x));
        }
        data.push(point);
    }
    return new JSPlot_DataSet(this.title, this.styling, data);
};

/**
 * evaluate_linear_raster - Evaluate the functions on a logarithmically-spaced raster of <point_count> points.
 * @param x_min {number} - The lower limit of the values of x to evaluate
 * @param x_max {number} - The upper limit of the values of x to evaluate
 * @param point_count {number} - The number of rows that the output data set should contain
 */
JSPlot_FunctionEvaluator.prototype.evaluate_log_raster = function(x_min, x_max, point_count) {
    var data = [];
    for (var i=0; i<point_count; i++) {
        var x = x_min * Math.pow(x_max / x_min, i / (point_count-1));
        var point = [x];
        for (var j=0; j<this.functions.length; j++) {
            point.push(this.functions[j](x));
        }
        data.push(point);
    }
    return new JSPlot_DataSet(this.title, this.styling, data);
};
