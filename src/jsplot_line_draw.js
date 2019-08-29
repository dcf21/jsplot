// jsplot_line_draw.js

/**
 * JSPlot_LineDraw - Class for drawing a line across a graph, clipping it to the plot area.
 * @param page {JSPlot_Canvas} - The canvas that this graph is being drawn onto
 * @param graph {JSPlot_Graph} - The graph that this line is being drawn onto
 * @param axis_x {JSPlot_Axis} - The x axis that each point on this line is referenced against
 * @param axis_y {JSPlot_Axis} - The y axis that each point on this line is referenced against
 * @param axis_z {JSPlot_Axis} - The z axis that each point on this line is referenced against
 * @param color {JSPlot_Color} - The color to use when stroking this line
 * @param lineWidth {number} - The width of line to draw
 * @constructor
 */
function JSPlot_LineDraw(page, graph, axis_x, axis_y, axis_z, color, lineWidth) {
    this.page = page;
    this.graph = graph;
    this.color = color;
    this.lineWidth = lineWidth;
    this.axis_x = axis_x;
    this.axis_y = axis_y;
    this.axis_z = axis_z;

    this.pt1 = null;
}

/**
 * findCrossingPoints - Take a line segment, and clip it to the plot area.
 * @param x1 {number} - In canvas pixel coordinates, the x position of the start of the line
 * @param y1 {number} - In canvas pixel coordinates, the y position of the start of the line
 * @param z1 {number} - In canvas pixel coordinates, the z position of the start of the line
 * @param xap1 {number} - The fractional position along the x axis of the start point (in range 0 to 1)
 * @param yap1 {number} - The fractional position along the y axis of the start point (in range 0 to 1)
 * @param zap1 {number} - The fractional position along the z axis of the start point (in range 0 to 1)
 * @param x2 {number} - In canvas pixel coordinates, the x position of the end of the line
 * @param y2 {number} - In canvas pixel coordinates, the y position of the end of the line
 * @param z2 {number} - In canvas pixel coordinates, the z position of the end of the line
 * @param xap2 {number} - The fractional position along the x axis of the end point (in range 0 to 1)
 * @param yap2 {number} - The fractional position along the y axis of the end point (in range 0 to 1)
 * @param zap2 {number} - The fractional position along the z axis of the end point (in range 0 to 1)
 * @returns {{Inside1: boolean, NCrossings: number, Inside2: boolean,
 *            cy1: number, cz2: number, cz1: number, cx2: number, cx1: number, cy2: number}}
 */
JSPlot_LineDraw.prototype.findCrossingPoints = function (x1, y1, z1, xap1, yap1, zap1, x2, y2, z2, xap2, yap2, zap2) {

    var inside1 = (xap1 >= 0.0) && (xap1 <= 1.0) && (yap1 >= 0.0) && (yap1 <= 1.0) && (zap1 >= 0.0) && (zap1 <= 1.0);
    var inside2 = (xap2 >= 0.0) && (xap2 <= 1.0) && (yap2 >= 0.0) && (yap2 <= 1.0) && (zap2 >= 0.0) && (zap2 <= 1.0);

    /**
     * Output data structure
     * @property cx1 {number} - In canvas pixel coordinates, the x position of the start of the line
     * @property cy1 {number} - In canvas pixel coordinates, the y position of the start of the line
     * @property cz1 {number} - In canvas pixel coordinates, the z position of the start of the line
     * @property cx2 {number} - In canvas pixel coordinates, the x position of the end of the line
     * @property cy2 {number} - In canvas pixel coordinates, the y position of the end of the line
     * @property cz2 {number} - In canvas pixel coordinates, the z position of the end of the line
     * @property inside1_initial {boolean} - Flag indicating whether the start point was initially inside the plot area
     * @property inside2_initial {boolean} - Flag indicating whether the end point was initially inside the plot area
     * @property inside1_final {boolean} - Flag indicating whether the post-clipping start point is inside the plot area
     * @property inside2_final {boolean} - Flag indicating whether the post-clipping end point is inside the plot area
     */
    var output = {
        'cx1': x1, 'cy1': y1, 'cz1': z1,
        'cx2': x2, 'cy2': y2, 'cz2': z2,
        'inside1_initial': inside1,
        'inside2_initial': inside2,
        'inside1_final': inside1,
        'inside2_final': inside2
    };

    // If both points are inside canvas, don't need to find clip-region crossings
    if (output['inside1'] && output['inside2']) {
        return output;
    }

    /**
     * do_clip - Perform clipping along the x axis only. Call repeatedly with different permutations of x, y, z to
     * clip along all three axes.
     * @param xap1 {number} - The fractional position along the x axis of the start point (in range 0 to 1)
     * @param xap2 {number} - The fractional position along the x axis of the end point (in range 0 to 1)
     * @param yap1 {number} - The fractional position along the y axis of the start point (in range 0 to 1)
     * @param yap2 {number} - The fractional position along the y axis of the end point (in range 0 to 1)
     * @param zap1 {number} - The fractional position along the z axis of the start point (in range 0 to 1)
     * @param zap2 {number} - The fractional position along the z axis of the end point (in range 0 to 1)
     * @param pos {number} - The position along the x axis to perform clipping. Either 0 or 1.
     * @param sign {number} - Is this a minimum value of x (1), or a maximum value of x (-1)?
     */
    var do_clip = function (xap1, xap2, yap1, yap2, zap1, zap2, pos, sign) {
        // Don't attempt clipping if no movement along x axis, to avoid numerical fail
        if (xap2 !== xap1) {
            // Fractional position in range 0 (start), 1 (end) where this line segment crosses clipping limit
            var fraction = (pos - xap1) / (xap2 - xap1);

            // Proceed if clipping limit is within the line segment
            if ((fraction >= 0) && (fraction <= 1)) {
                // Work out the fractional positions along the y and z axes where axis crossing occurs
                var y_left = yap1 + (yap2 - yap1) * fraction;
                var z_left = zap1 + (zap2 - zap1) * fraction;
                // If axis crossing occurs within visible area, perform clipping
                if ((y_left >= 0.0) && (y_left <= 1.0) && (z_left >= 0.0) && (z_left <= 1.0)) {
                    // Work out canvas coordinates of point at the clipping limit
                    var cx = x1 + (x2 - x1) * fraction;
                    var cy = y1 + (y2 - y1) * fraction;
                    var cz = z1 + (z2 - z1) * fraction;
                    if ((xap1 * sign) < (xap2 * sign)) {
                        output['cx1'] = cx;
                        output['cy1'] = cy;
                        output['cz1'] = cz;
                        output['inside1_final'] = true;
                    } else {
                        output['cx2'] = cx;
                        output['cy2'] = cy;
                        output['cz2'] = cz;
                        output['inside2_final'] = true;
                    }
                }
            }
        }
    };

    // Clip at each end of each axis
    do_clip(zap1, zap2, xap1, xap2, yap1, yap2, 0.0, 1.0); // front
    do_clip(zap1, zap2, xap1, xap2, yap1, yap2, 1.0, -1.0); // back
    do_clip(xap1, xap2, yap1, yap2, zap1, zap2, 0.0, 1.0); // left
    do_clip(xap1, xap2, yap1, yap2, zap1, zap2, 1.0, -1.0); // right
    do_clip(yap1, yap2, xap1, xap2, zap1, zap2, 0.0, 1.0); // bottom
    do_clip(yap1, yap2, xap1, xap2, zap1, zap2, 1.0, -1.0); // top

    return output;
};

JSPlot_LineDraw.prototype.point = function (x, y, z, x_offset, y_offset, z_offset, x_perpoffset, y_perpoffset, z_perpoffset, linetype, linewidth) {
    var self = this;
    var width = this.graph.width;
    var height = this.graph.width * this.graph.aspect;
    var zdepth = this.graph.width * this.graph.aspectZ;

    var position = this.graph.getPosition(x, y, z, this.axis_x, this.axis_y, this.axis_z, 1);

    if ((!isFinite(position['xpos'])) || (!isFinite(position['ypos'])) || (!isFinite(position['depth']))) {
        this.penUp();
        return;
    }

    var xpos = position['xpos'] + x_offset * this.page.settings.M_TO_PS;
    var ypos = position['ypos'] + y_offset * this.page.settings.M_TO_PS;
    var depth = position['depth'] + z_offset * this.page.settings.M_TO_PS;

    var xap = position['xap'] + x_offset / width;
    var yap = position['yap'] + y_offset / height;
    var zap = position['zap'] + z_offset / zdepth;

    if (this.pt1 == null) {
        this.pt1 = [xpos, ypos, depth];
        this.xap1 = xap;
        this.yap1 = yap;
        this.zap1 = zap;
        this.xpo1 = x_perpoffset;
        this.ypo1 = y_perpoffset;
        this.zpo1 = z_perpoffset;
        return;
    }

    var crossings = this.findCrossingPoints(this.pt1[0], this.pt1[1], this.pt1[2], this.xap1, this.yap1, this.zap1, xpos, ypos, depth, xap, yap, zap);

    // Add in perpendicular offsets
    var cx1 = crossings['cx1'] + (this.xpo1 * Math.cos(position['theta_x']) + this.ypo1 * Math.cos(position['theta_y']) + this.zpo1 * Math.cos(position['theta_z'])) * this.page.settings.M_TO_PS;
    var cy1 = crossings['cy1'] + (this.xpo1 * Math.sin(position['theta_x']) + this.ypo1 * Math.sin(position['theta_y']) + this.zpo1 * Math.sin(position['theta_z'])) * this.page.settings.M_TO_PS;
    var cx2 = crossings['cx2'] + (x_perpoffset * Math.cos(position['theta_x']) + y_perpoffset * Math.cos(position['theta_y']) + z_perpoffset * Math.cos(position['theta_z'])) * this.page.settings.M_TO_PS;
    var cy2 = crossings['cy2'] + (x_perpoffset * Math.sin(position['theta_x']) + y_perpoffset * Math.sin(position['theta_y']) + z_perpoffset * Math.sin(position['theta_z'])) * this.page.settings.M_TO_PS;

    if (crossings['Inside1'] || crossings['Inside2'] || (crossings['NCrossings'] >= 2)) {
        // Check that we haven't crossed clip region during the course of line segment
        this.page.threeDimensionalBuffer.addItem(depth, function () {
            self.page.canvas._strokeStyle(this.color, this.lineWidth);
            self.page.canvas._moveTo(cx1, cy1);
            self.page.canvas._lineTo(cx2, cy2);
            self.page.canvas._stroke();

        });
    }

    this.pt1 = [xpos, ypos, depth];
    this.xap1 = xap;
    this.yap1 = yap;
    this.zap1 = zap;
    this.xpo1 = x_perpoffset;
    this.ypo1 = y_perpoffset;
    this.zpo1 = z_perpoffset;
};

JSPlot_LineDraw.prototype.penUp = function () {
    this.pt1 = null;
};
