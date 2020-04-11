// jsplot_line_draw.js

/**
 * JSPlot_LineDraw - Class for drawing a line across a graph, clipping it to the plot area.
 * @param page {JSPlot_Canvas} - The canvas that this graph is being drawn onto
 * @param graph {JSPlot_Graph} - The graph that this line is being drawn onto
 * @param axis_x {JSPlot_Axis} - The x axis that each point on this line is referenced against
 * @param axis_y {JSPlot_Axis} - The y axis that each point on this line is referenced against
 * @param axis_z {JSPlot_Axis} - The z axis that each point on this line is referenced against
 * @param color {JSPlot_Color} - The color to use when stroking this line
 * @param line_type {number} - The line type to use to stroke this line
 * @param line_width {number} - The width of line to draw
 * @constructor
 */
function JSPlot_LineDraw(page, graph, axis_x, axis_y, axis_z, color, line_type, line_width) {
    /** @type {JSPlot_Canvas} */
    this.page = page;
    /** @type {JSPlot_Graph} */
    this.graph = graph;
    /** @type {JSPlot_Color} */
    this.color = color;
    /** @type {number} */
    this.line_type = line_type;
    /** @type {number} */
    this.line_width = line_width;
    /** @type {JSPlot_Axis} */
    this.axis_x = axis_x;
    /** @type {JSPlot_Axis} */
    this.axis_y = axis_y;
    /** @type {JSPlot_Axis} */
    this.axis_z = axis_z;

    this.pt_old = null;
    this.line_list = [];
    this.point_list_in_progress = [];
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
 * @returns {{inside1_final: boolean, inside1_initial: boolean, inside2_initial: boolean,
 *            cy1: number, cz2: number, cz1: number, cx2: number, cx1: number, cy2: number, inside2_final: boolean}}
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

/**
 * point - Add a point to this line
 * @param x {number} - The position of the point along the x axis
 * @param y {number} - The position of the point along the y axis
 * @param z {number} - The position of the point along the z axis
 * @param x_offset {number} - Offset the point by a certain amount, measured in canvas coordinates, parallel to x axis
 * @param y_offset {number} - Offset the point by a certain amount, measured in canvas coordinates, parallel to y axis
 * @param z_offset {number} - Offset the point by a certain amount, measured in canvas coordinates, parallel to z axis
 * @param x_perp_offset {number} - Offset the point by a certain amount perpendicular to x axis
 * @param y_perp_offset {number} - Offset the point by a certain amount perpendicular to x axis
 * @param z_perp_offset {number} - Offset the point by a certain amount perpendicular to x axis
 */
JSPlot_LineDraw.prototype.point = function (x, y, z,
                                            x_offset, y_offset, z_offset,
                                            x_perp_offset, y_perp_offset, z_perp_offset) {
    var self = this;

    var position = this.graph.projectPoint(x, y, z, this.axis_x, this.axis_y, this.axis_z, 1);

    if ((!isFinite(position['xpos'])) || (!isFinite(position['ypos'])) || (!isFinite(position['depth']))) {
        this.penUp();
        return;
    }

    var pt_this = {
        'position': position,
        'x_offset': x_offset, 'y_offset': y_offset, 'z_offset': z_offset,
        'x_perp_offset': x_perp_offset, 'y_perp_offset': y_perp_offset, 'z_perp_offset': z_perp_offset
    };

    if (this.pt_old === null) {
        this.pt_old = pt_this;
        return;
    }

    var clipped_line_segment = this.findCrossingPoints(
        this.pt_old.position.xpos, this.pt_old.position.ypos, this.pt_old.position.depth,
        this.pt_old.position.xap, this.pt_old.position.yap, this.pt_old.position.zap,
        position.xpos, position.ypos, position.depth,
        position.xap, position.yap, position.zap);

    // Add point to list of points along line
    var add_point = function (pt, cx_clipped, cy_clipped, cz_clipped) {
        var cx = cx_clipped +
            (pt.x_offset * Math.cos(position['theta_x']) +
                pt.y_offset * Math.cos(position['theta_y']) +
                pt.z_offset * Math.cos(position['theta_z']) +
                pt.x_perp_offset * Math.cos(position['theta_x'] + Math.PI / 2) +
                pt.y_perp_offset * Math.cos(position['theta_y'] + Math.PI / 2) +
                pt.z_perp_offset * Math.cos(position['theta_z'] + Math.PI / 2)
            );
        var cy = cy_clipped +
            (pt.x_offset * Math.sin(position['theta_x']) +
                pt.y_offset * Math.sin(position['theta_y']) +
                pt.z_offset * Math.sin(position['theta_z']) +
                pt.x_perp_offset * Math.sin(position['theta_x'] + Math.PI / 2) +
                pt.y_perp_offset * Math.sin(position['theta_y'] + Math.PI / 2) +
                pt.z_perp_offset * Math.sin(position['theta_z'] + Math.PI / 2)
            );

        self.point_list_in_progress.push([cx, cy, cz_clipped])
    };

    if (this.point_list_in_progress.length === 0) {
        add_point(this.pt_old, clipped_line_segment.cx1, clipped_line_segment.cy2, clipped_line_segment.cz1);
    }

    add_point(pt_this, clipped_line_segment.cx2, clipped_line_segment.cy2, clipped_line_segment.cz2);

    this.pt_old = pt_this;
};

/**
 * penUp - Break the current line and start a new line.
 */
JSPlot_LineDraw.prototype.penUp = function () {
    this.pt_old = null;

    if (this.point_list_in_progress.length > 1) {
        this.line_list.push(this.point_list_in_progress);
    }

    this.point_list_in_progress = [];
};

/**
 * renderLine - Having collected a list of points to join with a line, now render that line.
 */
JSPlot_LineDraw.prototype.renderLine = function () {
    var self = this;
    var i, j;

    if (!this.page.threeDimensionalBuffer.active) {
        self.page.canvas._strokeStyle(this.color, this.line_width);

        for (i = 0; i < this.line_list.length; i++) {
            self.page.canvas._moveTo(this.line_list[i][0][0], this.line_list[i][0][1]);
            for (j = 1; j < this.line_list[i].length; j++) {
                self.page.canvas._lineTo(this.line_list[i][j][0], this.line_list[i][j][1]);
            }
        }

        self.page.canvas._stroke();
    } else {
        for (i = 0; i < this.line_list.length; i++) {
            for (j = 1; j < this.line_list[i].length; j++) {
                var depth = self.line_list[i][j][2];

                var renderer = function (i, j) {
                    return function () {
                        self.page.canvas._strokeStyle(self.color, self.lineWidth);
                        self.page.canvas._moveTo(self.line_list[i][j - 1][0], self.line_list[i][j - 1][1]);
                        self.page.canvas._lineTo(self.line_list[i][j][0], self.line_list[i][j][1]);
                        self.page.canvas._stroke();

                    }
                }(i, j);

                this.page.threeDimensionalBuffer.addItem(depth, renderer);
            }
        }
    }
};