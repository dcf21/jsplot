// jsplot_canvas.js

function JSPlot_canvas() {
    var self = this;

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

    // Default sequence of colors to use on plots
    this.defaultColors = [
        new JSPlot_Color(0, 0, 0, 1),
        new JSPlot_Color(1, 0, 0, 1),
        new JSPlot_Color(0, 0, 1, 1),
        new JSPlot_Color(0, 0.75, 0, 1),
        new JSPlot_Color(1, 0, 1, 1),
        new JSPlot_Color(0, 0.75, 0.75, 1)
    ];

    // Functions to draw different shapes of points
    this.pointTypes = {
        1: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._fillStyle(color);
            self.canvas._beginPath();
            self.canvas._moveTo(x - size, y - size);
            self.canvas._lineTo(x - size, y + size);
            self.canvas._lineTo(x + size, y + size);
            self.canvas._lineTo(x + size, y - size);
            self.canvas._fill();
        },
        2: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._fillStyle(color);
            self.canvas._beginPath();
            self.canvas._arc(x, y, size, 0, 360, 0);
            self.canvas._fill();
        },
        3: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._fillStyle(color);
            self.canvas._beginPath();
            self.canvas._moveTo(x + size, y + size);
            self.canvas._lineTo(x, y - size);
            self.canvas._lineTo(x - size, y + size);
            self.canvas._fill();
        },
        4: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._fillStyle(color);
            self.canvas._beginPath();
            self.canvas._moveTo(x, y - size);
            for (var i = 1; i < 4; i++)
                self.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 4), y - size * Math.cos(2 * Math.PI * i / 4));
            self.canvas._fill();
        },
        5: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._fillStyle(color);
            self.canvas._beginPath();
            self.canvas._moveTo(x, y - size);
            for (var i = 1; i < 6; i++)
                self.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 6), y - size * Math.cos(2 * Math.PI * i / 6));
            self.canvas._fill();
        },
        6: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._fillStyle(color);
            self.canvas._beginPath();
            self.canvas._moveTo(x, y - size);
            for (var i = 1; i < 5; i++)
                self.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 5), y - size * Math.cos(2 * Math.PI * i / 5));
            self.canvas._fill();
        },
        7: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._fillStyle(color);
            self.canvas._beginPath();
            self.canvas._moveTo(x + size, y - size);
            self.canvas._lineTo(x, y + size);
            self.canvas._lineTo(x - size, y - size);
            self.canvas._fill();
        },
        8: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._fillStyle(color);
            self.canvas._beginPath();
            self.canvas._moveTo(x - size, y - size);
            self.canvas._lineTo(x + size, y);
            self.canvas._lineTo(x - size, y + size);
            self.canvas._fill();
        },
        9: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._fillStyle(color);
            self.canvas._beginPath();
            self.canvas._moveTo(x + size, y - size);
            self.canvas._lineTo(x - size, y);
            self.canvas._lineTo(x + size, y + size);
            self.canvas._fill();
        },
        10: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x - size, y - size);
            self.canvas._lineTo(x + size, y + size);
            self.canvas._moveTo(x - size, y + size);
            self.canvas._lineTo(x + size, y - size);
            self.canvas._stroke();
        },
        11: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x - size, y - size);
            self.canvas._lineTo(x - size, y + size);
            self.canvas._lineTo(x + size, y + size);
            self.canvas._lineTo(x + size, y - size);
            self.canvas._closePath();
            self.canvas._stroke();
        },
        12: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._arc(x, y, size, 0, 360, 0);
            self.canvas._stroke();
        },
        13: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x + size, y + size);
            self.canvas._lineTo(x, y - size);
            self.canvas._lineTo(x - size, y + size);
            self.canvas._closePath();
            self.canvas._stroke();
        },
        14: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x, y - size);
            for (var i = 1; i < 4; i++)
                self.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 4), y - size * Math.cos(2 * Math.PI * i / 4));
            self.canvas._closePath();
            self.canvas._stroke();
        },
        15: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x, y - size);
            for (var i = 1; i < 6; i++)
                self.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 6), y - size * Math.cos(2 * Math.PI * i / 6));
            self.canvas._closePath();
            self.canvas._stroke();
        },
        16: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x, y - size);
            for (var i = 1; i < 5; i++)
                self.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 5), y - size * Math.cos(2 * Math.PI * i / 5));
            self.canvas._closePath();
            self.canvas._stroke();
        },
        17: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x + size, y - size);
            self.canvas._lineTo(x, y + size);
            self.canvas._lineTo(x - size, y - size);
            self.canvas._closePath();
            self.canvas._stroke();
        },
        18: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x - size, y - size);
            self.canvas._lineTo(x + size, y);
            self.canvas._lineTo(x - size, y + size);
            self.canvas._closePath();
            self.canvas._stroke();
        },
        19: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x + size, y - size);
            self.canvas._lineTo(x - size, y);
            self.canvas._lineTo(x + size, y + size);
            self.canvas._closePath();
            self.canvas._stroke();
        },
        20: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x, y - size);
            for (var i = 1; i < 5; i++)
                self.canvas._lineTo(x + size * Math.sin(4 * Math.PI * i / 5), y - size * Math.cos(4 * Math.PI * i / 5));
            self.canvas._closePath();
            self.canvas._stroke();
        }
    }
}

JSPlot_canvas.prototype._render = function (renderer) {
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

JSPlot_canvas.prototype.renderToPNG = function () {
    var tmp = document.createElement('canvas');
    var renderer = function(width, height) { return new GraphicsCanvas(tmp, width, height); };
    this._render(renderer);
    return this.canvas._renderPNG("plot.png");
};

JSPlot_canvas.prototype.renderToSVG = function () {
    var renderer = function(width, height) { return new GraphicsSVG(width, height); };
    this._render(renderer);
    return this.canvas._render();
};

JSPlot_canvas.prototype.renderToCanvas = function (targetElement) {
    var renderer = function(width, height) { return new GraphicsCanvas(targetElement, width, height); };
    this._render(renderer);
};

JSPlot_canvas.prototype.addItem = function (name, item) {
    this.itemList[name] = item;
};

JSPlot_canvas.prototype.removeItem = function (name) {
    delete this.itemList[name];
};

