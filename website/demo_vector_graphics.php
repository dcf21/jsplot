<?php

// demo_vector_graphics.php

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
    "pageTitle" => "A vector graphics demo",
    "pageDescription" => "JSPlot - A vector graphics demo",
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
        <div id="vector_graphics_demo" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "outer_box": new JSPlot_Rectangle({
                        'origin': [-50, -50],
                        'width': 400,
                        'height': 400,
                        'fillColor': null,
                        'strokeColor': new JSPlot_Color(0.5, 0.5, 0.5, 1)
                    }),
                    "box_1": new JSPlot_Rectangle({
                        'origin': [10, 10],
                        'z_index': -1,
                        'fillColor': new JSPlot_Color(1, 0, 0, 0.4)
                    }),
                    "box_2": new JSPlot_Rectangle({
                        'origin': [140, 10],
                        'z_index': 5,
                        'fillColor': new JSPlot_Color(0, 1, 0, 0.4)
                    }),
                    "box_3": new JSPlot_Rectangle({
                        'origin': [10, 140],
                        'z_index': 5,
                        'fillColor': new JSPlot_Color(0, 0, 1, 0.4)
                    }),
                    "circle": new JSPlot_Circle({
                        'origin': [100, 100],
                        'z_index': 5,
                        'radius': 25,
                        'fillColor': new JSPlot_Color(1, 1, 0, 0.4),
                        'strokeColor': new JSPlot_Color(0, 0, 0, 1),
                        'strokeLineWidth': 4
                    }),
                }, {});

                // Add a grid
                for (var j = 0; j <= 10; j++) {
                    canvas.addItem("h_arrow_" + j, new JSPlot_Arrow({
                        'origin': [0, j * 25],
                        'target': [200, j * 25],
                        'color': new JSPlot_Color(0.4, 0.4, 0.4, 1)
                    }));
                    canvas.addItem("h_text_" + j, new JSPlot_Text({
                        'origin': [-5, j * 25],
                        'h_align': "right",
                        'v_align': "middle",
                        'text': j * 25
                    }));
                    canvas.addItem("v_arrow_" + j, new JSPlot_Arrow({
                        'origin': [j * 25, 0],
                        'target': [j * 25, 200],
                        'color': new JSPlot_Color(0.4, 0.4, 0.4, 1)
                    }));
                }

                // Render plot
                canvas.renderToCanvas(
                    $("#vector_graphics_demo")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
