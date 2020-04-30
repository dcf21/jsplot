// jsplot_threedimbuffer.js

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
 * JSPlot_ThreeDimBuffer - An object which buffers a list of functions which should be executed to render items at
 * various depths into the screen on a 3D plot. Once the list is assembled, the list of functions are executed from
 * back to front in order to ensure ordering of the items.
 * @constructor
 */
function JSPlot_ThreeDimBuffer() {
    this.reset();
}

/**
 * reset - Discard the current list of items to render, and place the JSPlot_ThreeDimBuffer into an inactive state.
 */
JSPlot_ThreeDimBuffer.prototype.reset = function () {
    this.active = false;
    this.buffer = [];
};

/**
 * activate - Render any items which have been cached while the JSPlot_ThreeDimBuffer was active. Start caching a new
 * list of items to render in depth order.
 */
JSPlot_ThreeDimBuffer.prototype.activate = function () {
    this.deactivate();
    this.reset();
    this.active = true;
};

/**
 * deactivate - Render any items which have been cached while the JSPlot_ThreeDimBuffer was active. Then revert to an
 * inactive state where all items are rendered immediately with no caching.
 */
JSPlot_ThreeDimBuffer.prototype.deactivate = function () {
    // Sort items in buffer, from back to front
    this.buffer.sort(function (a, b) {
        return a[0] > b[0];
    });

    // Display all items in 3D display buffer, from back to front
    $.each(this.buffer, function (index, item) {
        item[1]();
    });

    // Delete the list of items we have just rendered, and deactivate
    this.reset();
};

/**
 * addItem - Add an item to the cache of items we are to render in depth order. If we are not currently active, render
 * the item immediately.
 * @param depth {number} - The depth of the item into the screen.
 * @param callback {function} - The function to call to render the item.
 */
JSPlot_ThreeDimBuffer.prototype.addItem = function (depth, callback) {
    if (!this.active) {
        // If we are not active, we can display this item right away
        callback();
    } else {
        // Cache this item, to display later
        this.buffer.push([depth, callback]);
    }
};
