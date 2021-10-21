<?php

// demo_axes_inverted.php

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
    "pageTitle" => "A demonstration of a bar chart plotted along the vertical axis",
    "pageDescription" => "JSPlot - A demonstration of a bar chart plotted along the vertical axis",
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
        This example demonstrates how to change the roles of the horizontal and vertical axes, so functions are
        plotted along a vertical axis rather than a horizontal axis.
    </p>
    <p>
        The roles of the axes are configured separately for each data set, so it is possible to plot one function in
        the form <i>y=f(x)</i> and another function in the form <i>x=g(y)</i>.
    </p>
    <p>
        This is configured using the <span class="code">axis1</span> and <span class="code">axis2</span> settings on
        each data set, which configure the name of the axes which should take the role of abscissa (usually x) and
        ordinate (usually y) axes. Allowed options are <span class="code">x1</span> (bottom),
        <span class="code">x2</span> (top), <span class="code">y1</span> (left) and
        <span class="code">y2</span> (right). On three-dimensional graphs,
        <span class="code">z1</span> and <span class="code">z2</span> are also valid options.
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
                var gaussian = function (offset) {
                    return function (x) {
                        return Math.exp(-Math.pow(x, 2)) + offset
                    }
                }

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "Normal distribution", {
                                'plotStyle': 'boxes',
                                'axis1': 'y1',
                                'axis2': 'x1',
                                'color': new JSPlot_Color(0, 0, 0, 1),
                                'fillColor': new JSPlot_Color(1, 0, 0, 1)
                            },
                            [
                                gaussian(0)
                            ]).evaluate_linear_raster(-3, 3, 40, true),
                        new JSPlot_FunctionEvaluator(
                            "Upper limit signs", {
                                'plotStyle': 'upperlimits',
                                'axis1': 'y1',
                                'axis2': 'x1',
                                'color': new JSPlot_Color(0, 0, 0, 1)
                            },
                            [
                                gaussian(0.05)
                            ]).evaluate_linear_raster(-3, 3, 40, true)
                    ], {
                        'key': true,
                        'keyPosition': 'br'
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
