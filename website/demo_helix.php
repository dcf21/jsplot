<?php

// demo_helix.php

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
    "pageTitle" => "A 3D double helix",
    "pageDescription" => "JSPlot - A 3D double helix",
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
        This example demonstrates how to generate a three-dimensional graph, which the user can rotate by clicking and
        dragging with the pointer.
    </p>
    <p>
        The 3D plotting mode is enabled by setting the <span class="code">threeDimensional</span> setting on the
        <span class="code">JSPlot_Graph</span> instance to <span class="code">true</span>.
    </p>
    <p>
        The user is able to rotate the graph with the pointer when the <span class="code">interactiveMode</span> setting
        is set to <span class="code">rotate</span>.
    </p>

    <div id="demo_graph">
        <!-- HTML code -->
        <div id="graph_helix" style="max-width:900px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "Helix 1", {'lineWidth': 8},
                            [
                                function (x) {
                                    return Math.cos(x + Math.PI);
                                },
                                function (x) {
                                    return Math.sin(x + Math.PI);
                                },
                            ]).evaluate_linear_raster(-10, 10, 1000, true),
                        new JSPlot_FunctionEvaluator(
                            "Helix 2", {'lineWidth': 8},
                            [
                                Math.cos, Math.sin
                            ]).evaluate_linear_raster(-10, 10, 1000, true),
                    ], {
                        'threeDimensional': true,
                        'interactiveMode': 'rotate',
                        'key': true,
                        'keyPosition': 'tl',
                        'x1_axis': {
                            'zoomEnabled': true
                        }
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_helix")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
