<?php

// demo_linespoints.php

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
    "pageTitle" => "A plot of sin(x) with linespoints",
    "pageDescription" => "JSPlot - A plot of sin(x) with linespoints",
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
        This example demonstrates the use of the <span class="code">linespoints</span> plot style. This draws a
        series of data points on the graph, but also connects them with straight lines.
    </p>

    <div id="demo_graph">
        <!-- HTML code -->
        <div id="graph_sin_x" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "sin(x)", {
                                'plotStyle': 'linespoints'
                            },
                            [
                                Math.sin
                            ]).evaluate_linear_raster(-10, 10, 100, true),
                        new JSPlot_FunctionEvaluator(
                            "cos(x)", {
                                'plotStyle': 'linespoints'
                            },
                            [
                                Math.cos
                            ]).evaluate_linear_raster(-10, 10, 100, true)
                    ], {
                        'interactiveMode': 'pan',
                        'key': true,
                        'keyPosition': 'tl',
                        'x1_axis': {
                            'scrollMin': null,
                            'scrollMax': null,
                            'scrollEnabled': true,
                            'zoomEnabled': true
                        }
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_sin_x")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
