// jsplot_threedimbuffer.js

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
    this.active = true;
    this.reset();
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
        item();
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
