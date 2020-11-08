// jsplot_color.js

// -------------------------------------------------
// Copyright 2020-2021 Dominic Ford.

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

    if (this.alpha < 0.999) {
        return "rgba(" + component(this.red) + "," + component(this.green) + "," + component(this.blue) + "," +
            (component(this.alpha) / 255) + ")";
    } else {
        return "rgb(" + component(this.red) + "," + component(this.green) + "," + component(this.blue) + ")";
    }
};
