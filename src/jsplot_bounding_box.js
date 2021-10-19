// jsplot_bounding_box.js

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
 * JSPlot_BoundingBox - An object representing the rectangular bounding box which encloses a set of points
 * @constructor
 */
JSPlot_BoundingBox = function () {
    /** @type {?number} */
    this.left = null;
    /** @type {?number} */
    this.right = null;
    /** @type {?number} */
    this.top = null;
    /** @type {?number} */
    this.bottom = null;
};

/**
 * copy - Create a duplicate of this bounding box
 */
JSPlot_BoundingBox.prototype.copy = function() {
    var duplicate = new JSPlot_BoundingBox();
    duplicate.left = this.left;
    duplicate.right = this.right;
    duplicate.top = this.top;
    duplicate.bottom = this.bottom;
    return duplicate;
};

/**
 * includePoint - Expand the bounding box to include the specified point
 * @param x {number} - The x coordinate of the point
 * @param y {number} - The y coordinate of the point
 */
JSPlot_BoundingBox.prototype.includePoint = function (x, y) {
    if ((this.left === null) || (this.left > x)) this.left = x;
    if ((this.right === null) || (this.right < x)) this.right = x;
    if ((this.top === null) || (this.top > y)) this.top = y;
    if ((this.bottom === null) || (this.bottom < y)) this.bottom = y;
};

/**
 * includeBox - Expand the bounding box to include the specified other bounding box
 * @param box {JSPlot_BoundingBox} - The other bounding box to include
 */
JSPlot_BoundingBox.prototype.includeBox = function (box) {
    if ((this.left === null) || (this.left > box.left)) this.left = box.left;
    if ((this.right === null) || (this.right < box.right)) this.right = box.right;
    if ((this.top === null) || (this.top > box.top)) this.top = box.top;
    if ((this.bottom === null) || (this.bottom < box.bottom)) this.bottom = box.bottom;
};

/**
 * query - Query the x and y limits of the bounding box
 * @returns {{top: number, left: number, bottom: number, right: number}}
 */
JSPlot_BoundingBox.prototype.query = function () {
    return {
        'left': this.left,
        'right': this.right,
        'top': this.top,
        'bottom': this.bottom
    }
};
