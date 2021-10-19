<?php

// demo_styles_arrows.php

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
    "pageTitle" => "A plot with arrows",
    "pageDescription" => "JSPlot - A plot with arrows",
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
        <div id="graph_arrows" style="max-width:1024px; border: 1px solid #888;"></div>

        <!-- Javascript code -->
        <script type="text/javascript">
            $(function () {
                // Display source code for this page
                $("#source_code").text($("#demo_graph").html());

                // Create canvas to put graph onto
                var canvas = new JSPlot_Canvas({
                    "graph_1": new JSPlot_Graph([
                        new JSPlot_DataSet(
                            "arrows_head demo", {
                                'plotStyle': 'arrows_head',
                                'lineWidth': 3
                            },
                            [
                                [-4, -4, -2, 4], [-2, -4, -1, 4]
                            ], null),
                        new JSPlot_DataSet(
                            "arrows_nohead demo", {
                                'plotStyle': 'arrows_nohead',
                                'lineWidth': 2
                            },
                            [
                                [-1, -4, -0.5, 4], [1, -4, 0.5, 4]
                            ], null),
                        new JSPlot_DataSet(
                            "arrows_twohead demo", {
                                'plotStyle': 'arrows_twohead',
                                'lineWidth': 5
                            },
                            [
                                [4, -4, 2, 4], [2, -4, 1, 4]
                            ], null)
                    ], {
                        'interactiveMode': 'pan',
                        'x1_axis': {
                            'scrollMin': null,
                            'scrollMax': null,
                            'scrollEnabled': true,
                            'zoomEnabled': true
                        }
                    })
                }, {});

                // Render plot
                canvas.renderToCanvas(
                    $("#graph_arrows")[0]
                );
            });
        </script>
    </div>

    <h4>Source code for this page</h4>
    <pre id="source_code"></pre>

<?php
$pageTemplate->footer($pageInfo);
