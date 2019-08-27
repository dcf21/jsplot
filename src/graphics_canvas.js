// graphics_canvas.js

/**
 * GraphicsCanvas - This class wraps functions for writing on an HTML5 canvas, providing a consistent interface for
 * producing PNG and SVG output.
 * @param output_canvas {Element} - The HTML5 canvas to draw onto
 * @param width {number} - The width of the canvas (pixels)
 * @param height {number} - The height of the canvas (pixels)
 * @constructor
 */
function GraphicsCanvas(output_canvas, width, height) {
    this._ca = output_canvas;
    this._collision_map = new GraphicsCollisionMap();
    this._resize(width, height);
}

/**
 * _resize - Resize the child canvas that we are writing onto
 * @param width {number} - The width of the canvas (pixels)
 * @param height {number} - The height of the canvas (pixels)
 * @private
 */
GraphicsCanvas.prototype._resize = function (width, height) {
    this._width = width;
    this._height = height;
    this._ca.width = width; // Clear canvas
    this._ca.height = height;
    this._co = this._ca.getContext("2d");
    this._textStyle("Arial,Helvetica,sans-serif", 13, "", "");
    this._strokeStyle("#000000", 1);
    this._fillStyle("#000000");
    this._text_queue = [];
    this._collision_map._reset();
};

/**
 * _clear - Wipe the child canvas that we are writing onto
 * @private
 */
GraphicsCanvas.prototype._clear = function () {
    this._resize(this._width, this._height);
};

/**
 * _translate - Move the origin of the drawing context to the point (x,y) in the current coordinate system
 * @param x {number} - The current X position of the new origin
 * @param y {number} - The current Y position of the new origin
 * @param rotation {number} - Rotate the coordinate system (radians; clockwise)
 * @private
 */
GraphicsCanvas.prototype._translate = function (x, y, rotation) {
    this._co.save();
    this._co.translate(x, y);
    this._co.rotate(rotation);
};

/**
 * _unsetTranslate - Reverse the effect of the most recent call to _translate
 * @private
 */
GraphicsCanvas.prototype._unsetTranslate = function () {
    this._co.restore();
};

/**
 * _strokeStyle - Set the color and line width to use when stroking lines
 * @param color {string} - HTML color string
 * @param line_width {number} - The line width to use when stroking lines
 * @private
 */
GraphicsCanvas.prototype._strokeStyle = function (color, line_width) {
    this._co.strokeStyle = color;
    this._co.lineWidth = line_width;
    this._stroke_style = color;
    this._line_width = line_width;
};

/**
 * _fillStyle - Set the color to use when filling regions
 * @param color {string} - HTML color string
 * @private
 */
GraphicsCanvas.prototype._fillStyle = function (color) {
    this._co.fillStyle = color;
    this._fill_style = color;
};

/**
 * _textStyle - Set the font name, size and style to use when writing text
 * @param family {string} - e.g. "Arial,Helvetica,sans-serif"
 * @param size {number} - font size in pixels, e.g. 13
 * @param weight {string} - the font weight, e.g. "bold"
 * @param style {string} - the font style, e.g. "italic"
 * @private
 */
GraphicsCanvas.prototype._textStyle = function (family, size, weight, style) {
    this._text_style = [family, size, weight, style];
    this._co.font = style + " " + weight + " " + size + "px " + family;
};

/**
 * _beginPath - Start a new path
 * @private
 */
GraphicsCanvas.prototype._beginPath = function () {
    this._co.beginPath();
};

/**
 * _moveTo - In the current path, move to (x,y)
 * @param x {number} - x coordinate
 * @param y {number} - y coordinate
 * @private
 */
GraphicsCanvas.prototype._moveTo = function (x, y) {
    this._co.moveTo(x, y);
};

/**
 * _lineTo - In the current path, connect a line to (x,y)
 * @param x {number} - x coordinate
 * @param y {number} - y coordinate
 * @private
 */
GraphicsCanvas.prototype._lineTo = function (x, y) {
    this._co.lineTo(x, y);
};

/**
 * _closePath - Close the current path
 * @private
 */
GraphicsCanvas.prototype._closePath = function () {
    this._co.closePath();
};

/**
 * _rect - Create a rectangular path
 * @param x_min {number} - x coordinate of bottom-left corner
 * @param y_min {number} - y coordinate of bottom-left corner
 * @param width {number} - The width of the box
 * @param height {number} - The height of the box
 * @private
 */
GraphicsCanvas.prototype._rect = function (x_min, y_min, width, height) {
    this._co.rect(x_min, y_min, width, height);
};

/**
 * _arc - Create a circular path, or an arc of a circle
 * @param x {number} - x coordinate of the centre of the arc
 * @param y {number} - y coordinate of the centre of the arc
 * @param r {number} - The radius of the arc
 * @param start {number} - Starting angle of the arc, radians
 * @param end {number} - Ending angle of the arc, radians
 * @param counterclockwise {boolean} - Flag indicating whether to trace arc counterclockwise (or clockwise)
 * @private
 */
GraphicsCanvas.prototype._arc = function (x, y, r, start, end, counterclockwise) {
    this._co.arc(x, y, r, start, end, counterclockwise);
};

/**
 * _bezierCurveTo - Create a bezier curve path from the current position to (x,y)
 * @param x1 {number} - X coordinate of first control point
 * @param y1 {number} - Y coordinate of first control point
 * @param x2 {number} - X coordinate of second control point
 * @param y2 {number} - Y coordinate of second control point
 * @param x {number} - X coordinate of end point
 * @param y {number} - Y coordinate of end point
 * @private
 */
GraphicsCanvas.prototype._bezierCurveTo = function (x1, y1, x2, y2, x, y) {
    this._co.bezierCurveTo(x1, y1, x2, y2, x, y);
};

/**
 * _stroke - Stroke the current path
 * @private
 */
GraphicsCanvas.prototype._stroke = function () {
    this._co.stroke();
};

/**
 * _fill - Fill the region outlined by the current path
 * @private
 */
GraphicsCanvas.prototype._fill = function () {
    this._co.closePath();
    this._co.fill();
};

/**
 * _setClip - Use the current path as a clipping region
 * @private
 */
GraphicsCanvas.prototype._setClip = function () {
    this._co.save();
    this._co.clip();
};

/**
 * _unsetClip - Revert the most recently applied clipping region
 * @private
 */
GraphicsCanvas.prototype._unsetClip = function () {
    this._co.restore();
};

/**
 * _text - Write a text string onto the canvas
 * @param x {number} - The x coordinate at which to place the text
 * @param y {number} - The y coordinate at which to place the text
 * @param h_align {number} - Options are -1 (left align), 0 (center), 1 (right align)
 * @param v_align {number} - Options are -1 (top align), 0 (middle align), 1 (bottom align)
 * @param filled {boolean} - Should text by filled or stroked in outline?
 * @param text {string} - The text to write
 * @param mustnt_collide {boolean} - If true, do not render this text if it overlaps with any previous text
 * @param add_to_collision_map {boolean} - If true, add this text item to the collision map used when rendering
 * future text
 * @returns {number} - Zero on success; One if collision
 * @private
 */
GraphicsCanvas.prototype._text = function (x, y, h_align, v_align, filled, text, mustnt_collide, add_to_collision_map) {

    if (mustnt_collide || add_to_collision_map) {
        var width = this._co.measureText(text).width + 4;
        var height = this._text_style[1] + 4;

        var x_min, x_max, y_min, y_max;

        if (h_align < 0) {
            x_min = x;
            x_max = x + width;
        }
        else if (h_align > 0) {
            x_min = x - width;
            x_max = x;
        }
        else {
            x_min = x - width / 2;
            x_max = x + width / 2;
        }

        if (v_align < 0) {
            y_min = y - height;
            y_max = y;
        }
        else if (v_align > 0) {
            y_min = y;
            y_max = y + height;
        }
        else {
            y_min = y - height / 2;
            y_max = y + height / 2;
        }

        var collides = this._collision_map._addBox(x_min, x_max, y_min, y_max, mustnt_collide, add_to_collision_map);

        if (collides) return 1; //failure
    }

    if (v_align < 0) this._co.textBaseline = "bottom";
    else if (v_align > 0) this._co.textBaseline = "top";
    else this._co.textBaseline = "middle";

    if (h_align < 0) this._co.textAlign = "left";
    else if (h_align > 0) this._co.textAlign = "right";
    else this._co.textAlign = "center";

    if (filled) this._co.fillText(text, x, y);
    else this._co.strokeText(text, x, y);

    return 0; // successfully rendered
};

/**
 * _textWidth - Measure the width of a text string in the current typeface
 * @param text {string} - The text string to measure
 * @returns {number} - The width of the string (pixels)
 * @private
 */
GraphicsCanvas.prototype._textWidth = function (text) {
    return this._co.measureText(text).width;
};

/**
 * _queueText - Place a text item into a queue of labels, which are subsequently rendered in order of decreasing
 * priority. This mechanism is used to make sure that higher-priority labels take precedence over lower-priority
 * labels when they collide, regardless of the ordering of the calls to _queueText.
 * @param x {number} - The x coordinate at which to place the text
 * @param y {number} - The y coordinate at which to place the text
 * @param h_align {number} - Options are -1 (left align), 0 (center), 1 (right align)
 * @param v_align {number} - Options are -1 (top align), 0 (middle align), 1 (bottom align)
 * @param filled {boolean} - Should text by filled or stroked in outline?
 * @param text {string} - The text to write
 * @param priority {number} - The priority of this text label
 * @private
 */
GraphicsCanvas.prototype._queueText = function (x, y, h_align, v_align, filled, text, priority) {
    this._text_queue.push([priority, x, y, h_align, v_align, filled, text,
        this._text_style, this._stroke_style, this._line_width, this._fill_style]);
};

/**
 * _unqueueText - Render all of the queued text labels, in descending order of priority.
 * @private
 */
GraphicsCanvas.prototype._unqueueText = function () {
    var self = this;

    // Sort in order of DESCENDING priority
    this._text_queue.sort(function (a, b) {
        return a[0] > b[0];
    });

    // Render each queued text label in order of descending priority
    $.each(this._text_queue, function (index, x) {
        self._strokeStyle(x[8], x[9]);
        self._fillStyle(x[10]);
        self._textStyle(x[7][0], x[7][1], x[7][2], x[7][3]);
        self._text(x[1], x[2], x[3], x[4], x[5], x[6], true, true);
    });

    // Empty text queue
    this._text_queue = [];
};

/**
 * _drawImage - Draw an image onto the canvas.
 * @param img {Image} - The image to draw
 * @param sx {number} - The x pixel position of the bottom-left corner of the clipping region in the image to draw
 * @param sy {number} - The x pixel position of the bottom-left corner of the clipping region in the image to draw
 * @param swidth {number} - The width of the clipping region in the image to draw
 * @param sheight {number} - The height of the clipping region in the image to draw
 * @param x {number} - The x pixel position on the output canvas at which to place the bottom-left corner of the image
 * @param y {number} - The y pixel position on the output canvas at which to place the bottom-left corner of the image
 * @param width {number} - The width of the output image on the output canvas
 * @param height {number} - The height of the output image on the output canvas
 * @private
 */
GraphicsCanvas.prototype._drawImage = function (img, sx, sy, swidth, sheight, x, y, width, height) {
    this._co.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
};

/**
 * _render - Render the output canvas. For HTML5 canvases this is a null operation, since we draw as we go along.
 * @private
 */
GraphicsCanvas.prototype._render = function () {
};

/**
 * _composite - Composite the contents of another GraphicsCanvas canvas onto this one.
 * @param other {GraphicsCanvas} - The other GraphicsCanvas canvas
 * @private
 */
GraphicsCanvas.prototype._composite = function (other) {
    this._co.drawImage(other._ca, 0, 0);
};

/**
 * _renderPNG - Render the contents of this graphics canvas to a PNG file. Redirect browser to a data URL.
 * @param filename {string} - The filename for the PNG file, used when redirecting browser to data URL.
 * @private
 */
GraphicsCanvas.prototype._renderPNG = function (filename) {
    if (!detectIE()) {
        var url = this._ca.toDataURL('image/png');
        window.open(url, '_blank');
    } else {
        var blob = this._ca.msToBlob();
        window.navigator.msSaveBlob(blob, filename);

    }
};
