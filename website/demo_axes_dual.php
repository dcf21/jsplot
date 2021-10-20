<?php

// demo_axes_dual.php

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
    "pageTitle" => "A demonstration of a bar chart with two different vertical axes",
    "pageDescription" => "JSPlot - A demonstration of a bar chart with two different vertical axes",
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
        <div id="graph_barchart" style="max-width:1024px; border: 1px solid #888;"></div>

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
                            ]).evaluate_linear_raster(-10, 10, 100, true),
                        new JSPlot_FunctionEvaluator(
                            "x^2", {'axis2': 'y2'},
                            [
                                function (x) {
                                    return x * x;
                                }
                            ]).evaluate_linear_raster(-10, 10, 100, true)
                    ], {
                        'key': true,
                        'keyPosition': 'below'
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
