<?php

// index.php

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
    "pageTitle" => "JSPlot",
    "pageDescription" => "JSPlot - A Javascript graph-plotting library",
    "fluid" => true,
    "activeTab" => null,
    "teaserImg" => null,
    "cssextra" => null,
    "includes" => [],
    "linkRSS" => null,
    "options" => []
];

$pageTemplate->header($pageInfo);

?>

    <div class="large_text" style="margin: 0 auto; max-width: 1200px;">
        <p>
            <b>JSPlot</b> is an open-source Javascript graph-plotting and vector-graphics library, designed for
            embedding scientific charts in websites. It is licensed under the Gnu General Public License (GPL v3), and
            can be
            <a href="download.php">downloaded from GitHub</a>.
        </p>
        <p>
            It supports a wide range of 2D and 3D chart types, which are designed to look similar to styles often seen
            in the scientific literature. Supported chart types include scatter charts, line charts, bar charts, plots
            with error bars, and more. Data can be either numerical or time stamps, making it easy to plot time-series
            data along axes which automatically render dates and times into an appropriate format.
        </p>
        <p>
            Options are provided to make plots either static or interactive. In the latter case, the user can click
            and drag plots to scroll the axes or use the mouse wheel to zoom in/out. Such interactive charts are
            fully compatible with touch-screen devices, where pinch gestures are used to zoom.
        </p>
        <p>
            Supported output media include HTML5 canvas objects, PNG files, and SVG files.
        </p>
        <p>
            You can find out more by browsing the
            <a href="demos.php">gallery of demos</a>,
            which includes the source-code used to generate each example. A more formal description of JSPlot's API
            can be found
            <a href="documentation.php">here</a>.
        </p>
    </div>

    <div id="demo_graph" style="max-width: 900px;">
        <!-- HTML code -->
        <div id="graph_helix"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Create sinc function that we are going to plot
                var sinc = function (x, y) {
                    var r = Math.hypot(x, y);
                    return Math.sin(r) / r;
                }

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "sinc function", {
                                'plotStyle': 'surface',
                                'fillColor': new JSPlot_Color(0, 0.75, 0, 1),
                                'color': new JSPlot_Color(0, 0, 0, 0)
                            },
                            [
                                sinc
                            ]).evaluate_over_grid(-10, 10, 60, -10, 10, 60)
                    ], {
                        'threeDimensional': true,
                        'interactiveMode': 'rotate'
                    })
                }, {
                    'allow_export_png': false,
                    'allow_export_svg': false,
                    'allow_export_csv': false
                });

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_helix")[0]
                );
            });
        </script>
    </div>

<?php
$pageTemplate->footer($pageInfo);
