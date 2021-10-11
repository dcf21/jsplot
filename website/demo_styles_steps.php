<?php

// demo_styles_steps.php

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

require "php/imports.php";

$pageInfo = [
    "pageTitle" => "A plot demonstrating the step plot styles",
    "pageDescription" => "JSPlot - A plot demonstrating the step plot styles",
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

    <div id="demo_graph">
        <!-- HTML code -->
        <div id="graph_steps" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Function which returns a normal (Gaussian) distribution
                var gaussian = function (x) {
                    return Math.exp(-Math.pow(x, 2))
                }

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "steps", {
                                'plotStyle': 'steps'
                            },
                            [
                                gaussian
                            ]).evaluate_linear_raster(-3, 3, 25, true),
                        new JSPlot_FunctionEvaluator(
                            "histeps", {
                                'plotStyle': 'histeps'
                            },
                            [
                                gaussian
                            ]).evaluate_linear_raster(-3, 3, 25, true),
                        new JSPlot_FunctionEvaluator(
                            "fsteps", {
                                'plotStyle': 'fsteps'
                            },
                            [
                                gaussian
                            ]).evaluate_linear_raster(-3, 3, 25, true),
                        new JSPlot_FunctionEvaluator(
                            "points", {
                                'plotStyle': 'points'
                            },
                            [
                                gaussian
                            ]).evaluate_linear_raster(-3, 3, 25, true)
                    ], {
                        'interactiveMode': 'pan',
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
                    $("#graph_steps")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
