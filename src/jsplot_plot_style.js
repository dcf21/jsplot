// jsplot_plot_style.js

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
 * JSPlot_PlotStyle - A container for holding the styling information associated with a particular data set that is
 * to be plotted on a graph
 * @constructor
 */
function JSPlot_PlotStyle(settings) {
    this.color = null; // auto
    this.fillColor = new JSPlot_Color(0, 0, 0, 0); // transparent
    this.plotStyle = 'lines';
    this.lineType = null;
    this.pointType = null;
    this.lineWidth = 2;
    this.pointLineWidth = 1;
    this.pointSize = 1;

    this.configure(settings);
}

/**
 * configure - Configure settings for plotting a data set
 * @param settings {Object} - An object containing settings
 */
JSPlot_PlotStyle.prototype.configure = function (settings) {
    /** @type {JSPlot_PlotStyle} */
    var self = this;

    $.each(settings, function (key, value) {
        switch (key) {
            case "color":
                self.color = value;
                break;
            case "fillColor":
                self.fillColor = value;
                break;
            case "plotStyle":
                self.plotStyle = value;
                break;
            case "lineType":
                self.lineType = value;
                break;
            case "pointType":
                self.pointType = value;
                break;
            case "lineWidth":
                self.lineWidth = value;
                break;
            case "pointLineWidth":
                self.pointLineWidth = value;
                break;
            case "pointSize":
                self.pointSize = value;
                break;
            default:
                throw "Unrecognised plot style setting " + key;
        }
    });
};

/**
 * Clone a JSPlot_PlotStyle container into a new container
 */
JSPlot_PlotStyle.prototype.clone = function () {
    var other = new JSPlot_PlotStyle({});

    if (this.color === null) {
        other.color = this.color;
    } else {
        other.color = new JSPlot_Color(this.color.red, this.color.green, this.color.blue, this.color.alpha);
    }

    if (this.fillColor === null) {
        other.fillColor = this.fillColor;
    } else {
        other.fillColor = new JSPlot_Color(this.fillColor.red, this.fillColor.green, this.fillColor.blue, this.fillColor.alpha);
    }

    other.plotStyle = this.plotStyle;
    other.lineType = this.lineType;
    other.pointType = this.pointType;
    other.lineWidth = this.lineWidth;
    other.pointLineWidth = this.pointLineWidth;
    other.pointSize = this.pointSize;

    return other;
};
