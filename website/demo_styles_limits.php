<?php

// demo_styles_limits.php

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
    "pageTitle" => "A plot demonstrating the use of upper and lower limits",
    "pageDescription" => "JSPlot - A plot demonstrating the use of upper and lower limits",
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
        This example demonstrates the use of the <span class="code">lower_limits</span> and
        <span class="code">upper_limits</span> plot styles.
    </p>

    <div id="demo_graph">
        <!-- HTML code -->
        <div id="graph_limits" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create some random data
                var lower_limits = [
                    [-2, -1],
                    [-1, -0.6],
                    [2, -0.4]
                ];

                var upper_limits = [
                    [-1.5, 1.2],
                    [0, 0.6]
                ];

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_DataSet(
                            "upper_limits", {
                                'plotStyle': 'upperlimits'
                            },
                            upper_limits, null),
                        new JSPlot_DataSet(
                            "lower_limits", {
                                'plotStyle': 'lowerlimits'
                            },
                            lower_limits, null)
                    ], {
                        'key': true,
                        'keyPosition': 'below',
                        'x1_axis': {
                            'min': -3, 'max': 3
                        },
                        'y1_axis': {
                            'min': -2, 'max': 2
                        }
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_limits")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
