<?php

// demo_x2.php

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
    "pageTitle" => "A plot of x²",
    "pageDescription" => "JSPlot - A plot of x²",
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
        This is a simple example of how to plot a graph of the function <i>y=x<sup>2</sup></i>, using the
        <span class="code">JSPlot_FunctionEvaluator</span> class to automatically evaluate a mathematical function
        along the horizontal axis of the plot.
    </p>
    <p>
        You can click and drag the graph left and right, and the function evaluator will automatically recompute the
        sine function along the new horizontal range of the graph. This is possible because the
        <span class="code">interactiveMode</span>
        option on the <span class="code">JSPlot_Graph</span> instance is set to <span class="code">pan</span>.
    </p>
    <p>
        The vertical axis of the plot automatically rescales the accommodate all the data.
    </p>

    <div id="demo_graph">
        <!-- HTML code -->
        <div id="graph_x2" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "x²", {},
                            [
                                function (x) {
                                    return x * x;
                                }
                            ]).evaluate_linear_raster(-5, 5, 100, true)
                    ], {
                        'interactiveMode': 'pan',
                        'key': true,
                        'keyPosition': 'bl',
                        'x1_axis': {
                            'label': "x axis",
                            'scrollMin': null,
                            'scrollMax': null,
                            'scrollEnabled': true,
                            'zoomEnabled': true
                        },
                        "y1_axis": {
                            'label': "y axis"
                        }
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_x2")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
