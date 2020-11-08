// jsplot_styling.js

// -------------------------------------------------
// Copyright 2020-2021 Dominic Ford.

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
 * JSPlot_Styling - code to produce a numbered list of point types, line types, colors, etc
 * @constructor
 * @param page - The JSPlot_Canvas object we are rendering onto
 */
function JSPlot_Styling(page) {
    this.page = page;
    this.defaultColors = this.getDefaultColors();
    this.pointTypes = this.getPointTypes();
}

/**
 * setLineType - switch the drawing context of this.page to use a particular numbered line type
 * @param color - The JSPlot_Color object representing the color we are to draw with
 * @param lineType - The integer index of the line type we are to use
 * @param lineWidth - The width of the line to draw
 * @param offset - The offset to apply to the line type
 */
JSPlot_Styling.prototype.setLineType = function (color, lineType, lineWidth, offset) {
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

    this.page.canvas._strokeStyle(color, lineWidth);
};

/**
 * defaultColors - Default sequence of colors to use on plots.
 * @type {Array<JSPlot_Color>}
 */
JSPlot_Styling.prototype.getDefaultColors = function () {
    return [
        new JSPlot_Color(1, 0, 0, 1),
        new JSPlot_Color(0, 0, 1, 1),
        new JSPlot_Color(0, 0.75, 0, 1),
        new JSPlot_Color(1, 0, 1, 1),
        new JSPlot_Color(0, 0.75, 0.75, 1),
        new JSPlot_Color(0, 0, 0, 1)
    ];
};

/**
 * pointTypes - Functions to draw different shapes of points.
 * @type {Array<function>}
 */
JSPlot_Styling.prototype.getPointTypes = function () {
    /** @type {JSPlot_Styling} */
    var self = this;
    return [
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._fillStyle(color);
            self.page.canvas._beginPath();
            self.page.canvas._arc(x, y, size, 0, 2 * Math.PI, 0);
            self.page.canvas._fill();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._fillStyle(color);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x - size, y - size);
            self.page.canvas._lineTo(x - size, y + size);
            self.page.canvas._lineTo(x + size, y + size);
            self.page.canvas._lineTo(x + size, y - size);
            self.page.canvas._fill();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._fillStyle(color);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x + size, y + size);
            self.page.canvas._lineTo(x, y - size);
            self.page.canvas._lineTo(x - size, y + size);
            self.page.canvas._fill();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._fillStyle(color);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x, y - size);
            for (var i = 1; i < 4; i++)
                self.page.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 4),
                    y - size * Math.cos(2 * Math.PI * i / 4));
            self.page.canvas._fill();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._fillStyle(color);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x, y - size);
            for (var i = 1; i < 6; i++)
                self.page.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 6),
                    y - size * Math.cos(2 * Math.PI * i / 6));
            self.page.canvas._fill();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._fillStyle(color);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x, y - size);
            for (var i = 1; i < 5; i++)
                self.page.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 5),
                    y - size * Math.cos(2 * Math.PI * i / 5));
            self.page.canvas._fill();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._fillStyle(color);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x + size, y - size);
            self.page.canvas._lineTo(x, y + size);
            self.page.canvas._lineTo(x - size, y - size);
            self.page.canvas._fill();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._fillStyle(color);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x - size, y - size);
            self.page.canvas._lineTo(x + size, y);
            self.page.canvas._lineTo(x - size, y + size);
            self.page.canvas._fill();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._fillStyle(color);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x + size, y - size);
            self.page.canvas._lineTo(x - size, y);
            self.page.canvas._lineTo(x + size, y + size);
            self.page.canvas._fill();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x - size, y - size);
            self.page.canvas._lineTo(x + size, y + size);
            self.page.canvas._moveTo(x - size, y + size);
            self.page.canvas._lineTo(x + size, y - size);
            self.page.canvas._stroke();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x - size, y - size);
            self.page.canvas._lineTo(x - size, y + size);
            self.page.canvas._lineTo(x + size, y + size);
            self.page.canvas._lineTo(x + size, y - size);
            self.page.canvas._closePath();
            self.page.canvas._stroke();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._arc(x, y, size, 0, 2 * Math.PI, 0);
            self.page.canvas._stroke();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x + size, y + size);
            self.page.canvas._lineTo(x, y - size);
            self.page.canvas._lineTo(x - size, y + size);
            self.page.canvas._closePath();
            self.page.canvas._stroke();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x, y - size);
            for (var i = 1; i < 4; i++)
                self.page.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 4),
                    y - size * Math.cos(2 * Math.PI * i / 4));
            self.page.canvas._closePath();
            self.page.canvas._stroke();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x, y - size);
            for (var i = 1; i < 6; i++)
                self.page.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 6),
                    y - size * Math.cos(2 * Math.PI * i / 6));
            self.page.canvas._closePath();
            self.page.canvas._stroke();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x, y - size);
            for (var i = 1; i < 5; i++)
                self.page.canvas._lineTo(x + size * Math.sin(2 * Math.PI * i / 5),
                    y - size * Math.cos(2 * Math.PI * i / 5));
            self.page.canvas._closePath();
            self.page.canvas._stroke();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x + size, y - size);
            self.page.canvas._lineTo(x, y + size);
            self.page.canvas._lineTo(x - size, y - size);
            self.page.canvas._closePath();
            self.page.canvas._stroke();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x - size, y - size);
            self.page.canvas._lineTo(x + size, y);
            self.page.canvas._lineTo(x - size, y + size);
            self.page.canvas._closePath();
            self.page.canvas._stroke();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x + size, y - size);
            self.page.canvas._lineTo(x - size, y);
            self.page.canvas._lineTo(x + size, y + size);
            self.page.canvas._closePath();
            self.page.canvas._stroke();
        },
        function (x, y, pointSize, pointLineWidth, color) {
            var size = pointSize * self.page.constants.DEFAULT_PS;
            self.page.canvas._strokeStyle(color, pointLineWidth);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x, y - size);
            for (var i = 1; i < 5; i++)
                self.page.canvas._lineTo(x + size * Math.sin(4 * Math.PI * i / 5),
                    y - size * Math.cos(4 * Math.PI * i / 5));
            self.page.canvas._closePath();
            self.page.canvas._stroke();
        }
    ];
};
