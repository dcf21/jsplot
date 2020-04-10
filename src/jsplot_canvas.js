// jsplot_canvas.js

/**
 * JSPlot_Canvas - a page onto which we can draw graphs, represented by JSPlot_Graph objects.
 * @param initialItemList {Object.<string, JSPlot_Graph>}
 * @constructor
 */

function JSPlot_Canvas(initialItemList) {
    this.itemList = initialItemList;

    // Default rendering settings
    this.settings = {};
    this.settings.EPS_DEFAULT_LINEWIDTH = 0.566929;  // 0.2mm in TeX points
    this.settings.EPS_DEFAULT_PS = 3.0;
    this.settings.EPS_ARROW_ANGLE = 45.0 * Math.PI / 180;
    this.settings.EPS_ARROW_CONSTRICT = 0.2;
    this.settings.EPS_ARROW_HEADSIZE = 6.0;
    this.settings.EPS_AXES_LINEWIDTH = 1.0;
    this.settings.EPS_AXES_MAJTICKLEN = 0.0012;
    this.settings.EPS_AXES_MINTICKLEN = 0.000848528137;  // 0.0012 divided by sqrt(2)
    this.settings.EPS_AXES_SEPARATION = 0.008;
    this.settings.EPS_AXES_TEXTGAP = 0.003;
    this.settings.EPS_COLORSCALE_MARG = 3e-3;
    this.settings.EPS_COLORSCALE_WIDTH = 4e-3;
    this.settings.EPS_GRID_MAJLINEWIDTH = 1.0;
    this.settings.EPS_GRID_MINLINEWIDTH = 0.5;

    // Styling of items to appear on this page
    this.styling = new JSPlot_Styling(this);

    // Internal state
    this.page_width = 1024;
    this.workspace = {};
    this.workspace.errorLog = "";

    this.canvas = null;
    /** @type {?JSPlot_ThreeDimBuffer} */
    this.threeDimensionalBuffer = null;
    this.canvas = null;
}

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

    // Work out bounding box of all elements
    $.each(this.itemList, function (index, item) {
        boundingBox.includeBox(item.calculateBoundingBox(self));
    });

    // Work out axis ranges of all graphs
    $.each(this.itemList, function (index, item) {
        item.calculateDataRanges();
    });

    // Instantiate plotting canvas
    /** @type GraphicsCanvas */
    this.canvas = renderer(boundingBox.right - boundingBox.left, boundingBox.bottom - boundingBox.top);
    this.canvas._translate(-boundingBox.left, -boundingBox.top, 0);

    // Create a 3D rendering buffer
    this.threeDimensionalBuffer = new JSPlot_ThreeDimBuffer();

    // Render each item
    $.each(this.itemList, function (index, item) {
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
        this.page_width = target_element.width();

        // Create target element, and ensure that if the canvas over-fills the target, it doesn't break page
        target_element.css('overflow', 'hidden');
        target_element.html("<canvas width='1' height='1'></canvas>");

        var target_canvas = $("canvas", target_element)[0];

        var renderer = function (width, height) {
            return new GraphicsCanvas(target_canvas, width, height);
        };
        self._render(renderer);
    }

    // Render now
    render_canvas();

    // Re-render is the page changes size
    $(window).resize(render_canvas);
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

