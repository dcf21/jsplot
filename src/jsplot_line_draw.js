// jsplot_line_draw.js

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

JSPlot_LineDraw.prototype.findCrossingPoints = function (x1, y1, z1, xap1, yap1, zap1, x2, y2, z2, xap2, yap2, zap2) {

    // If either point is inside canvas, set clip-region crossings to be the points themselves
    var output = {
        'cx1': x1, 'cy1': y1, 'cz1': z1,
        'cx2': x2, 'cy2': y2, 'cz2': z2,
        'Inside1': ((xap1 >= 0.0) && (xap1 <= 1.0) && (yap1 >= 0.0) && (yap1 <= 1.0) && (zap1 >= 0.0) && (zap1 <= 1.0)),
        'Inside2': ((xap2 >= 0.0) && (xap2 <= 1.0) && (yap2 >= 0.0) && (yap2 <= 1.0) && (zap2 >= 0.0) && (zap2 <= 1.0)),
        'NCrossings': 0, 'AxisPos1': -1, 'AxisPos2': -1
    };
    if (output['Inside1'] && output['Inside2']) {
        // If both points are inside canvas, don't need to find clip-region crossings
        return output;
    }

    var DOCLIP = function (XAP1, XAP2, YAP1, YAP2, ZAP1, ZAP2, POS, SGN) {
        if (XAP2 !== XAP1) {
            var fr = (POS - XAP1) / (XAP2 - XAP1);
            if ((fr >= 0) && (fr <= 1)) {
                var yleft = YAP1 + (YAP2 - YAP1) * fr;
                var zleft = ZAP1 + (ZAP2 - ZAP1) * fr;
                if ((yleft >= 0.0) && (yleft <= 1.0) && (zleft >= 0.0) && (zleft <= 1.0)) {
                    var cx = x1 + (x2 - x1) * fr;
                    var cy = y1 + (y2 - y1) * fr;
                    var cz = z1 + (z2 - z1) * fr;
                    if ((XAP1 * SGN) < (XAP2 * SGN)) {
                        output['cx1'] = cx;
                        output['cy1'] = cy;
                        output['cz1'] = cz;
                        output['AxisPos1'] = yleft;
                    } else {
                        output['cx2'] = cx;
                        output['cy2'] = cy;
                        output['cz2'] = cz;
                        output['AxisPos2'] = yleft;
                    }
                    output['NCrossings']++;
                }
            }
        }
    };

    DOCLIP(zap1, zap2, xap1, xap2, yap1, yap2, 0.0, 1.0); // front
    DOCLIP(zap1, zap2, xap1, xap2, yap1, yap2, 1.0, -1.0); // back
    DOCLIP(xap1, xap2, yap1, yap2, zap1, zap2, 0.0, 1.0); // left
    DOCLIP(xap1, xap2, yap1, yap2, zap1, zap2, 1.0, -1.0); // right
    DOCLIP(yap1, yap2, xap1, xap2, zap1, zap2, 0.0, 1.0); // bottom
    DOCLIP(yap1, yap2, xap1, xap2, zap1, zap2, 1.0, -1.0); // top

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
