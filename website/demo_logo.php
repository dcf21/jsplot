<?php

// demo_logo.php

// -------------------------------------------------
// Copyright 2020 Dominic Ford.

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
    "pageTitle" => "The JSPlot logo",
    "pageDescription" => "JSPlot - The JSPlot logo",
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
        <div id="logo_example"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "logo", {
                                'color': new JSPlot_Color(0.5, 0.5, 0.5, 0.5),
                            },
                            [
                                function (x) {
                                    return Math.sin(
                                        1 / Math.hypot(x + 1.2, 0.1) + 1 / Math.hypot(x - 0.2, 0.15)
                                    );
                                }
                            ]).evaluate_linear_raster(-2, 3, 1000, true)
                    ], {
                        'interactiveMode': 'pan',
                        'gridAxes': [],
                        'aspect': 0.07,
                        'clip': false,
                        'x1_axis': {visible: false},
                        'y1_axis': {visible: false}
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#logo_example")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
