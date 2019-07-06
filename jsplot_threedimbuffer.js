// jsplot_threedimbuffer.js

function JSPlot_ThreeDimBuffer() {
    this.reset();
}

JSPlot_ThreeDimBuffer.prototype.reset = function () {
    this.active = 0;
    this.buffer = [];
};

JSPlot_ThreeDimBuffer.prototype.activate = function () {
    this.deactivate(x);
    this.active = 1;
    this.reset()
};

JSPlot_ThreeDimBuffer.prototype.deactivate = function () {
    // Sort items in buffer, from back to front
    this.buffer.sort(function (a, b) {
        return a[0] > b[0];
    });

    // Display all items in 3D display buffer, from back to front
    $.each(this.buffer, function (index, item) {
        item();
    });

    this.reset();
};

JSPlot_ThreeDimBuffer.prototype.addItem = function (depth, callback) {
    if (!this.active) {
        // If we are not active, we can display this item right away
        callback();
    } else {
        // Cache this item, to display later
        this.buffer.push([depth, callback]);
    }
};
