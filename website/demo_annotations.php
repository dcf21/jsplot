<?php

// demo_annotations.php

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
    "pageTitle" => "A graph with annotations",
    "pageDescription" => "JSPlot - A graph with annotations",
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
        <div id="graph_annotated" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Function which returns a normal (Gaussian) distribution
                var gaussian = function (x) {
                    return Math.exp(-Math.pow(x, 2))
                }

                // Create graph
                var graph = new JSPlot_Graph([
                    new JSPlot_FunctionEvaluator(
                        "Normal distribution", {
                            'plotStyle': 'boxes',
                            'color': new JSPlot_Color(0, 0, 0, 1),
                            'fillColor': new JSPlot_Color(1, 0, 0, 1)
                        },
                        [
                            gaussian
                        ]).evaluate_linear_raster(-3, 3, 50, true)
                ], {
                    'x1_axis': {
                        'min': -4, 'max': 4
                    }
                });

                // Create annotations for graph
                var annotations = [];
                annotations.push(
                    new JSPlot_Label_Text({
                        'position': [-2.6, 0.8],
                        'text': "Rising part of the curve",
                        'fontWeight': 'bold',
                        'fontSize': 16,
                        'axis_x': graph.axes['x1'],
                        'axis_y': graph.axes['y1'],
                        'axis_z': graph.axes['z1'],
                    })
                );
                annotations.push(
                    new JSPlot_Label_Arrow({
                        'origin': [-2.4, 0.76],
                        'target': [-1, 0.5],
                        'strokeLineWidth': 2,
                        'axis_x': graph.axes['x1'],
                        'axis_y': graph.axes['y1'],
                        'axis_z': graph.axes['z1'],
                    })
                );
                annotations.push(
                    new JSPlot_Label_Text({
                        'position': [2.6, 0.8],
                        'text': "Falling part of the curve",
                        'fontWeight': 'bold',
                        'fontSize': 16,
                        'axis_x': graph.axes['x1'],
                        'axis_y': graph.axes['y1'],
                        'axis_z': graph.axes['z1'],
                    })
                );
                annotations.push(
                    new JSPlot_Label_Arrow({
                        'origin': [2.4, 0.76],
                        'target': [1, 0.5],
                        'strokeLineWidth': 2,
                        'axis_x': graph.axes['x1'],
                        'axis_y': graph.axes['y1'],
                        'axis_z': graph.axes['z1'],
                    })
                );

                // Attach annotations to the graph
                graph.configure({'annotations': annotations});


                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": graph
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_annotated")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
