// jsplot_axis_ticks.js

/**
 * JSPlot_AxisTics - A class representing a scheme for placing ticks along a graph axis.
 * @param settings {Object} - An object containing settings
 * @constructor
 */
function JSPlot_AxisTics(settings) {
    this.logBase = null;
    this.ticDir = null;
    this.tickMin = null;
    this.tickMax = null;
    this.tickStep = null;
    this.tickList = [];
    this.configure(settings);
}

/**
 * configure - Configure settings for a set of axis ticks
 * @param settings {Object} - An object containing settings
 */
JSPlot_AxisTics.prototype.configure = function (settings) {
    $.each(settings, function (key, value) {
        switch (key) {
            case "logBase":
                this.logBase = value;
                break;
            case "ticDir":
                this.ticDir = value;
                break;
            case "tickList":
                this.tickList = value;
                break;
            case "tickMin":
                this.tickMin = value;
                break;
            case "tickMax":
                this.tickMax = value;
                break;
            case "tickStep":
                this.tickStep = value;
                break;
            default:
                throw "Unrecognised axis tick setting " + key;
        }
    });
};
