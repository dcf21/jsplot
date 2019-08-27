// jsplot_canvas.js

/**
 * JSPlot_Canvas - a page onto which we can draw graphs, represented by JSPlot_Graph objects.
 * @constructor
 */

function JSPlot_Canvas() {
    this.itemList = {};

    // Rendering settings
    this.settings = [];
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

    // Internal state
    this.workspace = {};
    this.workspace.errorLog = "";

    this.canvas = null;
    this.threeDimensionalBuffer = null;
}

/**
 * _render - Render this page to an output context
 * @param renderer - The output context we should render to
 * @private
 */
JSPlot_Canvas.prototype._render = function (renderer) {
    var self = this;
    var boundingBox = new JSPlot_BoundingBox();

    // Work out bounding box of all elements
    $.each(this.itemList, function(index, item) {
        boundingBox.includeBox(item.calculateBoundingBox(self));
    });

    // Work out axis ranges of all graphs
    $.each(this.itemList, function(index, item) {
        item.calculateDataRanges();
    });

    // Instantiate plotting canvas
    this.canvas = renderer(boundingBox.left-boundingBox.right, boundingBox.bottom-boundingBox.top);

    // Create a 3D rendering buffer
    this.threeDimensionalBuffer = new JSPlot_ThreeDimBuffer();

    // Render each item
    $.each(this.itemList, function(index, item) {
        item.render();
    });
};

/**
 * renderToPNG - Render this page to a PNG file
 */
JSPlot_Canvas.prototype.renderToPNG = function () {
    var tmp = document.createElement('canvas');
    var renderer = function(width, height) { return new GraphicsCanvas(tmp, width, height); };
    this._render(renderer);
    return this.canvas._renderPNG("plot.png");
};

/**
 * renderToSVG - Render this page to SVG, which is returned as a string
 * @returns {void|string}
 */
JSPlot_Canvas.prototype.renderToSVG = function () {
    var renderer = function(width, height) { return new GraphicsSVG(width, height); };
    this._render(renderer);
    return this.canvas._render();
};

/**
 * renderToCanvas - Render this page onto an HTML5 canvas element
 * @param targetElement - The HTML5 canvas element to draw onto
 */
JSPlot_Canvas.prototype.renderToCanvas = function (targetElement) {
    var renderer = function(width, height) { return new GraphicsCanvas(targetElement, width, height); };
    this._render(renderer);
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

