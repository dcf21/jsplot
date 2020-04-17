// jsplot_axis_ticks.js

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
    $.each(settings, function (key, value) {
        switch (key) {
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
