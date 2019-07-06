// jsplot_draw_arrow.js

// Primitive routine for drawing arrow
function eps_primitive_arrow(page, arrowType, x1, y1, z1, x2, y2, z2, color, lineWidth, lineType) {
    var x3, y3, x4, y4, x5, y5, xstart, ystart, xend, yend, direction;
    var threeDim = (z1 !== null) && (z2 !== null);

    // Don't draw arrow if it is invisible
    if (!color.isVisible()) return;

    // Set color of arrow
    page.canvas._strokeStyle(color.toHTML(), lineWidth);

    // Set linewidth and linetype
    var lw = page.settings.EPS_DEFAULT_LINEWIDTH * lineWidth;

    // Work out direction of arrow
    if (Math.hypot(x2 - x1, y2 - y1) < 1e-200) {
        direction = 0.0;
    } else {
        direction = Math.atan2(x2 - x1, y2 - y1);
    }

    // Draw arrowhead on beginning of arrow if desired
    if (arrowType === 'double') {
        // Pointy back of arrowhead on one side
        x3 = x1 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.sin((direction + Math.PI) - page.settings.EPS_ARROW_ANGLE / 2);
        y3 = y1 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.cos((direction + Math.PI) - page.settings.EPS_ARROW_ANGLE / 2);

        // Pointy back of arrowhead on other side
        x5 = x1 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.sin((direction + Math.PI) + page.settings.EPS_ARROW_ANGLE / 2);
        y5 = y1 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.cos((direction + Math.PI) + page.settings.EPS_ARROW_ANGLE / 2);

        // Point where back of arrowhead crosses stalk
        x4 = x1 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.sin(direction + Math.PI) * (1.0 - page.settings.EPS_ARROW_CONSTRICT) * Math.cos(page.settings.EPS_ARROW_ANGLE / 2);
        y4 = y1 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.cos(direction + Math.PI) * (1.0 - page.settings.EPS_ARROW_CONSTRICT) * Math.cos(page.settings.EPS_ARROW_ANGLE / 2);

        this.threeDimensionalBuffer.addItem(z1, function () {
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
    if ((ArrowType === 'single') || (ArrowType === 'double')) {
        // Pointy back of arrowhead on one side
        x3 = x2 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.sin(direction - page.settings.EPS_ARROW_ANGLE / 2);
        y3 = y2 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.cos(direction - page.settings.EPS_ARROW_ANGLE / 2);

        // Pointy back of arrowhead on other side
        x5 = x2 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.sin(direction + page.settings.EPS_ARROW_ANGLE / 2);
        y5 = y2 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.cos(direction + page.settings.EPS_ARROW_ANGLE / 2);

        // Point where back of arrowhead crosses stalk
        x4 = x2 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.sin(direction) * (1.0 - page.settings.EPS_ARROW_CONSTRICT) * Math.cos(page.settings.EPS_ARROW_ANGLE / 2);
        y4 = y2 - page.settings.EPS_ARROW_HEADSIZE * lineWidth * Math.cos(direction) * (1.0 - page.settings.EPS_ARROW_CONSTRICT) * Math.cos(page.settings.EPS_ARROW_ANGLE / 2);

        this.threeDimensionalBuffer.addItem(z1, function () {
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
        this.threeDimensionalBuffer.addItem(z1, function () {
            page.canvas._strokeStyle(color.toHTML(), lw);
            page.canvas._beginPath();
            page.canvas._moveTo(xstart, ystart);
            page.canvas._lineTo(xend, yend);
            page.canvas._stroke();
        });
    } else {
        var j, step_count = 100;
        for (j = 0; j < step_count; j++) {
            this.threeDimensionalBuffer.addItem(z1 + (z2 - z1) / step_count * i, function (i) {
                return function () {
                    page.canvas._strokeStyle(color.toHTML(), lw);
                    page.canvas._beginPath();
                    page.canvas._moveTo(xstart + (xend - xstart) / step_count * i, ystart + (yend - ystart) / step_count * i);
                    page.canvas._lineTo(xstart + (xend - xstart) / step_count * (i + 1), ystart + (yend - ystart) / step_count * (i + 1));
                    page.canvas._stroke();
                }
            }(i));
        }
    }
}
