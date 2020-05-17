// jsplot_canvas.js

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
 * JSPlot_Canvas - a page onto which we can draw graphs, represented by JSPlot_Graph objects.
 * @param initialItemList {Object.<string, JSPlot_Graph>} - Initial list of items to render onto this canvas
 * @param settings {Object} - Configuration options for this canvas
 * @constructor
 */

function JSPlot_Canvas(initialItemList, settings) {
    /** @type {JSPlot_Canvas} */
    var self = this;

    // Populate initial list of items to render onto canvas
    this.itemList = initialItemList;

    // Default rendering settings
    this.settings = {};
    this.settings.allow_export_png = true;
    this.settings.allow_export_svg = true;

    // Constants which affect rendering
    this.constants = {};
    this.constants.DEFAULT_LINEWIDTH = 0.566929;  // 0.2mm in TeX points
    this.constants.DEFAULT_PS = 3.0;
    this.constants.ARROW_ANGLE = 45.0 * Math.PI / 180;
    this.constants.ARROW_CONSTRICT = 0.2;
    this.constants.ARROW_HEADSIZE = 6.0;
    this.constants.AXES_LINEWIDTH = 2.5;
    this.constants.AXES_MAJTICKLEN = 8;
    this.constants.AXES_MINTICKLEN = 4;
    this.constants.AXES_SEPARATION = 0.008;
    this.constants.AXES_TEXTGAP = 6;
    this.constants.AXES_LABELGAP = 34;
    this.constants.COLORSCALE_MARG = 3e-3;
    this.constants.COLORSCALE_WIDTH = 4e-3;
    this.constants.GRID_MAJLINEWIDTH = 0.8;
    this.constants.GRID_MINLINEWIDTH = 0.5;

    // Read user supplied settings
    this.configure(settings);

    // Styling of items to appear on this page
    this.styling = new JSPlot_Styling(this);

    // Internal state
    this.page_width = 1024;
    this.html_initialised = false;
    this.workspace = {};
    this.workspace.errorLog = "";

    // Interactivity state
    this.interactive_holder_element = null;
    this.interactive_canvas_element = null;
    this.is_pinching = false;
    this.pinch_distance = 0;
    this.mousedown = false;
    this.pos_start = [0, 0];
    this.pos_latest = [0, 0];
    this.needs_refresh = false;

    this.canvas = null;
    /** @type {?JSPlot_ThreeDimBuffer} */
    this.threeDimensionalBuffer = null;

    // Check if we need to re-render
    setInterval(function () {
        if (self.needs_refresh && (self.interactive_holder_element !== null)) {
            self.renderToCanvas(self.interactive_holder_element);
            self.needs_refresh = false;
        }
    }, 100); // poll for mouse moves at 10fps
}

/**
 * configure - Configure settings for a canvas
 * @param settings {Object} - An object containing settings
 */
JSPlot_Canvas.prototype.configure = function (settings) {
    /** @type {JSPlot_Canvas} */
    var self = this;

    $.each(settings, function (key, value) {
        switch (key) {
            case "allow_export_png":
                self.settings.allow_export_png = value;
                break;
            case "allow_export_svg":
                self.settings.allow_export_svg = value;
                break;
            default:
                throw "Unrecognised canvas setting " + key;
        }
    });
};

/**
 * _render - Render this page to an output context
 * @param renderer - The output context we should render to
 * @private
 */
JSPlot_Canvas.prototype._render = function (renderer) {
    /** @type {JSPlot_Canvas} */
    var self = this;
    /** @type {JSPlot_BoundingBox} */
    var boundingBox = new JSPlot_BoundingBox();

    // Make a list of all items, sorted by z_index
    var sorted_item_list = [];
    $.each(this.itemList, function (index, item) {
        sorted_item_list.push(item);
    });
    sorted_item_list.sort(function (a, b) {
        return (a.z_index > b.z_index) ? 1 : -1;
    });

    // Work out axis ranges of all graphs
    $.each(sorted_item_list, function (index, item) {
        item.calculateDataRanges(self);
    });

    // Work out bounding box of all elements
    $.each(sorted_item_list, function (index, item) {
        boundingBox.includeBox(item.calculateBoundingBox());
    });

    // Instantiate plotting canvas
    /** @type GraphicsCanvas */
    this.canvas = renderer(boundingBox.right - boundingBox.left, boundingBox.bottom - boundingBox.top);
    this.canvas._translate(-boundingBox.left, -boundingBox.top, 0);

    // Create a 3D rendering buffer
    this.threeDimensionalBuffer = new JSPlot_ThreeDimBuffer();

    // Render each item
    $.each(sorted_item_list, function (index, item) {
        item.render();
    });

    // Undo translation
    this.canvas._unsetTranslate();
};

/**
 * renderToPNG - Render this page to a PNG file
 * @param page_width - The width of the canvas we should render onto (used for scaling elements with sizes as %)
 * @returns {void|string}
 */
JSPlot_Canvas.prototype.renderToPNG = function (page_width) {
    if (page_width !== undefined) this.page_width = page_width;
    var tmp = document.createElement('canvas');
    var renderer = function (width, height) {
        return new GraphicsCanvas(tmp, width, height);
    };
    this._render(renderer);
    return this.canvas._renderPNG("plot.png");
};

/**
 * renderToSVG - Render this page to SVG, which is returned as a string
 * @param page_width - The width of the canvas we should render onto (used for scaling elements with sizes as %)
 * @returns {void|string}
 */
JSPlot_Canvas.prototype.renderToSVG = function (page_width) {
    if (page_width !== undefined) this.page_width = page_width;
    var renderer = function (width, height) {
        return new GraphicsSVG(width, height);
    };
    this._render(renderer);
    return this.canvas._render();
};

/**
 * renderToCanvas - Render this page onto an HTML5 canvas element
 * @param target_element - The HTML5 canvas element to draw onto
 */
JSPlot_Canvas.prototype.renderToCanvas = function (target_element) {
    /** @type {JSPlot_Canvas} */
    var self = this;

    var render_canvas = function () {
        target_element = $(target_element);
        self.page_width = target_element.width();

        // Create HTML for this canvas
        if (!self.html_initialised) {
            var html = "<div><canvas width='1' height='1'></canvas></div>";

            if (self.settings.allow_export_png) {
                html += "<input class='btn btn-sm btn-success jsplot_export_png' type='button' value='Export PNG' />";
            }

            if (self.settings.allow_export_svg) {
                html += "<input class='btn btn-sm btn-success jsplot_export_svg' type='button' value='Export SVG' />";
            }

            // Ensure that if the canvas over-fills the target, it doesn't break page
            target_element.css('overflow', 'hidden');

            // Create target elements
            target_element.html(html);

            // Wire up buttons to export images
            $(".jsplot_export_png").click(function () {
                self.renderToPNG();
            });


            $(".jsplot_export_svg").click(function () {
                var doc = self.renderToSVG();
                saveBlob("plot.svg", doc);
            });

            // Bind mouse events
            var fore = $("canvas", target_element);
            self.interactive_holder_element = target_element;
            self.interactive_canvas_element = fore;

            fore.mousedown(function (e) {
                self.mouseDown(e);
            });
            fore.mouseup(function (e) {
                self.mouseUp(e);
            });
            fore.mousemove(function (e) {
                self.mouseDrag(e);
            });
            fore.mouseleave(function () {
                self.mouseUp(0);
            });

            // Bind mouse scroll-wheel events
            var wheelEvt = "onwheel" in document.createElement("div") ? "wheel" :  // Modern browsers support "wheel"
                document.onmousewheel !== undefined ? "mousewheel" :  // Webkit and IE support at least "mousewheel"
                    "DOMMouseScroll";  // let's assume that remaining browsers are older Firefox
            fore.bind(wheelEvt, function (e) {
                self.displayWheel(e.originalEvent);
            });

            // Bind touch events
            fore.on({
                "touchstart": function (e) {
                    e.preventDefault();
                    var oe = e.originalEvent;
                    if (oe.touches.length === 1) {
                        self.is_pinching = false;
                        self.mouseDown(oe.touches[0]);
                    } else if (oe.touches.length === 2) {
                        self.is_pinching = true;
                        self.pinch_distance = self.hypot(oe.touches[0].pageX - oe.touches[1].pageX, oe.touches[0].pageY - oe.touches[1].pageY);
                    }
                },
                "touchend": function (e) {
                    e.preventDefault();
                    if (!self.is_pinching) self.mouseUp(0);
                    self.is_pinching = false;
                    self.mousedown = false;
                },
                "touchmove": function (e) {
                    e.preventDefault();
                    var oe = e.originalEvent;
                    if (!self.is_pinching) {
                        self.mouseDrag(oe.touches[0]);
                    } else {
                        var newpinch_distance = self.hypot(oe.touches[0].pageX - oe.touches[1].pageX, oe.touches[0].pageY - oe.touches[1].pageY);
                        if (Math.abs(newpinch_distance - self.pinch_distance) > 25) {
                            self.displayWheel(oe.touches[0], self.pinch_distance - newpinch_distance);
                            self.pinch_distance = newpinch_distance;
                        }
                    }
                },
                "touchcancel": function (e) {
                    e.preventDefault();
                    if (!self.is_pinching) self.mouseUp(0);
                    self.is_pinching = false;
                    self.mousedown = false;
                }
            });

            // Re-render if the page changes size
            $(window).resize(function () {
                self.renderToCanvas(self.interactive_holder_element);
            });

            // We have now initialised the HTML elements we will use
            self.html_initialised = true;
        }

        // Render plot onto the canvas we have just created
        var target_canvas = $("canvas", target_element)[0];

        var renderer = function (width, height) {
            return new GraphicsCanvas(target_canvas, width, height);
        };
        self._render(renderer);
    }

    // Render now
    render_canvas();
};

/**
 * addItem - Add a graph to this graphics canvas
 * @param name {string} - The name to use to later refer to this graph (for example when linking axes between plots)
 * @param item {JSPlot_Graph} - The graph we are to add to this canvas
 */
JSPlot_Canvas.prototype.addItem = function (name, item) {
    this.itemList[name] = item;
};

/**
 * removeItem - Remove a graph from this graphics canvas
 * @param name {string} - The name of the graph we are to remove
 */
JSPlot_Canvas.prototype.removeItem = function (name) {
    delete this.itemList[name];
};

// Interactivity

JSPlot_Canvas.prototype.hypot = function (x, y) {
    return Math.sqrt(x * x + y * y);
};


JSPlot_Canvas.prototype.mouseDown = function (e) {
    this.pos_start = getCursorPos(e, this.interactive_canvas_element);
    this.mousedown = true;
};

JSPlot_Canvas.prototype.mouseDrag = function (e) {
    var p;
    if (e === 0) {
        p = this.pos_latest;
    } else {
        p = getCursorPos(e, this.interactive_canvas_element);
        this.pos_latest = p;
    }

    if (!this.mousedown) return;
    var x_offset = (p[0] - this.pos_start[0]);
    var y_offset = (p[1] - this.pos_start[1]);

    // Pass scroll event to all graphs
    $.each(this.itemList, function (index, item) {
        item.interactive_scroll(x_offset, y_offset);
    });
    this.pos_start = p;
};

JSPlot_Canvas.prototype.mouseUp = function (e) {
    this.mouseDrag(e);
    this.mousedown = false;
};

JSPlot_Canvas.prototype.displayWheel = function (evt, explicit_delta) {

    // Throttle events so that zooming isn't uncontrollably fast
    var time_now = Date.now();
    if ((typeof this._lastZoomEventTime !== 'undefined') && (time_now < this._lastZoomEventTime + 100)) {
        // Prevent default event handler
        if (evt.preventDefault) evt.preventDefault();
        evt.returnValue = false;
        return;
    }

    // Work out which direction zoom is moving in
    var delta;
    if (typeof explicit_delta !== 'undefined') {
        delta = explicit_delta;
    } else {
        delta = evt.deltaY || evt.wheelDelta;
    }

    // Pass scroll event to all graphs
    var event_handled = false
    $.each(this.itemList, function (index, item) {
        event_handled |= item.interactive_zoom(delta < 0);
    });

    if (event_handled) {
        // Prevent default event handler
        if (evt.preventDefault) evt.preventDefault();
        evt.returnValue = false;
        this._lastZoomEventTime = time_now;
    }
};
