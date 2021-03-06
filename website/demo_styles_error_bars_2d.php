<?php

// demo_styles_error_bars_2d.php

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
    "pageTitle" => "A 2D plot demonstrating the use of error bars",
    "pageDescription" => "JSPlot - A 2D plot demonstrating the use of error bars",
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
        This example demonstrates the use of the error bars and error range plot styles.
    </p>
    <p>
        The error bar plot styles produce error bars along one, two, or three axes, symmetrically around the central
        point. Additional columns of data specify the size of the error bar to be drawn along each axis.
    </p>
    <p>
        The error range plot styles produce error bars along one, two, or three axes, and the minimum and maximum
        extent of each error bar is specified separately. The first two data columns specify the (x, y) coordinates
        of the center of the error bar, while additional subsequent columns specify the minimum and maximum points
        along each axis in turn.
    </p>

    <div id="demo_graph">
        <!-- HTML code -->
        <div id="graph_errorbars" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_DataSet(
                            "xerrorbars", {
                                'plotStyle': 'xerrorbars'
                            },
                            [
                                [-1, -1, 0.49], [0, 0, 0.4], [1, 1, 0.29]
                            ], null),
                        new JSPlot_DataSet(
                            "yerrorbars", {
                                'plotStyle': 'yerrorbars'
                            },
                            [
                                [-1, 0, 0.49], [0, 1, 0.39], [1, -1, 0.29]
                            ], null),
                        new JSPlot_DataSet(
                            "xyerrorbars", {
                                'plotStyle': 'xyerrorbars'
                            },
                            [
                                [-1, 1, 0.49, 0.1], [0, -1, 0.4, 0.2], [1, 0, 0.29, 0.3]
                            ], null),
                    ], {
                        'key': true,
                        'keyPosition': 'below'
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_errorbars")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
