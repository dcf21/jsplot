// jsplot_text.js

/**
 * JSPlot_Text - A class representing a text, to be rendered onto a <JSPlot_Canvas>
 * @param settings {Object} - An object containing settings
 * @constructor
 */
function JSPlot_Text(settings) {
    /** @type {?JSPlot_Canvas} */
    this.page = null;
    /** @type {string} */
    this.itemType = "text";
    /** @type {string} */
    this.text = "Hello world";
    /** @type {JSPlot_Color} */
    this.color = new JSPlot_Color(0, 0, 0, 1);
    /** @type {number} */
    this.fontSize = 13;
    /** @type {string} */
    this.fontFamily = "Arial,Helvetica,sans-serif";
    /** @type {string} */
    this.fontWeight = "";  // options "", "bold"
    /** @type {string} */
    this.fontStyle = "";  // options "", "italic"

    /** @type {Array<number>} */
    this.origin = [0, 0];
    /** @type {string} */
    this.h_align = "center";  // options "left", "center", "right"
    /** @type {string} */
    this.v_align = "center";  // options "top", "center", "bottom"

    // Read user supplied settings
    this.configure(settings);
    this.cleanWorkspace();
}

/**
 * configure - Configure settings for a text item
 * @param settings {Object} - An object containing settings
 */
JSPlot_Text.prototype.configure = function (settings) {
    /** @type {JSPlot_Text} */
    var self = this;

    $.each(settings, function (key, value) {
        switch (key) {
            case "color":
                self.color = value;
                break;
            case "text":
                self.text = value;
                break;
            case "fontSize":
                self.fontSize = value;
                break;
            case "fontFamily":
                self.fontFamily = value;
                break;
            case "fontStyle":
                self.fontStyle = value;
                break;
            case "fontWeight":
                self.fontWeight = value;
                break;
            case "origin":
                self.origin = value;
                break;
            case "h_align":
                self.h_align = value;
                break;
            case "v_align":
                self.v_align = value;
                break;
            default:
                throw "Unrecognised graph setting " + key;
        }
    });
};

/**
 * cleanWorkspace - Create a clean workspace to be used for plotting this text item
 */
JSPlot_Text.prototype.cleanWorkspace = function () {
    // Temporary data fields which are used when rendering a plot
    this.workspace = [];
};

/**
 * calculateBoundingBox - Step 1 of rendering process: return the bounding box of this text item
 * @param page {JSPlot_Canvas} - The canvas that this text item will be rendered onto
 * @returns {JSPlot_BoundingBox}
 */
JSPlot_Text.prototype.calculateBoundingBox = function (page) {
    // Set pointer to the graphics canvas that we're rendering onto
    this.page = page;
    this.cleanWorkspace();

    // Start constructing a bounding box
    var bounding_box = new JSPlot_BoundingBox();

    // Populate the bounding box of the plot
    bounding_box.includePoint(this.origin[0], this.origin[1]);

    // Return bounding box
    return bounding_box;
};

/**
 * calculateDataRanges - Step 2 of the rendering process
 */
JSPlot_Text.prototype.calculateDataRanges = function () {
};

/**
 * render - Step 3 of the plotting process: render
 */
JSPlot_Text.prototype.render = function () {
    if (this.color !== null) {
        var h_align = 0;
        if (this.h_align === "left") h_align = -1;
        if (this.h_align === "right") h_align = 1;

        var v_align = 0;
        if (this.v_align === "top") v_align = 1;
        if (this.v_align === "bottom") v_align = -1;

        this.page.canvas._textStyle(this.fontFamily, this.fontSize, this.fontWeight, this.fontStyle);
        this.page.canvas._text(this.origin[0], this.origin[1], h_align, v_align,
            true, this.text, false, false);
    }
};

// Interactivity

/**
 * interactive_scroll - Apply interactive mouse-scroll event to this item, for example when the user clicks and drags
 * the canvas.
 * @param x_offset {number} - The numerical number of pixels by which the canvas has been dragged.
 * @param y_offset {number} - The numerical number of pixels by which the canvas has been dragged.
 */
JSPlot_Text.prototype.interactive_scroll = function (x_offset, y_offset) {
};

/**
 * interactive_zoom - Apply interactive zoom event to this item, for example when the user uses the mouse wheel to
 * zoom.
 * @param delta {number} - The numerical amount by which the canvas was zoomed
 * @return {boolean} - Flag indicating whether this canvas item responded to event
 */
JSPlot_Text.prototype.interactive_zoom = function (delta) {
    return false;
};
