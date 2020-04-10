// jsplot_color.js

/**
 * JSPlot_Color - A container for an RGBA color
 * @param red {number} - Red component of the color (0-1)
 * @param green {number} - Green component of the color (0-1)
 * @param blue {number} - Blue component of the color (0-1)
 * @param alpha {number} - Alpha component of the color (0-1)
 * @constructor
 */
function JSPlot_Color(red, green, blue, alpha) {
    /** @type {number} */
    this.red = red;
    /** @type {number} */
    this.green = green;
    /** @type {number} */
    this.blue = blue;
    /** @type {number} */
    this.alpha = alpha;
}

/**
 * isVisible - Test whether this color has any opacity at all (true), or whether it is transparent (false)
 * @returns {boolean}
 */
JSPlot_Color.prototype.isVisible = function () {
    return this.alpha > 0;
};

/**
 * toHTML - Write this color as an RGBA(...) HTML color string
 * @returns {string}
 */
JSPlot_Color.prototype.toHTML = function () {
    var component = function (x) {
        var int_val = Math.floor(255 * x);
        if (int_val < 0) int_val = 0;
        if (int_val > 255) int_val = 255;
        return int_val;
    };

    return "rgba(" + component(this.red) + "," + component(this.green) + "," + component(this.blue) + "," +
        (component(this.alpha) / 255) + ")";
};
