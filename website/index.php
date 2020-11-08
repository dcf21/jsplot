<?php

// index.php

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
    "pageTitle" => "JSPlot",
    "pageDescription" => "JSPlot - A Javascript graph-plotting library",
    "activeTab" => null,
    "teaserImg" => null,
    "cssextra" => null,
    "includes" => [],
    "linkRSS" => null,
    "options" => []
];

$pageTemplate->header($pageInfo);

?>

    <div class="large_text">
        <p>
            <b>JSPlot</b> is an open-source Javascript graph-plotting and vector-graphics library, designed for
            embedding scientific charts in websites. It is licensed under the Gnu General Public License (GPL v3), and
            can be
            <a href="download.php">downloaded from GitHub</a>.
        </p>
        <p>
            It supports a wide range of chart types, including scatter charts, line charts, bar charts, and plots with
            error bars. Both 2D and 3D graphs are supported, and data can be either numerical or time stamps, making it
            easy to plot time-series data along axes which automatically render dates and times into an appropriate
            format.
        </p>
        <p>
            It is easy to make plots interactive, if required. The user can either click and drag the plot to scroll the
            axes, or use the mouse wheel to zoom in/out. Interactive charts are fully compatible with touch-screen
            devices, where pinch gestures are used to zoom.
        </p>
        <p>
            JSPlot can render charts onto HTML5 canvas objects, to PNG files, or to SVG files.
        </p>
        <p>
            You can find out more by browsing the
            <a href="demos.php">gallery of demos</a>,
            which includes the source-code used to generate each example. A more formal description of JSPlot's API
            can be found
            <a href="documentation.php">here</a>.
        </p>
    </div>

    <div id="demo_graph" style="max-width: 550px;">
        <!-- HTML code -->
        <div id="graph_helix" style="max-width:900px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "Helix 1", {'lineWidth': 5},
                            [
                                function (x) {
                                    return Math.cos(x + Math.PI);
                                },
                                function (x) {
                                    return Math.sin(x + Math.PI);
                                },
                            ]).evaluate_linear_raster(-10, 10, 1000, true),
                        new JSPlot_FunctionEvaluator(
                            "Helix 2", {'lineWidth': 5},
                            [
                                Math.cos, Math.sin
                            ]).evaluate_linear_raster(-10, 10, 1000, true),
                    ], {
                        'threeDimensional': true,
                        'interactiveMode': 'rotate',
                        'x1_axis': {
                            'zoomEnabled': true
                        }
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_helix")[0]
                );
            });
        </script>
    </div>

<?php
$pageTemplate->footer($pageInfo);
