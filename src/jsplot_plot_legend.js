// jsplot_plot_legend.js

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
 * JSPlot_Plot_Legend - A class which plots legends onto graphs
 * @param page {JSPlot_Canvas} - The canvas that this graph is to be drawn onto
 * @param graph {JSPlot_Graph} - The graph that we are drawing data sets onto
 * @constructor
 */
function JSPlot_Plot_Legend(page, graph) {
    /** @type {JSPlot_Canvas} */
    this.page = page;
    /** @type {JSPlot_Graph} */
    this.graph = graph;
    /** @type {Array<object>} */
    this.legend_items = [];
    /** @type {JSPlot_BoundingBox} */
    this.bounding_box = null;
    /** @type {?number} */
    this.x_offset = null;
    /** @type {?number} */
    this.y_offset = null;
    /** @type {?object} */
    this.column_arrangement = null;
}

/**
 * arrange_to_height - Arrange legend entries into columns, in order to fit them within a target maximum height
 * @param max_height {number} - The maximum allowed height for the legend
 */
JSPlot_Plot_Legend.prototype.arrangeToHeight = function (max_height) {
    /** @type {JSPlot_Plot_Legend} */
    var self = this;
    /** @type {Array<object>} */
    var columns = []; // List of metadata about columns in legend
    /** @type {number} */
    var current_y_pos = 0; // Current vertical position in the column we are currently populating
    /** @type {number} */
    var next_x_pos = 0; // The horizontal offset of the next column
    /** @type {number} */
    var current_column = 0; // The index of the column we are currently populating
    /** @type {number} */
    var columns_height = 0; // Maximum height of a single column

    // Function to initialise a new column
    var create_new_column = function () {
        columns.push({
            'x_offset': next_x_pos,
            'column_height': 0,
            'item_count': 0,
            'column_width': 0
        });
        current_y_pos = 0;
        current_column = columns.length - 1;
    };

    // Create first column
    create_new_column();

    // Loop over all datasets
    $.each(self.legend_items, function (index, legend_item) {
        // Extract dimensions of this legend entry
        var item_width = legend_item['width'];
        var item_height = legend_item['height'];

        // Does this item fit into this column?
        var item_fits = (current_y_pos + item_height <= max_height);
        if (!item_fits) create_new_column();

        // Write metadata to this legend item
        legend_item['column'] = current_column;
        legend_item['x_offset'] = columns[current_column]['x_offset'];
        legend_item['y_offset'] = current_y_pos;

        // Add item to column
        current_y_pos += item_height;
        if (current_y_pos > columns_height) columns_height = current_y_pos;
        columns[current_column]['column_height'] = current_y_pos;
        columns[current_column]['item_count'] += 1;
        columns[current_column]['column_width'] = Math.max(columns[current_column]['column_width'], item_width);
        next_x_pos = columns[current_column]['x_offset'] + columns[current_column]['column_width'];
    });

    // Return information about the column layout
    return {
        'columns': columns,
        'height': columns_height,
        'width': next_x_pos
    };
};

/**
 * calculateLayout - Calculate the layout of this graph legend
 */
JSPlot_Plot_Legend.prototype.calculateLayout = function () {
    var i;

    /** @type {JSPlot_Plot_Legend} */
    var self = this;

    // Check whether we're rendering a legend
    if (!this.graph.key) return;

    // Calculate available space for legend
    var available_width = Math.abs(self.graph.workspace.width_pixels - 2 * self.page.constants.LEGEND_margin);
    var available_height = Math.abs(self.graph.workspace.width_pixels * self.graph.workspace.aspect) - 2 * self.page.constants.LEGEND_margin;

    // Set up styling for legend
    this.page.canvas._textStyle(this.page.constants.LEGEND_fontFamily,
        this.page.constants.LEGEND_fontSize * graph.fontSize,
        this.page.constants.LEGEND_fontWeight, this.page.constants.LEGEND_fontStyle);
    this.page.canvas._fillStyle(this.page.constants.LEGEND_color.toHTML());

    // Start building a new list of legend entries afresh
    self.legend_items = [];

    /** @type {number} */
    var combined_height = 0; // Total combined height of all legend items, across all columns
    /** @type {number} */
    var minimum_height = 0; // Minimum height of legend item

    // Work out the dimensions of all the dataset labels
    $.each(self.graph.dataSets, function (key_name, dataset) {
        var title = dataset.title;
        // Ignore items which have a blank title
        if ((typeof title === 'string') && (title.length > 0)) {
            // Measure this text item
            var item_width = self.page.canvas._textWidth(title) + self.page.constants.LEGEND_horizontal_spacing;
            var item_height = self.page.constants.LEGEND_fontSize + self.page.constants.LEGEND_vertical_spacing;

            // Update statistics on item heights
            combined_height += item_height;
            if ((minimum_height === 0) || (minimum_height > item_height)) minimum_height = item_height;

            // Add this item to the legend
            self.legend_items.push({
                'key_name': key_name,
                'dataset': dataset,
                'text': title,
                'height': item_height,
                'width': item_width
            });
        }
    });

    var column_arrangement = null;
    var trial_height = 0;
    var best_height = 0;
    var horizontally_justify = false;
    var vertically_justify = false;

    // If the user has manually specified a number of legend columns, arrange into that number of columns
    if ((typeof self.graph.keyColumns === 'number') && (self.graph.keyColumns > 0)) {
        // Gradually reduce height of key until it no longer fits into requested number of columns
        trial_height = combined_height + 2;
        while (trial_height > minimum_height) {
            column_arrangement = self.arrangeToHeight(trial_height);
            if (column_arrangement['columns'].length > self.graph.keyColumns) break;
            if (column_arrangement['height'] > trial_height) break;
            best_height = trial_height;
            trial_height = column_arrangement['height'] - 1;
        }
    }

    // If key is above or below the graph, reduce height until it exceeds the width of the plot
    else if ((self.graph.keyPosition === "above") || (self.graph.keyPosition === "below")) {
        horizontally_justify = true;

        // Gradually reduce height of key until it no longer fits into width of graph
        trial_height = combined_height + 2;
        while (trial_height > minimum_height) {
            column_arrangement = self.arrangeToHeight(trial_height);
            if (column_arrangement['width'] > available_width) {
                break;
            }
            if (column_arrangement['height'] > trial_height) break;
            best_height = trial_height;
            trial_height = column_arrangement['height'] - 1;
        }
    }

    // In all other cases, allow the legend to fill the full height of the graph
    else {
        vertically_justify = true;
        best_height = available_height;
    }

    // Arrange items into columns
    column_arrangement = self.arrangeToHeight(best_height);

    // If legend fills whole height of graph, consider vertically justifying it
    trial_height = column_arrangement['height']
    if (vertically_justify) {
        trial_height = available_height;

        // Check whether any columns are too short to justify
        for (i = 0; i < column_arrangement['columns'].length; i++) {
            total_gap = trial_height - column_arrangement['columns'][i]['column_height'];
            gap_per_item = total_gap / (column_arrangement['columns'][i]['item_count'] - 1);

            if (
                (column_arrangement['columns'][i]['item_count'] < 2) ||
                (gap_per_item > self.page.constants.LEGEND_MAX_VGAP)
            ) {
                trial_height = column_arrangement['height'];
                break;
            }
        }

        // Apply vertical justification
        for (i = 0; i < column_arrangement['columns'].length; i++) {
            if (column_arrangement['columns'][i]['item_count'] < 2) continue;

            var total_gap = trial_height - column_arrangement['columns'][i]['column_height'];
            var gap_per_item = total_gap / (column_arrangement['columns'][i]['item_count'] - 1);
            var gap = 0;

            if (gap_per_item > self.page.constants.LEGEND_MAX_VGAP) continue;

            // Apply offsets to items in this column
            $.each(self.graph.dataSets, function (key_name, dataset) {
                if (dataset['column'] === i) {
                    dataset['y_offset'] += gap;
                    gap += gap_per_item;
                }
            });

            // Update height of legend
            column_arrangement['height'] = trial_height;
        }
    }

    // If legend fills whole width of graph, consider vertically justifying it
    if (horizontally_justify && (column_arrangement['columns'].length > 1)) {
        total_gap = available_width - column_arrangement['width'];
        gap_per_item = total_gap / (column_arrangement['columns'].length - 1);

        if (gap_per_item <= self.page.constants.LEGEND_MAX_HGAP) {
            // Apply offsets to items in this column
            $.each(self.graph.dataSets, function (key_name, dataset) {
                dataset['x_offset'] += gap_per_item * dataset['column'];
            });

            // Record new width of legend
            column_arrangement['width'] = available_width;
        }
    }

    // Work out position of legend
    var x_offset = 0; // measured rightwards
    var y_offset = 0; // measured downwards
    if (!self.graph.threeDimensional) {
        // Two-dimensional legend positioning
        switch (self.graph.keyPosition) {
            case "tr":
                x_offset = self.page.constants.LEGEND_margin + available_width - column_arrangement['width'];
                y_offset = -(self.page.constants.LEGEND_margin + available_height);
                break;
            case "tm":
                x_offset = self.page.constants.LEGEND_margin + available_width / 2 - column_arrangement['width'] / 2;
                y_offset = -(self.page.constants.LEGEND_margin + available_height);
                break;
            case "tl":
                x_offset = self.page.constants.LEGEND_margin;
                y_offset = -(self.page.constants.LEGEND_margin + available_height);
                break;
            case "mr":
                x_offset = self.page.constants.LEGEND_margin + available_width - column_arrangement['width'];
                y_offset = -(self.page.constants.LEGEND_margin + available_height / 2 + column_arrangement['height'] / 2);
                break;
            case "mm":
                x_offset = self.page.constants.LEGEND_margin + available_width / 2 - column_arrangement['width'] / 2;
                y_offset = -(self.page.constants.LEGEND_margin + available_height / 2 + column_arrangement['height'] / 2);
                break;
            case "ml":
                x_offset = self.page.constants.LEGEND_margin;
                y_offset = -(self.page.constants.LEGEND_margin + available_height / 2 + column_arrangement['height'] / 2);
                break;
            case "br":
                x_offset = self.page.constants.LEGEND_margin + available_width - column_arrangement['width'];
                y_offset = -(self.page.constants.LEGEND_margin + column_arrangement['height']);
                break;
            case "bm":
                x_offset = self.page.constants.LEGEND_margin + available_width / 2 - column_arrangement['width'] / 2;
                y_offset = -(self.page.constants.LEGEND_margin + column_arrangement['height']);
                break;
            case "bl":
                x_offset = self.page.constants.LEGEND_margin;
                y_offset = -(self.page.constants.LEGEND_margin + column_arrangement['height']);
                break;
            case "below":
                x_offset = self.page.constants.LEGEND_margin + available_width / 2 - column_arrangement['width'] / 2;
                y_offset = -(-self.page.constants.LEGEND_margin - 60);
                break;
            case "above":
                x_offset = self.page.constants.LEGEND_margin + available_width / 2 - column_arrangement['width'] / 2;
                y_offset = -(2 * self.page.constants.LEGEND_margin + available_height + 60 + column_arrangement['height']);
                break;
            case "right":
                x_offset = 2 * self.page.constants.LEGEND_margin + available_width + 60;
                y_offset = -(self.page.constants.LEGEND_margin + available_height / 2 + column_arrangement['height'] / 2);
                break;
            case "left":
                x_offset = -self.page.constants.LEGEND_margin - 60 - column_arrangement['width'];
                y_offset = -(self.page.constants.LEGEND_margin + available_height / 2 + column_arrangement['height'] / 2);
                break;
        }

        // Position is relative to the graph origin
        x_offset += self.graph.origin[0];
        y_offset += self.graph.origin[1];
    } else {
        // Three dimensional legend positioning
        switch (self.graph.keyPosition) {
            case "tr":
                x_offset = self.graph.graph_bounding_box.right - self.page.constants.LEGEND_margin - column_arrangement['width'];
                y_offset = self.graph.graph_bounding_box.top + self.page.constants.LEGEND_margin;
                break;
            case "tm":
                x_offset = (self.graph.graph_bounding_box.left + self.graph.graph_bounding_box.right) / 2 - column_arrangement['width'] / 2;
                y_offset = self.graph.graph_bounding_box.top + self.page.constants.LEGEND_margin;
                break;
            case "tl":
                x_offset = self.graph.graph_bounding_box.left + self.page.constants.LEGEND_margin;
                y_offset = self.graph.graph_bounding_box.top + self.page.constants.LEGEND_margin;
                break;
            case "mr":
                x_offset = self.graph.graph_bounding_box.right - self.page.constants.LEGEND_margin - column_arrangement['width'];
                y_offset = (self.graph.graph_bounding_box.top + self.graph.graph_bounding_box.bottom) / 2 - column_arrangement['height'] / 2;
                break;
            case "mm":
                x_offset = (self.graph.graph_bounding_box.left + self.graph.graph_bounding_box.right) / 2 - column_arrangement['width'] / 2;
                y_offset = (self.graph.graph_bounding_box.top + self.graph.graph_bounding_box.bottom) / 2 - column_arrangement['height'] / 2;
                break;
            case "ml":
                x_offset = self.graph.graph_bounding_box.left + self.page.constants.LEGEND_margin;
                y_offset = (self.graph.graph_bounding_box.top + self.graph.graph_bounding_box.bottom) / 2 - column_arrangement['height'] / 2;
                break;
            case "br":
                x_offset = self.graph.graph_bounding_box.right - self.page.constants.LEGEND_margin - column_arrangement['width'];
                y_offset = self.graph.graph_bounding_box.bottom - self.page.constants.LEGEND_margin - column_arrangement['height'];
                break;
            case "bm":
                x_offset = (self.graph.graph_bounding_box.left + self.graph.graph_bounding_box.right) / 2 - column_arrangement['width'] / 2;
                y_offset = self.graph.graph_bounding_box.bottom - self.page.constants.LEGEND_margin - column_arrangement['height'];
                break;
            case "bl":
                x_offset = self.graph.graph_bounding_box.left + self.page.constants.LEGEND_margin;
                y_offset = self.graph.graph_bounding_box.bottom - self.page.constants.LEGEND_margin - column_arrangement['height'];
                break;
            case "below":
                x_offset = (self.graph.graph_bounding_box.left + self.graph.graph_bounding_box.right) / 2 - column_arrangement['width'] / 2;
                y_offset = self.graph.graph_bounding_box.bottom + self.page.constants.LEGEND_margin + 60;
                break;
            case "above":
                x_offset = (self.graph.graph_bounding_box.left + self.graph.graph_bounding_box.right) / 2 - column_arrangement['width'] / 2;
                y_offset = self.graph.graph_bounding_box.top - 2 * self.page.constants.LEGEND_margin - 60 - column_arrangement['height'];
                break;
            case "right":
                x_offset = 2 * self.page.constants.LEGEND_margin + available_width + 60;
                y_offset = (self.graph.graph_bounding_box.top + self.graph.graph_bounding_box.bottom) / 2 - column_arrangement['height'] / 2;
                break;
            case "left":
                x_offset = -self.page.constants.LEGEND_margin - 60 - column_arrangement['width'];
                y_offset = (self.graph.graph_bounding_box.top + self.graph.graph_bounding_box.bottom) / 2 - column_arrangement['height'] / 2;
                break;
        }
    }

    // Finished layout of legend. Now store settings for later use.
    self.x_offset = x_offset;
    self.y_offset = y_offset;
    self.column_arrangement = column_arrangement;

    self.bounding_box = new JSPlot_BoundingBox();
    self.bounding_box.includePoint(x_offset - 5, y_offset - 12);
    self.bounding_box.includePoint(x_offset + column_arrangement['width'], y_offset + column_arrangement['height']);
};

/**
 * boundingBox - Return the bounding box of this graph legend
 */
JSPlot_Plot_Legend.prototype.boundingBox = function () {
    return this.bounding_box;
};

/**
 * render - Render this graph legend onto the canvas
 */
JSPlot_Plot_Legend.prototype.render = function () {
    /** @type {JSPlot_Plot_Legend} */
    var self = this;

    // Check whether we're rendering a legend
    if (!this.graph.key) return;

    // Ensure that legend has been laid out
    if (this.x_offset === null) this.calculateLayout();

    // Loop over all datasets
    $.each(self.legend_items, function (index, legend_item) {
        var plot_style = legend_item['dataset'].workspace.styleFinal;
        var style = plot_style.plotStyle;
        var x = self.x_offset + legend_item['x_offset'];
        var y = self.y_offset + legend_item['y_offset'];

        // Set up styling for legend
        self.page.canvas._textStyle(self.page.constants.LEGEND_fontFamily,
            self.page.constants.LEGEND_fontSize * graph.fontSize,
            self.page.constants.LEGEND_fontWeight, self.page.constants.LEGEND_fontStyle);
        self.page.canvas._fillStyle(self.page.constants.LEGEND_color.toHTML());

        // Write text label for this legend item
        self.page.canvas._text(x + 24, y, -1, 0, true, legend_item['text'], false, false);

        // Draw icon next to legend item
        if (
            (style === 'lines') || (style === 'linespoints') || (style === 'impulses') ||
            (style === 'steps') || (style === 'fsteps') || (style === 'histeps')
        ) {
            self.page.canvas._strokeStyle(plot_style.color.toHTML(), 1);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x, y);
            self.page.canvas._lineTo(x + 18, y);
            self.page.canvas._stroke();
        }

        // Legend for bar charts
        if (
            (style === 'boxes') || (style === 'wboxes') || (style === 'surface')
        ) {
            self.page.canvas._strokeStyle(plot_style.color.toHTML(), 1);
            self.page.canvas._fillStyle(plot_style.fillColor.toHTML());
            self.page.canvas._beginPath();
            self.page.canvas._rect(x + 2, y - 7, 14, 14);
            self.page.canvas._fill();
            self.page.canvas._stroke();
        }

        // Legend for data points
        if ((style === 'points') || (style === 'linespoints') || (style === 'dots')) {
            var point_type = (plot_style.pointType % self.page.styling.pointTypes.length);
            var point_size = plot_style.pointSize;
            var point_size_multiplier = 1;
            if (style === 'dots') {
                point_type = 1;
                point_size_multiplier = 0.25;
            }
            var point_render = self.page.styling.pointTypes[point_type];
            point_render(x + 9, y, point_size * point_size_multiplier, 1, plot_style.color.toHTML());
        }

        // Draw legend icons for lower limits and upper limits
        else if ((style === 'lowerlimits') || (style === 'upperlimits')) {
            var renderer = new JSPlot_DrawArrow();
            self.page.canvas._strokeStyle(plot_style.color.toHTML(), 1);
            if (style === 'upperlimits') {
                self.page.canvas._beginPath();
                self.page.canvas._moveTo(x, y - 6);
                self.page.canvas._lineTo(x + 18, y - 6);
                self.page.canvas._stroke();
                renderer.primitive_arrow(self.page, 'single',
                    x + 9, y - 6, 0, x + 9, y + 6, 0, plot_style.color, 1.4, 1);
            } else {
                self.page.canvas._beginPath();
                self.page.canvas._moveTo(x, y + 6);
                self.page.canvas._lineTo(x + 18, y + 6);
                self.page.canvas._stroke();
                renderer.primitive_arrow(self.page, 'single',
                    x + 9, y + 6, 0, x + 9, y - 6, 0, plot_style.color, 1.4, 1);

            }

        }

        // Draw legend icons for arrows
        else if ((style === "arrows_head") || (style === "arrows_twohead") || (style === "arrows_nohead")) {
            renderer = new JSPlot_DrawArrow();

            var arrowType;
            if (style === "arrows_head") {
                arrowType = "single"
            } else if (style === "arrows_twohead") {
                arrowType = "double"
            } else {
                arrowType = "none"
            }
            renderer.primitive_arrow(self.page, arrowType, x, y, 0, x + 18, y, 0,
                plot_style.color, 1.4, 1);
        }

        // Draw legend icons for error bars
        else if (
            (style === "xerrorbars") || (style === "yerrorbars") || (style === "zerrorbars") ||
            (style === "xerrorrange") || (style === "yerrorrange") || (style === "zerrorrange") ||
            (style === "xyerrorbars") || (style === "xzerrorbars") || (style === "yzerrorbars") ||
            (style === "xyerrorrange") || (style === "xzerrorrange") || (style === "yzerrorrange") ||
            (style === "xyzerrorbars") || (style === "xyzerrorrange")
        ) {
            self.page.canvas._strokeStyle(plot_style.color.toHTML(), 1);
            self.page.canvas._beginPath();
            self.page.canvas._moveTo(x, y);
            self.page.canvas._lineTo(x + 18, y);
            self.page.canvas._moveTo(x, y - 5);
            self.page.canvas._lineTo(x, y + 5);
            self.page.canvas._moveTo(x + 9, y - 3);
            self.page.canvas._lineTo(x + 9, y + 3);
            self.page.canvas._moveTo(x + 18, y - 5);
            self.page.canvas._lineTo(x + 18, y + 5);
            self.page.canvas._stroke();
        }
    });
}
