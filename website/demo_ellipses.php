<?php

// demo_ellipses.php

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
    "pageTitle" => "A vector graphics demo: nested ellipses",
    "pageDescription" => "JSPlot - A vector graphics demo: nested ellipses",
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
    This example demonstrates JSPlot's function for displaying ellipses on vector graphics canvases.
</p>

    <div id="demo_graph">
        <!-- HTML code -->
        <div id="vector_graphics_demo" style="max-width:1024px;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({}, {});

                // Add ellipses to the canvas
                for (var j = 0; j < 50; j++) {
                    var scaling = 20 + j * 5;
                    canvas.addItem("ellipse_" + j, new JSPlot_Ellipse({
                        'origin': [0, 0],
                        'major_axis': 1.2 * scaling,
                        'minor_axis': 0.8 * scaling,
                        'position_angle': 5 * j,
                        'strokeColor': new JSPlot_Color(0.4, 0.4, 0.4, 1),
                        'fillColor': null
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
