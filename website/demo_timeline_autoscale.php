<?php

// demo_timeline_autoscale.php

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
    "pageTitle" => "An example autoscaling time axis",
    "pageDescription" => "JSPlot - An example autoscaling time axis",
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
        This examples shows how to create a timeline axis which autoscales to contain all the available data.
    </p>
    <p>
        The horizontal axis of this plot is set to display as a timeline by setting the
        <span class="code">dataType</span> setting
        on the <span class="code">axis_x1</span> axis of the <span class="code">JSPlot_Graph</span> instance
        to <span class="code">timestamp</span>. In this mode, the numerical values along the axis are interpreted
        as Unix timestamps, and displayed as times and/or dates, depending on the range of the axis.
    </p>
    <p>
        In this example, the function <i>y=x</i> is plotted, and the numerical value is displayed as a straightforward
        number along the horizontal axis, but rendered as a date along the vertical axis.
    </p>
    <p>
        You can click and drag the graph horizontally to change the horizontal axis range, or use the mouse scroll wheel
        to zoom in or out.
    </p>

    <div id="demo_graph">
        <!-- HTML code -->
        <div id="graph_autoscaling_timeline" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_FunctionEvaluator(
                            "Timeline", {},
                            [
                                function (x) {
                                    return x;
                                }
                            ]).evaluate_linear_raster(946684800, 947548800, 1000, true)
                    ], {
                        'interactiveMode': 'pan',
                        'key': true,
                        'keyPosition': 'tl',
                        'x1_axis': {
                            'label': 'Unix time',
                            'scrollMin': null,
                            'scrollMax': null,
                            'scrollEnabled': true,
                            'zoomEnabled': true
                        },
                        'y1_axis': {
                            'label': 'Date and time',
                            'dataType': 'timestamp'
                        }
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_autoscaling_timeline")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
