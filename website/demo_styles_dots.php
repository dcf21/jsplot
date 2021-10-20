<?php

// demo_styles_dots.php

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
    "pageTitle" => "A plot using the dots style",
    "pageDescription" => "JSPlot - A plot using the dots style",
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
        <div id="graph_dots" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create some random data
                var random_point = function () {
                    var theta = Math.random() * 2 * Math.PI;
                    var radius = 1 / (Math.random() * 20);
                    return [radius * Math.sin(theta), radius * Math.cos(theta)]
                }

                var random_data_set = []
                for (var i = 0; i < 2000; i++) {
                    random_data_set.push(random_point())
                }

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_DataSet(
                            "Random dots", {
                                'plotStyle': 'dots'
                            },
                            random_data_set, null)
                    ], {
                        'key': true,
                        'keyPosition': 'tl',
                        'aspect': 1,
                        'x1_axis': {
                            'min': -2, 'max': 2
                        },
                        'y1_axis': {
                            'min': -2, 'max': 2
                        }
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_dots")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
