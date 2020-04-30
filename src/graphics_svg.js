// graphics_svg.js

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
 * GraphicsSVG - This class wraps functions for writing on an HTML5 canvas, providing a consistent interface for
 * producing PNG and SVG output.
 * @param width {number} - The width of the canvas (pixels)
 * @param height {number} - The height of the canvas (pixels)
 * @constructor
 */
function GraphicsSVG(width, height) {
    this._ca = document.createElement('canvas');
    this._collision_map = new GraphicsCollisionMap();
    this._resize(width, height);
}

/**
 * _resize - Resize the child canvas that we are writing onto
 * @param width {number} - The width of the canvas (pixels)
 * @param height {number} - The height of the canvas (pixels)
 * @private
 */
GraphicsSVG.prototype._resize = function (width, height) {
    this._width = width;
    this._height = height;
    this._ca.width = width; // Clear canvas
    this._ca.height = height;
    this._co = this._ca.getContext("2d");
    this._clear();
};

/**
 * _clear - Wipe the child canvas that we are writing onto
 * @private
 */
GraphicsSVG.prototype._clear = function () {
    this._textStyle("Arial,Helvetica,sans-serif", 13, "", "");
    this._strokeStyle("#000000", 1);
    this._fillStyle("#000000");
    this._text_queue = [];
    this._collision_map._reset();

    var defs = {
        "open": "<defs>",
        "close": "</defs>",
        "children": [{
            "open": '<clipPath id="page">',
            "close": '</clipPath>',
            "children": [{
                "open": '<rect x="0" y="0" width="' + this._width + '" height="' + this._height + '" />',
                "close": '',
                "children": []
            }]
        }]
    };

    var body = {
        "open": '<g clip-path="url(#page)">',
        "close": '</g>',
        "children": []
    };

    this._document = {
        "open": '<svg version="1.1" width="' + this._width + '" height="' + this._height + '" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
        "close": '</svg>',
        "children": [defs, body]
    };

    this._defs = defs;
    this._contextStack = [body];
    this._clip_path_counter = 0;
    this._beginPath();
};

/**
 * _translate - Move the origin of the drawing context to the point (x,y) in the current coordinate system
 * @param x {number} - The current X position of the new origin
 * @param y {number} - The current Y position of the new origin
 * @param rotation {number} - Rotate the coordinate system (radians; clockwise)
 * @private
 */
GraphicsSVG.prototype._translate = function (x, y, rotation) {
    var translation = {
        "open": '<g transform="translate(' + x + ',' + y + ') rotate(' + (rotation / Math.PI * 180).toFixed(3) + ')">',
        "close": '</g>',
        "children": []
    };

    var l = this._contextStack.length - 1;
    this._contextStack[l]["children"].push(translation);
    this._contextStack.push(translation);
};

/**
 * _unsetTranslate - Reverse the effect of the most recent call to _translate
 * @private
 */
GraphicsSVG.prototype._unsetTranslate = function () {
    this._contextStack.pop();
};

/**
 * _strokeStyle - Set the color and line width to use when stroking lines
 * @param color {string} - HTML color string
 * @param line_width {number} - The line width to use when stroking lines
 * @private
 */
GraphicsSVG.prototype._strokeStyle = function (color, line_width) {
    this._stroke_style = color;
    this._line_width = line_width;
};

/**
 * _fillStyle - Set the color to use when filling regions
 * @param color {string} - HTML color string
 * @private
 */
GraphicsSVG.prototype._fillStyle = function (color) {
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
GraphicsSVG.prototype._textStyle = function (/* string e.g. "Arial,Helvetica,sans-serif" */ family,
                                             /* int e.g. "13" */ size,
                                             /* string e.g. "bold" */ weight,
                                             /* string e.g. "italic" */ style) {
    this._text_style = [family, size, weight, style];
    this._co.font = style + " " + weight + " " + size + "px " + family;
};

/**
 * _beginPath - Start a new path
 * @private
 */
GraphicsSVG.prototype._beginPath = function () {
    this._path = [];
    this._path_polygon = null;
    this._path_first_point = null;
};

/**
 * _moveTo - In the current path, move to (x,y)
 * @param x {number} - x coordinate
 * @param y {number} - y coordinate
 * @private
 */
GraphicsSVG.prototype._moveTo = function (x, y) {
    if (this._path_polygon === null) {
        this._path_polygon = [];
        this._path.push({
            "type": "polygon",
            "path": this._path_polygon
        });
    }
    this._path_polygon.push(["M", x.toFixed(2), y.toFixed(2)].join(" "));
    this._path_first_point = [x, y];
};

/**
 * _lineTo - In the current path, connect a line to (x,y)
 * @param x {number} - x coordinate
 * @param y {number} - y coordinate
 * @private
 */
GraphicsSVG.prototype._lineTo = function (x, y) {
    if (this._path_polygon === null) {
        this._moveTo(x, y);
        return;
    }
    this._path_polygon.push(["L", x.toFixed(2), y.toFixed(2)].join(" "));
};

/**
 * _closePath - Close the current path
 * @private
 */
GraphicsSVG.prototype._closePath = function () {
    if (this._path_first_point) this._lineTo(this._path_first_point[0], this._path_first_point[1]);
};

/**
 * _rect - Create a rectangular path
 * @param x_min {number} - x coordinate of bottom-left corner
 * @param y_min {number} - y coordinate of bottom-left corner
 * @param width {number} - The width of the box
 * @param height {number} - The height of the box
 * @private
 */
GraphicsSVG.prototype._rect = function (x_min, y_min, width, height) {
    this._path_polygon = null;
    this._path.push({
        "type": "rect",
        "path": [x_min.toFixed(2), y_min.toFixed(2), width.toFixed(2), height.toFixed(2)]
    });
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
GraphicsSVG.prototype._arc = function (x, y, r, start, end, counterclockwise) {
    if ((start === 0) && (end === 2 * Math.PI)) {
        this._path_polygon = null;
        this._path.push({
            "type": "circle",
            "path": [x.toFixed(2), y.toFixed(2), r.toFixed(2)]
        });
    } else {
        var polarToCartesian = function (centerX, centerY, radius, angleInRadians) {
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        };
        start = start % (2*Math.PI);
        end = end % (2*Math.PI);
        var diff = end - start;
        if (diff < 0) diff += 2*Math.PI;

        var startPos = polarToCartesian(x, y, r, start);
        var endPos = polarToCartesian(x, y, r, end);
        var largeArcFlag = counterclockwise ? ((diff > Math.PI) ? 0 : 1) : ((diff > Math.PI) ? 1 : 0);
        var sweep = toInt(!counterclockwise);
        this._lineTo(startPos.x, startPos.y);
        this._path_polygon.push([
            "A", r.toFixed(2), r.toFixed(2),
            0, largeArcFlag, sweep,
            endPos.x.toFixed(2), endPos.y.toFixed(2)
        ].join(" "));
    }
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
GraphicsSVG.prototype._bezierCurveTo = function (x1, y1, x2, y2, x, y) {
    if (this._path_polygon !== null) {
        this._path_polygon.push(["C",
            x1.toFixed(2), y1.toFixed(2), ",",
            x2.toFixed(2), y2.toFixed(2), ",",
            x.toFixed(2), y.toFixed(2)].join(" "));
    }
};

/**
 * __realisePath - Render the current path into an SVG string
 * @param style {string} - The HTML styles to apply to this SVG path element
 * @returns {string}
 * @private
 */
GraphicsSVG.prototype.__realisePath = function (style) {
    var text = "";
    $.each(this._path, function (index, item) {
        if (item["type"] === "rect") {
            text += '<rect x="' + item["path"][0] + '" y="' + item["path"][1] + '" width="' + item["path"][2] + '" height="' + item["path"][3] + '" ' + style + ' />';
        } else if (item["type"] === "circle") {
            text += '<circle cx="' + item["path"][0] + '" cy="' + item["path"][1] + '" r="' + item["path"][2] + '" ' + style + ' />';
        } else if (item["type"] === "polygon") {
            text += '<path d="';
            text += item["path"].join(" ");
            text += '" ' + style + ' />';
        }
    });
    return text;
};

/**
 * _stroke - Stroke the current path
 * @private
 */
GraphicsSVG.prototype._stroke = function () {
    var style = 'fill="none" stroke="' + this._stroke_style + '" stroke-width="' + this._line_width + '"';
    var l = this._contextStack.length - 1;
    this._contextStack[l]["children"].push({
        "open": this.__realisePath(style),
        "close": "",
        "children": []
    });
};

/**
 * _fill - Fill the region outlined by the current path
 * @private
 */
GraphicsSVG.prototype._fill = function () {
    var style = 'stroke="none" fill="' + this._fill_style + '"';
    var l = this._contextStack.length - 1;
    this._contextStack[l]["children"].push({
        "open": this.__realisePath(style),
        "close": "",
        "children": []
    });
};

/**
 * _setClip - Use the current path as a clipping region
 * @private
 */
GraphicsSVG.prototype._setClip = function () {
    this._defs["children"].push({
        "open": '<clipPath id="clip' + this._clip_path_counter + '">',
        "close": "</clipPath>",
        "children": [{
            "open": this.__realisePath(""),
            "close": "",
            "children": []
        }]
    });

    var clipping = {
        "open": '<g clip-path="url(#clip' + this._clip_path_counter + ')">',
        "close": '</g>',
        "children": []
    };

    var l = this._contextStack.length - 1;
    this._contextStack[l]["children"].push(clipping);
    this._contextStack.push(clipping);
    this._clip_path_counter++;
};

/**
 * _unsetClip - Revert the most recently applied clipping region
 * @private
 */
GraphicsSVG.prototype._unsetClip = function () {
    this._contextStack.pop()
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
GraphicsSVG.prototype._text = function (x, y, h_align, v_align, filled, text, mustnt_collide, add_to_collision_map) {

    if (mustnt_collide || add_to_collision_map) {
        var width = this._co.measureText(text).width;
        var height = this._text_style[1];

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

    // Convert vertical alignment into a value for the SVG dominant-baseline attribute
    var v_align_text;
    if (v_align < 0) v_align_text = null;
    else if (v_align > 0) v_align_text = "hanging";
    else v_align_text = "middle";

    // Convert horizontal alignment into a value for the SVG text-anchor attribute
    var h_align_text;
    if (h_align < 0) h_align_text = "start";
    else if (h_align > 0) h_align_text = "end";
    else h_align_text = "middle";

    // Start creating an XML text element
    var element = '<text x="' + x.toFixed(2) + '" y="' + y.toFixed(2) + '" ';
    if (this._text_style[0])
        element += 'font-family="' + this._text_style[0] + '" ';
    if (this._text_style[1])
        element += 'font-size="' + this._text_style[1] + '" ';
    if (this._text_style[2])
        element += 'font-weight="' + this._text_style[2] + '" ';
    if (this._text_style[3])
        element += 'font-style="' + this._text_style[3] + '" ';
    element += 'text-anchor="' + h_align_text + '" ';
    if (v_align_text)
        element += 'alignment-baseline="' + v_align_text + '" ';

    if (filled) element += 'stroke="none" fill="' + this._fill_style + '" ';
    else element += 'fill="none" stroke="' + this._stroke_style + '" stroke-width="' + this._line_width + '" ';

    // Close text element, after putting text inside it
    element += '>' + text + '</text>';

    // Add text element to XML tree
    var l = this._contextStack.length - 1;
    this._contextStack[l]["children"].push({
        "open": element,
        "close": "",
        "children": []
    });

    return 0; // successfully rendered
};

/**
 * _textWidth - Measure the width of a text string in the current typeface
 * @param text {string} - The text string to measure
 * @returns {number} - The width of the string (pixels)
 * @private
 */
GraphicsSVG.prototype._textWidth = function (text) {
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
GraphicsSVG.prototype._queueText = function (x, y, h_align, v_align, filled, text, priority) {
    this._text_queue.push([priority, x, y, h_align, v_align, filled, text,
        this._text_style, this._stroke_style, this._line_width, this._fill_style]);
};

/**
 * _unqueueText - Render all of the queued text labels, in descending order of priority.
 * @private
 */
GraphicsSVG.prototype._unqueueText = function () {
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
        self._text(x[1], x[2], x[3], x[4], x[5], x[6], 1, 1);
    });

    // Empty text queue
    this._text_queue = [];
};

/**
 * _drawImage - Draw an image onto the canvas. Note that this is not implemented for SVG output/
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
GraphicsSVG.prototype._drawImage = function (img, sx, sy, swidth, sheight, x, y, width, height) {
    // This operation is not supported for SVG images!!
};

/**
 * _render - Render the output SVG file. Return a string containing an SVG document.
 * @returns {string}
 * @private
 */
GraphicsSVG.prototype._render = function () {
    var text = "";

    var iterate = function (element) {
        text += element["open"] + "\n";
        $.each(element["children"], function (index, child) {
            iterate(child);
        });
        if (element["close"]) text += element["close"] + "\n";
    };

    iterate(this._document);
    return text;
};

/**
 * _composite - Composite the contents of another GraphicsSVG canvas onto this one.
 * @param other {GraphicsSVG} - The other GraphicsSVG canvas
 * @private
 */
GraphicsSVG.prototype._composite = function (other) {
    var defs_this = this._document["children"][0];
    var body_this = this._document["children"][1];
    var defs_other = other._document["children"][0];
    var body_other = other._document["children"][1];

    defs_this["children"] = defs_this["children"].concat(defs_other["children"]);
    body_this["children"] = body_this["children"].concat(body_other["children"]);
};
