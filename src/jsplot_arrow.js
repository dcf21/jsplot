// jsplot_arrow.js

// -------------------------------------------------
// Copyright 2020 Dominic Ford.

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
 * JSPlot_Arrow - A class representing an arrow, to be rendered onto a <JSPlot_Canvas>
 * @param settings {Object} - An object containing settings
 * @constructor
 */
function JSPlot_Arrow(settings) {
    /** @type {?JSPlot_Canvas} */
    this.page = null;
    /** @type {string} */
    this.itemType = "arrow";
    /** @type {number} */
    this.z_index = 0;
    /** @type {string} */
    this.arrowType = "single";
    /** @type {JSPlot_Color} */
    this.color = new JSPlot_Color(0, 0, 0, 1);
    /** @type {number} */
    this.strokeLineWidth = 1;

    /** @type {Array<number>} */
    this.origin = [0, 0];
    /** @type {Array<number>} */
    this.target = [0, 0];

    // Read user supplied settings
    this.configure(settings);
    this.cleanWorkspace();
}

/**
 * configure - Configure settings for an arrow
 * @param settings {Object} - An object containing settings
 */
JSPlot_Arrow.prototype.configure = function (settings) {
    /** @type {JSPlot_Arrow} */
    var self = this;

    $.each(settings, function (key, value) {
        switch (key) {
            case "arrowType":
                self.arrowType = value;
                break;
            case "color":
                self.color = value;
                break;
            case "strokeLineWidth":
                self.strokeLineWidth = value;
                break;
            case "origin":
                self.origin = value;
                break;
            case "target":
                self.target = value;
                break;
            case "z_index":
                self.z_index = value;
                break;
            default:
                throw "Unrecognised arrow setting " + key;
        }
    });
};

/**
 * cleanWorkspace - Create a clean workspace to be used for plotting this arrow
 */
JSPlot_Arrow.prototype.cleanWorkspace = function () {
    // Temporary data fields which are used when rendering a plot
    this.workspace = [];
};

/**
 * calculateBoundingBox - Step 1 of rendering process: return the bounding box of this arrow
 * @param page {JSPlot_Canvas} - The canvas that this arrow will be rendered onto
 * @returns {JSPlot_BoundingBox}
 */
JSPlot_Arrow.prototype.calculateBoundingBox = function (page) {
    // Set pointer to the graphics canvas that we're rendering onto
    this.page = page;
    this.cleanWorkspace();

    // Start constructing a bounding box
    var bounding_box = new JSPlot_BoundingBox();

    // Populate the bounding box of the plot
    bounding_box.includePoint(this.origin[0], this.origin[1]);
    bounding_box.includePoint(this.target[0], this.target[1]);

    // Return bounding box
    return bounding_box;
};

/**
 * calculateDataRanges - Step 2 of the rendering process
 */
JSPlot_Arrow.prototype.calculateDataRanges = function () {
};

/**
 * render - Step 3 of the plotting process: render the arrow
 */
JSPlot_Arrow.prototype.render = function () {
    if (this.color !== null) {
        var renderer = new JSPlot_DrawArrow();

        renderer.primitive_arrow(this.page, this.arrowType,
            this.origin[0], this.origin[1], 0,
            this.target[0], this.target[1], 0,
            this.color, this.strokeLineWidth, 1);
    }
};

// Interactivity

/**
 * interactive_scroll - Apply interactive mouse-scroll event to this item, for example when the user clicks and drags
 * the canvas.
 * @param x_offset {number} - The numerical number of pixels by which the canvas has been dragged.
 * @param y_offset {number} - The numerical number of pixels by which the canvas has been dragged.
 */
JSPlot_Arrow.prototype.interactive_scroll = function (x_offset, y_offset) {
};

/**
 * interactive_zoom - Apply interactive zoom event to this item, for example when the user uses the mouse wheel to
 * zoom.
 * @param delta {number} - The numerical amount by which the canvas was zoomed
 * @return {boolean} - Flag indicating whether this canvas item responded to event
 */
JSPlot_Arrow.prototype.interactive_zoom = function (delta) {
    return false;
};
