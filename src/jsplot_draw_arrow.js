// jsplot_draw_arrow.js

// -------------------------------------------------
// Copyright 2020-2022 Dominic Ford.

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
 * JSPlot_DrawArrow - Primitive routine for drawing arrow
 * @constructor
 */
function JSPlot_DrawArrow() {

}

/**
 * primitive_arrow - Primitive routine for drawing arrow
 * @param page {JSPlot_Canvas} - The JSPlot_Canvas we are to draw this arrow onto
 * @param arrowType {string} - Choice of ['single', 'double', 'back', 'none']
 * @param x1 {number} - X coordinate for the start of the arrow
 * @param y1 {number} - Y coordinate for the start of the arrow
 * @param z1 {?number} - Z coordinate for the start of the arrow
 * @param x2 {number} - X coordinate for the end of the arrow
 * @param y2 {number} - Y coordinate for the end of the arrow
 * @param z2 {?number} - Z coordinate for the end of the arrow
 * @param color {JSPlot_Color} - The color to use to stroke the arrow
 * @param lineWidth {number} - The line width to use when stroking the arrow
 * @param lineType {number} - The line type to use when stroking the arrow
 */
JSPlot_DrawArrow.prototype.primitive_arrow = function(page, arrowType, x1, y1, z1, x2, y2, z2, color, lineWidth, lineType) {
    /** @type {number} */
    var x3, y3, x4, y4, x5, y5, xstart, ystart, xend, yend, direction;
    /** @type {boolean} */
    var threeDim = page.threeDimensionalBuffer.active && (z1 !== null) && (z2 !== null);

    // Don't draw arrow if it is invisible
    if (!color.isVisible()) return;

    // Set color of arrow
    page.canvas._strokeStyle(color.toHTML(), lineWidth);

    // Set line width and line type
    /** @type {number} */
    var lw = page.constants.DEFAULT_LINEWIDTH * lineWidth;

    // Work out direction of arrow
    if (Math.hypot(x2 - x1, y2 - y1) < 1e-200) {
        direction = 0.0;
    } else {
        direction = Math.atan2(x2 - x1, y2 - y1);
    }

    // Draw arrowhead on beginning of arrow if desired
    if ((arrowType === 'double') || (arrowType === 'back')) {
        // Pointy back of arrowhead on one side
        x3 = x1 - page.constants.ARROW_HEADSIZE * lineWidth * Math.sin((direction + Math.PI) - page.constants.ARROW_ANGLE / 2);
        y3 = y1 - page.constants.ARROW_HEADSIZE * lineWidth * Math.cos((direction + Math.PI) - page.constants.ARROW_ANGLE / 2);

        // Pointy back of arrowhead on other side
        x5 = x1 - page.constants.ARROW_HEADSIZE * lineWidth * Math.sin((direction + Math.PI) + page.constants.ARROW_ANGLE / 2);
        y5 = y1 - page.constants.ARROW_HEADSIZE * lineWidth * Math.cos((direction + Math.PI) + page.constants.ARROW_ANGLE / 2);

        // Point where back of arrowhead crosses stalk
        x4 = x1 - page.constants.ARROW_HEADSIZE * lineWidth * Math.sin(direction + Math.PI) * (1.0 - page.constants.ARROW_CONSTRICT) * Math.cos(page.constants.ARROW_ANGLE / 2);
        y4 = y1 - page.constants.ARROW_HEADSIZE * lineWidth * Math.cos(direction + Math.PI) * (1.0 - page.constants.ARROW_CONSTRICT) * Math.cos(page.constants.ARROW_ANGLE / 2);

        page.threeDimensionalBuffer.addItem(z1, function () {
            page.canvas._fillStyle(color.toHTML());
            page.canvas._beginPath();
            page.canvas._moveTo(x4, y4);
            page.canvas._lineTo(x3, y3);
            page.canvas._lineTo(x1, y1);
            page.canvas._lineTo(x5, y5);
            page.canvas._fill();
        });

        xstart = x4;
        ystart = y4;
    } else {
        xstart = x1;
        ystart = y1;
    }

    // Draw arrowhead on end of arrow if desired
    if ((arrowType === 'single') || (arrowType === 'double')) {
        // Pointy back of arrowhead on one side
        x3 = x2 - page.constants.ARROW_HEADSIZE * lineWidth * Math.sin(direction - page.constants.ARROW_ANGLE / 2);
        y3 = y2 - page.constants.ARROW_HEADSIZE * lineWidth * Math.cos(direction - page.constants.ARROW_ANGLE / 2);

        // Pointy back of arrowhead on other side
        x5 = x2 - page.constants.ARROW_HEADSIZE * lineWidth * Math.sin(direction + page.constants.ARROW_ANGLE / 2);
        y5 = y2 - page.constants.ARROW_HEADSIZE * lineWidth * Math.cos(direction + page.constants.ARROW_ANGLE / 2);

        // Point where back of arrowhead crosses stalk
        x4 = x2 - page.constants.ARROW_HEADSIZE * lineWidth * Math.sin(direction) * (1.0 - page.constants.ARROW_CONSTRICT) * Math.cos(page.constants.ARROW_ANGLE / 2);
        y4 = y2 - page.constants.ARROW_HEADSIZE * lineWidth * Math.cos(direction) * (1.0 - page.constants.ARROW_CONSTRICT) * Math.cos(page.constants.ARROW_ANGLE / 2);

        page.threeDimensionalBuffer.addItem(z1, function () {
            page.canvas._fillStyle(color.toHTML());
            page.canvas._beginPath();
            page.canvas._moveTo(x4, y4);
            page.canvas._lineTo(x3, y3);
            page.canvas._lineTo(x2, y2);
            page.canvas._lineTo(x5, y5);
            page.canvas._fill();
        });

        xend = x4;
        yend = y4;
    } else {
        xend = x2;
        yend = y2;
    }

    // Draw stalk of arrow
    if (!threeDim) {
        page.threeDimensionalBuffer.addItem(z1, function () {
            page.canvas._strokeStyle(color.toHTML(), lw);
            page.canvas._beginPath();
            page.canvas._moveTo(xstart, ystart);
            page.canvas._lineTo(xend, yend);
            page.canvas._stroke();
        });
    } else {
        /** @type {number} */
        var j, step_count = 100;
        for (j = 0; j < step_count; j++) {
            page.threeDimensionalBuffer.addItem(z1 + (z2 - z1) / step_count * j, function (i) {
                return function () {
                    page.canvas._strokeStyle(color.toHTML(), lw);
                    page.canvas._beginPath();
                    page.canvas._moveTo(xstart + (xend - xstart) / step_count * i, ystart + (yend - ystart) / step_count * i);
                    page.canvas._lineTo(xstart + (xend - xstart) / step_count * (i + 1), ystart + (yend - ystart) / step_count * (i + 1));
                    page.canvas._stroke();
                }
            }(j));
        }
    }
};
