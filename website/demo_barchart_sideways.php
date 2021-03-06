<?php

// demo_styles_barchart.php

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
    "pageTitle" => "A sideways bar chart demonstration",
    "pageDescription" => "JSPlot - A sideways bar chart demonstration",
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
        This example demonstrates how to generate a bar chart with horizontal bars.
    </p>
    <p>
        The roles of the horizontal and vertical axes are inverted by using the <span class="code">axis1</span> and
        <span class="code">axis2</span> settings on the <span class="code">JSPlot_DataSet</span> instance describing the
        bar chart.
    </p>
    <p>
        Allowed options are <span class="code">x1</span> (bottom),
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

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_DataSet(
                            "votes", {
                                'plotStyle': 'boxes',
                                'axis1': 'y1',
                                'axis2': 'x1',
                                'color': new JSPlot_Color(0, 0, 0, 1),
                                'fillColor': new JSPlot_Color(1, 0, 0, 1)
                            },
                            [
                                [3, 1190], [2, 870], [1, 620], [0, 205]
                            ], null)
                    ], {
                        'aspect': 0.15,
                        'x1_axis': {
                            'label': 'Number of votes',
                            'min': 0,
                            'ticks': {
                                'tickMin': 0,
                                'tickStep': 100
                            }
                        },
                        'y1_axis': {
                            'label': 'Party',
                            'ticks': {
                                'tickList': [
                                    [3, "A"],
                                    [2, "B"],
                                    [1, "C"],
                                    [0, "D"]
                                ]
                            }
                        }
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
