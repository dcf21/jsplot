// jsplot_rectangle.js

/**
 * JSPlot_Rectangle - A class representing a rectangle, to be rendered onto a <JSPlot_Canvas>
 * @param settings {Object} - An object containing settings
 * @constructor
 */
function JSPlot_Rectangle(settings) {
    /** @type {?JSPlot_Canvas} */
    this.page = null;
    /** @type {string} */
    this.itemType = "rectangle";
    /** @type {?JSPlot_Color} */
    this.strokeColor = new JSPlot_Color(0, 0, 0, 1);
    /** @type {?JSPlot_Color} */
    this.fillColor = new JSPlot_Color(0.6, 0.6, 0.6, 1);
    /** @type {number} */
    this.strokeLineWidth = 1;

    /** @type {Array<number>} */
    this.origin = [0, 0];
    /** @type {number} */
    this.width = 50;
    /** @type {number} */
    this.height = 50;

    // Read user supplied settings
    this.configure(settings);
    this.cleanWorkspace();
}

/**
 * configure - Configure settings for a rectangle
 * @param settings {Object} - An object containing settings
 */
JSPlot_Rectangle.prototype.configure = function (settings) {
    /** @type {JSPlot_Rectangle} */
    var self = this;

    $.each(settings, function (key, value) {
        switch (key) {
            case "strokeColor":
                self.strokeColor = value;
                break;
            case "fillColor":
                self.fillColor = value;
                break;
            case "strokeLineWidth":
                self.strokeLineWidth = value;
                break;
            case "origin":
                self.origin = value;
                break;
            case "width":
                self.width = value;
                break;
            case "height":
                self.height = value;
                break;
            default:
                throw "Unrecognised rectangle setting " + key;
        }
    });
};

/**
 * cleanWorkspace - Create a clean workspace to be used for plotting this rectangle
 */
JSPlot_Rectangle.prototype.cleanWorkspace = function () {
    // Temporary data fields which are used when rendering a plot
    this.workspace = [];
};

/**
 * calculateBoundingBox - Step 1 of rendering process: return the bounding box of this rectangle
 * @param page {JSPlot_Canvas} - The canvas that this rectangle will be rendered onto
 * @returns {JSPlot_BoundingBox}
 */
JSPlot_Rectangle.prototype.calculateBoundingBox = function (page) {
    // Set pointer to the graphics canvas that we're rendering onto
    this.page = page;
    this.cleanWorkspace();

    // Start constructing a bounding box
    var bounding_box = new JSPlot_BoundingBox();

    // Populate the bounding box of the plot
    bounding_box.includePoint(this.origin[0], this.origin[1]);
    bounding_box.includePoint(this.origin[0] + this.width, this.origin[1] + this.height);

    // Return bounding box
    return bounding_box;
};

/**
 * calculateDataRanges - Step 2 of the rendering process
 */
JSPlot_Rectangle.prototype.calculateDataRanges = function () {
};

/**
 * render - Step 3 of the plotting process: render the graph
 */
JSPlot_Rectangle.prototype.render = function () {
    // Fill path
    if (this.fillColor !== null) {
        this.page.canvas._fillStyle(this.fillColor);
        this.page.canvas._beginPath();
        this.page.canvas._rect(this.origin[0], this.origin[1], this.width, this.height);
        this.page.canvas._fill();
    }

    // Stroke path
    if (this.strokeColor !== null) {
        this.page.canvas._strokeStyle(this.strokeColor, this.strokeLineWidth);
        this.page.canvas._beginPath();
        this.page.canvas._rect(this.origin[0], this.origin[1], this.width, this.height);
        this.page.canvas._stroke();
    }
};

// Interactivity

/**
 * interactive_scroll - Apply interactive mouse-scroll event to this item, for example when the user clicks and drags
 * the canvas.
 * @param x_offset {number} - The numerical number of pixels by which the canvas has been dragged.
 * @param y_offset {number} - The numerical number of pixels by which the canvas has been dragged.
 */
JSPlot_Rectangle.prototype.interactive_scroll = function (x_offset, y_offset) {
};

/**
 * interactive_zoom - Apply interactive zoom event to this item, for example when the user uses the mouse wheel to
 * zoom.
 * @param delta {number} - The numerical amount by which the canvas was zoomed
 * @return {boolean} - Flag indicating whether this canvas item responded to event
 */
JSPlot_Rectangle.prototype.interactive_zoom = function (delta) {
    return false;
};
