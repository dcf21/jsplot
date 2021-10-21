<?php

// demo_linked_axes.php

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

require "php/imports.php";

$pageInfo = [
    "pageTitle" => "A panel of charts with linked x axes",
    "pageDescription" => "JSPlot - A panel of charts with linked x axes",
    "fluid" => true,
    "activeTab" => "demos",
    "teaserImg" => null,
    "cssextra" => null,
    "includes" => [],
    "linkRSS" => null,
    "options" => []
];

$pageTemplate->header($pageInfo);

?>

    <p>
        This example demonstrates how to create multiple graphs on a single canvas, whose horizontal axes are locked
        together.
    </p>
    <p>
        The user is able to click and drag the graphs left and right to change the horizontal axes range, because
        the <span class="code">interactiveMode</span> option on the <span class="code">JSPlot_Graph</span> instances
        is set to <span class="code">pan</span>. However, all three graphs will always move in lock step because they
        are linked together.
    </p>
    <p>
        The horizontal axis of any graph is configured using the <span class="code">x1_axis</span> setting on the
        <span class="code">JSPlot_Graph</span> instance. Similar options configure the
        <span class="code">x1</span> (bottom),
        <span class="code">x2</span> (top), <span class="code">y1</span> (left) and
        <span class="code">y2</span> (right) axes. On three-dimensional graphs,
        <span class="code">z1_axis</span> and <span class="code">z2_axis</span> are also valid settings.
    </p>
    <p>
        Within the settings for each axis, the <span class="code">linkTo</span> option is used to lock that axis to
        another axis on another graph. This setting should be set to an array with two items, of the form
        <span class="code">[graph_name, axis_name]</span>. Here, the graph name is the name of the
        <span class="code">JSPlot_Graph</span> instance among the items on the plotting canvas. The axis name is the
        name of the axis to link to, within that graph.
    </p>
    <div id="demo_graph">
        <!-- HTML code -->
        <div id="graph_panels" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "sin(x)", {},
                            [
                                Math.sin
                            ]).evaluate_linear_raster(-10, 10, 1000, true)
                    ], {
                        'interactiveMode': 'pan',
                        'key': true,
                        'keyPosition': 'tr',
                        'width': 800,
                        'aspect': 0.2,
                        'x1_axis': {
                            'scrollMin': null,
                            'scrollMax': null,
                            'scrollEnabled': true,
                            'zoomEnabled': true
                        }
                    }),
                    "graph_2": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "cos(x)", {},
                            [
                                Math.cos
                            ]).evaluate_linear_raster(-10, 10, 1000, true)
                    ], {
                        'key': true,
                        'keyPosition': 'tr',
                        'width': 800,
                        'origin': [0, -180],
                        'aspect': 0.2,
                        'x1_axis': {
                            'linkTo': ['graph_1', 'x1'],
                            'showLabels': false
                        }
                    }),
                    "graph_3": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "tan(x)", {},
                            [
                                Math.tan
                            ]).evaluate_linear_raster(-10, 10, 1000, true)
                    ], {
                        'key': true,
                        'keyPosition': 'tr',
                        'width': 800,
                        'origin': [0, -360],
                        'aspect': 0.2,
                        'x1_axis': {
                            'linkTo': ['graph_1', 'x1'],
                            'showLabels': false
                        },
                        'y1_axis': {
                            'min': -10,
                            'max': 10
                        }
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_panels")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
