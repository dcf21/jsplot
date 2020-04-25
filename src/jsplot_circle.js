// jsplot_circle.js

/**
 * JSPlot_Circle - A class representing a circle, to be rendered onto a <JSPlot_Canvas>
 * @param settings {Object} - An object containing settings
 * @constructor
 */
function JSPlot_Circle(settings) {
    /** @type {?JSPlot_Canvas} */
    this.page = null;
    /** @type {string} */
    this.itemType = "circle";
    /** @type {JSPlot_Color} */
    this.strokeColor = new JSPlot_Color(0, 0, 0, 1);
    /** @type {JSPlot_Color} */
    this.fillColor = new JSPlot_Color(0.6, 0.6, 0.6, 1);
    /** @type {number} */
    this.strokeLineWidth = 1;

    /** @type {Array<number>} */
    this.origin = [0, 0];
    /** @type {number} */
    this.radius = 50;

    // Read user supplied settings
    this.configure(settings);
    this.cleanWorkspace();
}

/**
 * configure - Configure settings for a circle
 * @param settings {Object} - An object containing settings
 */
JSPlot_Circle.prototype.configure = function (settings) {
    /** @type {JSPlot_Circle} */
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
            case "radius":
                self.radius = value;
                break;
            default:
                throw "Unrecognised circle setting " + key;
        }
    });
};

/**
 * cleanWorkspace - Create a clean workspace to be used for plotting this circle
 */
JSPlot_Circle.prototype.cleanWorkspace = function () {
    // Temporary data fields which are used when rendering a plot
    this.workspace = [];
};

/**
 * calculateBoundingBox - Step 1 of rendering process: return the bounding box of this circle
 * @param page {JSPlot_Canvas} - The canvas that this circle will be rendered onto
 * @returns {JSPlot_BoundingBox}
 */
JSPlot_Circle.prototype.calculateBoundingBox = function (page) {
    // Set pointer to the graphics canvas that we're rendering onto
    this.page = page;
    this.cleanWorkspace();

    // Start constructing a bounding box
    var bounding_box = new JSPlot_BoundingBox();

    // Populate the bounding box of the plot
    bounding_box.includePoint(this.origin[0]-this.radius, this.origin[1]);
    bounding_box.includePoint(this.origin[0]+this.radius, this.origin[1]);
    bounding_box.includePoint(this.origin[0], this.origin[1]-this.radius);
    bounding_box.includePoint(this.origin[0], this.origin[1]+this.radius);

    // Return bounding box
    return bounding_box;
};

/**
 * calculateDataRanges - Step 2 of the rendering process
 */
JSPlot_Circle.prototype.calculateDataRanges = function () {
};

/**
 * render - Step 3 of the plotting process: render
 */
JSPlot_Circle.prototype.render = function () {
    // Fill path
    if (this.fillColor !== null) {
        this.page.canvas._fillStyle(this.fillColor);
        this.page.canvas._beginPath();
        this.page.canvas._arc(this.origin[0], this.origin[1], this.radius, 0, 360, false);
        this.page.canvas._fill();
    }

    // Stroke path
    if (this.strokeColor !== null) {
        this.page.canvas._strokeStyle(this.strokeColor, this.strokeLineWidth);
        this.page.canvas._beginPath();
        this.page.canvas._arc(this.origin[0], this.origin[1], this.radius, 0, 360, false);
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
JSPlot_Circle.prototype.interactive_scroll = function (x_offset, y_offset) {
};

/**
 * interactive_zoom - Apply interactive zoom event to this item, for example when the user uses the mouse wheel to
 * zoom.
 * @param delta {number} - The numerical amount by which the canvas was zoomed
 */
JSPlot_Circle.prototype.interactive_zoom = function (delta) {
};
