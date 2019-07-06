// jsplot_canvas.js

function JSPlot_canvas() {
    var self = this;

    this.renderer = GraphicsCanvas;
    this.target = "png";
    this.itemList = {};

    // Rendering settings
    this.settings = [];
    this.settings.EPS_DEFAULT_LINEWIDTH = 0.566929;       // 0.2mm in TeX points
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
    this.state = [];
    this.canvas = null;
    this.threeDimensionalBuffer = null;

    // Functions to draw different shapes of points
    this.point_types = {
        1: function (x, y, pointSize, pointLineWidth, color) {
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
        2: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._arc(x, y, size, 0, 360, 0);
            self.canvas._stroke();
        },
        3: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x + size, y + size);
            self.canvas._lineTo(x, y - size);
            self.canvas._lineTo(x - size, y + size);
            self.canvas._closePath();
            self.canvas._stroke();
        },
        4: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x, y - size);
            for (var i = 1; i < 4; i++)
                self.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 4), y - size * Math.cos(2 * Math.PI * i / 4));
            self.canvas._closePath();
            self.canvas._stroke();
        },
        5: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x, y - size);
            for (var i = 1; i < 6; i++)
                self.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 6), y - size * Math.cos(2 * Math.PI * i / 6));
            self.canvas._closePath();
            self.canvas._stroke();
        },
        6: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x, y - size);
            for (var i = 1; i < 5; i++)
                self.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 5), y - size * Math.cos(2 * Math.PI * i / 5));
            self.canvas._closePath();
            self.canvas._stroke();
        },
        7: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x + size, y - size);
            self.canvas._lineTo(x, y + size);
            self.canvas._lineTo(x - size, y - size);
            self.canvas._closePath();
            self.canvas._stroke();
        },
        8: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x - size, y - size);
            self.canvas._lineTo(x + size, y);
            self.canvas._lineTo(x - size, y + size);
            self.canvas._closePath();
            self.canvas._stroke();
        },
        9: function (x, y, pointSize, pointLineWidth, color) {
            var size = size * self.settings.EPS_DEFAULT_PS * 0.75;
            self.canvas._strokeStyle(color, pointLineWidth);
            self.canvas._beginPath();
            self.canvas._moveTo(x + size, y - size);
            self.canvas._lineTo(x - size, y);
            self.canvas._lineTo(x + size, y + size);
            self.canvas._closePath();
            self.canvas._stroke();
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

JSPlot_canvas.prototype.setModePNG = function () {
    this.renderer = GraphicsCanvas;
    this.target = "png";
};

JSPlot_canvas.prototype.setModeSVG = function () {
    this.renderer = GraphicsSVG;
    this.target = "svg";
};

JSPlot_canvas.prototype.setModeCanvas = function (targetElement) {
    this.renderer = GraphicsCanvas;
    this.target = "canvas";
    this.targetElement = targetElement;

};

JSPlot_canvas.prototype.addItem = function (name, item) {
    this.itemList[name] = item;
};

JSPlot_canvas.prototype.removeItem = function (name) {
    delete this.itemList[name];
};

// Line types
JSPlot_canvas.prototype.setLineType = function (color, lineType, lineWidth, offset) {
    var dash_pattern;

    lineType = (lineType - 1) % 9;
    while (lineType < 0) lineType += 9;

    switch (lineType) {
        case 0:
            // solid
            dash_pattern = [offset];
            break;
        case 1:
            // dashed
            dash_pattern = [2 * lineWidth, offset];
            break;
        case 2:
            // dotted
            dash_pattern = [2 * lineWidth, offset];
            break;
        case 3:
            // dash-dotted
            dash_pattern = [2 * lineWidth, 2 * lineWidth, 2 * lineWidth, offset];
            break;
        case 4:
            // long dash
            dash_pattern = [7 * lineWidth, 2 * lineWidth, offset];
            break;
        case 5:
            // long dash - dot
            dash_pattern = [7 * lineWidth, 2 * lineWidth, 2 * lineWidth, offset];
            break;
        case 6:
            // long dash - dot dot
            dash_pattern = [7 * lineWidth, 2 * lineWidth, 2 * lineWidth, 2 * lineWidth, offset];
            break;
        case 7:
            // long dash - dot dot dot
            dash_pattern = [7 * lineWidth, 2 * lineWidth, 2 * lineWidth, 2 * lineWidth, 2 * lineWidth, offset];
            break;
        case 8:
            // long dash - dash
            dash_pattern = [7 * lineWidth, 2 * lineWidth, 2 * lineWidth, 2 * lineWidth, offset];
            break;
    }

    this.canvas._strokeStyle(color, lineWidth);
};