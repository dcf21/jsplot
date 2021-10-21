<?php

// demo_styles_surface.php

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
    "pageTitle" => "A surface plot 1",
    "pageDescription" => "JSPlot - A surface plot 1",
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
        This example demonstrates the use of the <span class="code">surface</span> plot style to generate a 3D surface
        plot. Click and drag the plot to rotate it.
    </p>

    <div id="demo_graph">
        <!-- HTML code -->
        <div id="graph_surface" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create polynomial function that we are going to plot
                var custom_polynomial = function (x, y) {
                    return x ** 3 / 20 + y ** 2;
                }

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "Polynomial surface", {
                                'plotStyle': 'surface',
                                'fillColor': new JSPlot_Color(0, 0.75, 0, 1),
                                'color': new JSPlot_Color(0, 0, 0, 1)
                            },
                            [
                                custom_polynomial
                            ]).evaluate_over_grid(-10, 10, 30, -10, 10, 30)
                    ], {
                        'threeDimensional': true,
                        'key': true,
                        'keyPosition': 'below',
                        'interactiveMode': 'rotate'
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_surface")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
