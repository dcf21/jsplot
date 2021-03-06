<?php

// demo_styles_barchart_dynamic.php

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
    "pageTitle" => "A demonstration of a bar chart with manually-set box widths",
    "pageDescription" => "JSPlot - A demonstration of a bar chart with manually-set box widths",
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
        This example demonstrates the use of the <span class="code">wboxes</span> plot style, which is used
        to create bar charts where the width of each bar is set individually as an additional column of data.
    </p>

    <div id="demo_graph">
        <!-- HTML code -->
        <div id="graph_barchart" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Function which returns a normal (Gaussian) distribution
                var gaussian = function (x) {
                    return Math.exp(-Math.pow(x, 2))
                }
                var box_width = function (x) {
                    return Math.max(0, (x + 4) * 0.05);
                }

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "Normal distribution", {
                                'plotStyle': 'wboxes',
                                'color': new JSPlot_Color(0, 0, 0, 1),
                                'fillColor': new JSPlot_Color(1, 0, 0, 1)
                            },
                            [
                                gaussian,
                                box_width
                            ]).evaluate_linear_raster(-3, 3, 20, true)
                    ], {
                        'boxFrom': 0.2,
                        'interactiveMode': 'pan',
                        'key': true,
                        'keyPosition': 'tr',
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
                    $("#graph_barchart")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
