<?php

// demo_styles_error_bars_3d.php

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
    "pageTitle" => "A 3D plot demonstrating the use of error bars",
    "pageDescription" => "JSPlot - A 3D plot demonstrating the use of error bars",
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
                                [-1, -1, 0, 0.49], [0, 0, 0, 0.4]
                            ], null),
                        new JSPlot_DataSet(
                            "yerrorbars", {
                                'plotStyle': 'yerrorbars'
                            },
                            [
                                [-1, 0, 0, 0.49], [0, 1, 0, 0.39]
                            ], null),
                        new JSPlot_DataSet(
                            "yerrorbars", {
                                'plotStyle': 'zerrorbars'
                            },
                            [
                                [-1, 0, -0.59, 0.49], [0, 1, -0.59, 0.39]
                            ], null),
                        new JSPlot_DataSet(
                            "xyerrorbars", {
                                'plotStyle': 'xyerrorbars'
                            },
                            [
                                [-1, 1, 0.49, 0.49, 0.1], [0, -1, 0.4, 0.39, 0.2]
                            ], null),
                        new JSPlot_DataSet(
                            "xyerrorbars", {
                                'plotStyle': 'yzerrorbars'
                            },
                            [
                                [-1, 1, 0.79, 0.49, 0.1], [0, -1, 0.79, 0.39, 0.2]
                            ], null),
                        new JSPlot_DataSet(
                            "xyzerrorbars", {
                                'plotStyle': 'xyzerrorbars'
                            },
                            [
                                [0, 0, 1.2, 0.15, 0.15, 0.15]
                            ], null)
                    ], {
                        'threeDimensional': true,
                        'interactiveMode': 'rotate',
                        'aspect': 1,
                        'x1_axis': {
                            'label':'x', 'min': -2, 'max': 2
                        },
                        'y1_axis': {
                            'label':'y', 'min': -2, 'max': 2
                        },
                        'z1_axis': {
                            'label':'z', 'min': -2, 'max': 2
                        }
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
