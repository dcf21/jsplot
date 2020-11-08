// jsplot_plot_labels.js

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
 * JSPlot_Label_Text - A class representing a text label, to be rendered onto a <JSPlot_Graph>
 * @param settings {Object} - An object containing settings
 * @constructor
 */
function JSPlot_Label_Text(settings) {
    /** @type {string} */
    this.itemType = "text";
    /** @type {number} */
    this.z_index = 0;
    /** @type {string} */
    this.text = "Hello world";
    /** @type {JSPlot_Color} */
    this.color = new JSPlot_Color(0, 0, 0, 1);
    /** @type {number} */
    this.fontSize = 13;
    /** @type {string} */
    this.fontFamily = "Arial,Helvetica,sans-serif";
    /** @type {string} */
    this.fontWeight = "";  // options "", "bold"
    /** @type {string} */
    this.fontStyle = "";  // options "", "italic"

    /** @type {Array<number>} */
    this.position = [0, 0];
    /** @type {JSPlot_Axis} */
    this.axis_x = null;
    /** @type {JSPlot_Axis} */
    this.axis_y = null;
    /** @type {JSPlot_Axis} */
    this.axis_z = null;
    /** @type {string} */
    this.h_align = "center";  // options "left", "center", "right"
    /** @type {string} */
    this.v_align = "center";  // options "top", "center", "bottom"

    // Read user supplied settings
    this.configure(settings);
}

/**
 * configure - Configure settings for a text label
 * @param settings {Object} - An object containing settings
 */
JSPlot_Label_Text.prototype.configure = function (settings) {
    /** @type {JSPlot_Label_Text} */
    var self = this;

    $.each(settings, function (key, value) {
        switch (key) {
            case "axis_x":
                self.axis_x = value;
                break;
            case "axis_y":
                self.axis_y = value;
                break;
            case "axis_z":
                self.axis_z = value;
                break;
            case "color":
                self.color = value;
                break;
            case "fontSize":
                self.fontSize = value;
                break;
            case "fontFamily":
                self.fontFamily = value;
                break;
            case "fontStyle":
                self.fontStyle = value;
                break;
            case "fontWeight":
                self.fontWeight = value;
                break;
            case "h_align":
                self.h_align = value;
                break;
            case "position":
                self.position = value;
                break;
            case "text":
                self.text = value;
                break;
            case "v_align":
                self.v_align = value;
                break;
            case "z_index":
                self.z_index = value;
                break;
            default:
                throw "Unrecognised text item setting " + key;
        }
    });
};

/**
 * render - Render the text label
 * @param graph {JSPlot_Graph} - The graph we plot this label onto
 */
JSPlot_Label_Text.prototype.render = function (graph) {
    /** @type {JSPlot_Canvas} */
    var page = graph.page;

    if (this.color !== null) {
        var h_align = 0;
        if (this.h_align === "left") h_align = -1;
        if (this.h_align === "right") h_align = 1;

        var v_align = 0;
        if (this.v_align === "top") v_align = 1;
        if (this.v_align === "bottom") v_align = -1;

        var anchor = graph.projectPoint(this.position[0],
            this.position[1],
            graph.threeDimensional ? this.position[2] : 0,
            this.axis_x,
            this.axis_y,
            this.axis_z,
            true);

        page.canvas._textStyle(this.fontFamily, this.fontSize, this.fontWeight, this.fontStyle);
        page.canvas._fillStyle(this.color.toHTML());
        page.canvas._text(anchor['xpos'], anchor['ypos'], h_align, v_align, true, this.text, false, false);
    }
};

/**
 * fetch_z_index - Fetch the z-index of this label
 * @param graph {JSPlot_Graph} - The graph we plot this label onto
 */
JSPlot_Label_Text.prototype.fetch_z_index = function (graph) {
    /** @type {JSPlot_Canvas} */
    var page = graph.page;

    if (graph.threeDimensional) {
        var anchor = graph.projectPoint(this.position[0],
            this.position[1],
            this.position[2],
            this.axis_x,
            this.axis_y,
            this.axis_z,
            true);

        return -anchor[2];
    } else {
        return this.z_index;
    }
};


/**
 * JSPlot_Arrow - A class representing an arrow label, to be rendered onto a <JSPlot_Graph>
 * @param settings {Object} - An object containing settings
 * @constructor
 */
function JSPlot_Label_Arrow(settings) {
    /** @type {string} */
    this.itemType = "arrow";
    /** @type {number} */
    this.z_index = 0;
    /** @type {string} */
    this.arrowType = "single";
    /** @type {JSPlot_Color} */
    this.color = new JSPlot_Color(0, 0, 0, 1);
    /** @type {number} */
    this.strokeLineWidth = 1;

    /** @type {Array<number>} */
    this.origin = [0, 0];
    /** @type {Array<number>} */
    this.target = [0, 0];
    /** @type {JSPlot_Axis} */
    this.axis_x = null;
    /** @type {JSPlot_Axis} */
    this.axis_y = null;
    /** @type {JSPlot_Axis} */
    this.axis_z = null;

    // Read user supplied settings
    this.configure(settings);
}

/**
 * configure - Configure settings for an arrow
 * @param settings {Object} - An object containing settings
 */
JSPlot_Label_Arrow.prototype.configure = function (settings) {
    /** @type {JSPlot_Arrow} */
    var self = this;

    $.each(settings, function (key, value) {
        switch (key) {
            case "axis_x":
                self.axis_x = value;
                break;
            case "axis_y":
                self.axis_y = value;
                break;
            case "axis_z":
                self.axis_z = value;
                break;
            case "arrowType":
                self.arrowType = value;
                break;
            case "color":
                self.color = value;
                break;
            case "strokeLineWidth":
                self.strokeLineWidth = value;
                break;
            case "origin":
                self.origin = value;
                break;
            case "target":
                self.target = value;
                break;
            case "z_index":
                self.z_index = value;
                break;
            default:
                throw "Unrecognised arrow setting " + key;
        }
    });
};

/**
 * render - Render the arrow
 * @param graph {JSPlot_Graph} - The graph we plot this label onto
 */
JSPlot_Label_Arrow.prototype.render = function (graph) {
    /** @type {JSPlot_Canvas} */
    var page = graph.page;

    if (this.color !== null) {
        var pos_start = graph.projectPoint(this.origin[0],
            this.origin[1],
            graph.threeDimensional ? this.origin[2] : 0,
            this.axis_x,
            this.axis_y,
            this.axis_z,
            true);
        var pos_end = graph.projectPoint(this.target[0],
            this.target[1],
            graph.threeDimensional ? this.target[2] : 0,
            this.axis_x,
            this.axis_y,
            this.axis_z,
            true);

        var renderer = new JSPlot_DrawArrow();

        renderer.primitive_arrow(page, this.arrowType,
            pos_start['xpos'], pos_start['ypos'], pos_start['zpos'],
            pos_end['xpos'], pos_end['ypos'], pos_end['zpos'],
            this.color, this.strokeLineWidth, 1);
    }
};

/**
 * fetch_z_index - Fetch the z-index of this label
 * @param graph {JSPlot_Graph} - The graph we plot this label onto
 */
JSPlot_Label_Arrow.prototype.fetch_z_index = function (graph) {
    if (graph.threeDimensional) {
        var pos_start = graph.projectPoint(this.origin[0],
            this.origin[1],
            this.origin[2],
            this.axis_x,
            this.axis_y,
            this.axis_z,
            true);
        var pos_end = graph.projectPoint(this.target[0],
            this.target[1],
            this.target[2],
            this.axis_x,
            this.axis_y,
            this.axis_z,
            true);

        return -(pos_start[2] + pos_end[2]) / 2;
    } else {
        return this.z_index;
    }
};
