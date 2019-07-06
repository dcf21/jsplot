// graphics_canvas.js

// This class wraps functions for writing on an HTML5 canvas, providing a consistent interface for producing PNG and
// SVG output.

function GraphicsCanvas(output_canvas, width, height) {
    this._ca = output_canvas;
    this._collision_map = new GraphicsCollisionMap();
    this._resize(width, height);
}

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

GraphicsCanvas.prototype._clear = function () {
    this._resize(this._width, this._height);
};

GraphicsCanvas.prototype._translate = function (x, y, rotation) {
    this._co.save();
    this._co.translate(x, y);
    this._co.rotate(rotation);
};

GraphicsCanvas.prototype._unsetTranslate = function () {
    this._co.restore();
};

GraphicsCanvas.prototype._strokeStyle = function (color, line_width) {
    this._co.strokeStyle = color;
    this._co.lineWidth = line_width;
    this._stroke_style = color;
    this._line_width = line_width;
};

GraphicsCanvas.prototype._fillStyle = function (color) {
    this._co.fillStyle = color;
    this._fill_style = color;
};

GraphicsCanvas.prototype._textStyle = function (/* string e.g. "Arial,Helvetica,sans-serif" */ family,
                                                /* int e.g. "13" */ size,
                                                /* string e.g. "bold" */ weight,
                                                /* string e.g. "italic" */ style) {
    this._text_style = [family, size, weight, style];
    this._co.font = style + " " + weight + " " + size + "px " + family;
};

GraphicsCanvas.prototype._beginPath = function () {
    this._co.beginPath();
};

GraphicsCanvas.prototype._moveTo = function (x, y) {
    this._co.moveTo(x, y);
};

GraphicsCanvas.prototype._lineTo = function (x, y) {
    this._co.lineTo(x, y);
};

GraphicsCanvas.prototype._closePath = function () {
    this._co.closePath();
};

GraphicsCanvas.prototype._rect = function (x_min, y_min, width, height) {
    this._co.rect(x_min, y_min, width, height);
};

GraphicsCanvas.prototype._arc = function (x, y, r, start, end, counterclockwise) {
    this._co.arc(x, y, r, start, end, counterclockwise);
};

GraphicsCanvas.prototype._bezierCurveTo = function (x1, y1, x2, y2, x, y) {
    this._co.bezierCurveTo(x1, y1, x2, y2, x, y);
};

GraphicsCanvas.prototype._stroke = function () {
    this._co.stroke();
};

GraphicsCanvas.prototype._fill = function () {
    this._co.closePath();
    this._co.fill();
};

GraphicsCanvas.prototype._setClip = function () {
    this._co.save();
    this._co.clip();
};

GraphicsCanvas.prototype._unsetClip = function () {
    this._co.restore();
};

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

GraphicsCanvas.prototype._textWidth = function (text) {
    return this._co.measureText(text).width;
};

GraphicsCanvas.prototype._queueText = function (x, y, h_align, v_align, filled, text, priority) {
    this._text_queue.push([priority, x, y, h_align, v_align, filled, text,
        this._text_style, this._stroke_style, this._line_width, this._fill_style]);
};

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

GraphicsCanvas.prototype._drawImage = function (img, sx, sy, swidth, sheight, x, y, width, height) {
    this._co.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
};

GraphicsCanvas.prototype._render = function () {
};

GraphicsCanvas.prototype._composite = function (other) {
    this._co.drawImage(other._ca, 0, 0);
};

GraphicsCanvas.prototype._renderPNG = function (filename) {
    if (!detectIE()) {
        var url = this._ca.toDataURL('image/png');
        window.open(url, '_blank');
    } else {
        var blob = this._ca.msToBlob();
        window.navigator.msSaveBlob(blob, filename);

    }
};
