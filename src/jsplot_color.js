// jsplot_color.js

function JSPlot_Color(red, green, blue, alpha) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;
}

JSPlot_Color.prototype.isVisible = function () {
    return this.alpha > 0;
};

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
