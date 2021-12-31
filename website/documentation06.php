<?php

// documentation06.php

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
    "pageTitle" => "JSPlot Documentation: Graph options",
    "pageDescription" => "JSPlot - Documentation: Graph options",
    "activeTab" => "documentation",
    "teaserImg" => null,
    "cssextra" => null,
    "includes" => [],
    "linkRSS" => null,
    "options" => []
];

$pageTemplate->header($pageInfo);

?>

    <ol>
        <li><a href="documentation.php">The plotting canvas</a></li>
        <li><a href="documentation02.php">Plotting data</a></li>
        <li><a href="documentation03.php">Plotting functions</a></li>
        <li><a href="documentation04.php">Vector graphics</a></li>
        <li><a href="documentation05.php">Graph plotting styles</a></li>
        <li><b>Graph options</b></li>
        <li><a href="documentation07.php">Graph axis options</a></li>
        <li><a href="documentation08.php">Vector graphics objects</a></li>
    </ol>

    <hr/>

    <p>Documentation lives here.</p>

    <h5 id="JSPlot_Graph"><span class="code">JSPlot_Graph</span> class: API reference</h5>

    <p>
        Instances of the <span class="code">JSPlot_Graph</span> class are used to add a graph to a drawing canvas. It
        is possible to display multiple graphs on the same drawing canvas.
    </p>

    <p class="code">
        my_graph = new JSPlot_Graph(datasets, settings);
    </p>

    <table class="bordered stripy api_ref">
        <thead>
        <tr>
            <td>Argument</td>
            <td>Allowed values</td>
            <td>Description</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="code">datasets</td>
            <td>
                Array
            </td>
            <td>
                <p>
                    An array of datasets to plot onto the graph. These should be instances of the
                    <a href="documentation06.php#JSPlot_DataSet"><span class="code">JSPlot_DataSet</span></a> class.
                </p>
            </td>
        </tr>
        <tr>
            <td class="code">settings</td>
            <td>
                Associative array
            </td>
            <td>
                An associative array of configuration options. Allowed key values are listed below.
            </td>
        </tr>
        </tbody>
    </table>

    <p>
        Allowed configuration parameters within the <span class="code">settings</span> array are as follows:
    </p>

    <table class="bordered stripy api_ref">
        <thead>
        <tr>
            <td>Field</td>
            <td>Allowed values</td>
            <td>Description</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="code">annotations</td>
            <td>
                An array of
                <a href="documentation06.php#JSPlot_Label_Arrow"><span class="code">JSPlot_Label_Arrow</span></a>
                and/or
                <a href="documentation06.php#JSPlot_Label_Text"><span class="code">JSPlot_Label_Text</span></a>
                instances.
            </td>
            <td>
                This list of annotations is used to superimpose text labels and arrows over the top of the graph.
            </td>
        </tr>
        <tr>
            <td class="code">aspect</td>
            <td>Number</td>
            <td>
                The ratio of the length of the vertical (y) axis, to the length of the horizontal (x) axis.
                Default is 0.618 on 2D plots, and 1 on 3D plots.
            </td>
        </tr>
        <tr>
            <td class="code">aspectZ</td>
            <td>Number</td>
            <td>
                The ratio of the length of the third (z) axis, to the length of the horizontal (x) axis on 3D plots.
                Default: 1
            </td>
        </tr>
        <tr>
            <td class="code">axesColor</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color of the axes of the graph
            </td>
        </tr>
        <tr>
            <td class="code">bar</td>
            <td>Boolean</td>
            <td>
                Not implemented.
            </td>
        </tr>
        <tr>
            <td class="code">boxFrom</td>
            <td>Number</td>
            <td>
                The horizontal line which forms the bottom of the bars on bar charts. Default 0.
            </td>
        </tr>
        <tr>
            <td class="code">boxWidth</td>
            <td>Number</td>
            <td>
                If set, all of the bars of bar charts have the same width along the horizontal axis. If left unset, all
                the bars automatically fill the available horizontal space. Default: <span class="code">null</span>.
            </td>
        </tr>
        <tr>
            <td class="code">clip</td>
            <td>Boolean</td>
            <td>
                If true, then data points are clipped at the edges of the plot, and not allowed to extend over the axis
                lines. If false, then data points are allowed to extend over the axis lines.
            </td>
        </tr>
        <tr>
            <td class="code">fontSize</td>
            <td>Number</td>
            <td>
                Scaling factor for the displayed size of all text on the graph.
            </td>
        </tr>
        <tr>
            <td class="code">gridAxes</td>
            <td>Array of strings</td>
            <td>
                A list of the axes which should produce grid lines associated with their tick marks. Default:
                <span class="code">['x1', 'y1', 'z1']</span>.
            </td>
        </tr>
        <tr>
            <td class="code">gridMajorColor</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color of the major grid lines drawn behind the graph
            </td>
        </tr>
        <tr>
            <td class="code">gridMinorColor</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color of the minor grid lines drawn behind the graph
            </td>
        </tr>
        <tr id="JSPlot_Graph_interactiveMode">
            <td class="code">interactiveMode</td>
            <td>String</td>
            <td>
                A string indicating how the plot should respond when the user clicks or drags it. Options are:
                <span class="code">none</span> &ndash; the plot does not respond to being dragged,
                <span class="code">pan</span> &ndash; the plot's axis ranges move in response to being dragged,
                <span class="code">rotate</span> &ndash; (3D plots only) the plot rotates when dragged.
            </td>
        </tr>
        <tr>
            <td class="code">key</td>
            <td>Boolean</td>
            <td>
                Boolean indicating whether the graph should show a legend listing all the plotted datasets.
            </td>
        </tr>
        <tr>
            <td class="code">keyColumns</td>
            <td>Number</td>
            <td>
                The number of columns into whether the graph's legend should be arranged. Default: null (automatic).
            </td>
        </tr>
        <tr>
            <td class="code">keyOffset</td>
            <td>Array of two numbers</td>
            <td>
                This is used to manually tweak the position of the graph legend, in pixels.
                Default <span class="code">[0, 0]</span>.
            </td>
        </tr>
        <tr>
            <td class="code">keyPosition</td>
            <td>String</td>
            <td>
                A string indicating the position of the graph legend. Allowed values:
                <span class="code">tl</span> &ndash; top left,
                <span class="code">tm</span> &ndash; top centre,
                <span class="code">tr</span> &ndash; top right,
                <span class="code">ml</span> &ndash; middle left,
                <span class="code">mm</span> &ndash; middle centre,
                <span class="code">mr</span> &ndash; middle right,
                <span class="code">bl</span> &ndash; bottom left,
                <span class="code">bm</span> &ndash; bottom centre,
                <span class="code">br</span> &ndash; bottom right,
                <span class="code">above</span> &ndash; above,
                <span class="code">below</span> &ndash; below,
                <span class="code">left</span> &ndash; left,
                <span class="code">right</span> &ndash; right.
            </td>
        </tr>
        <tr>
            <td class="code">origin</td>
            <td>Array of two numbers</td>
            <td>
                The position of the bottom-left corner of the graph on the canvas, in pixels.
                Default <span class="code">[0, 0]</span>.
            </td>
        </tr>
        <tr>
            <td class="code">textColor</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color of the text labels associated with a graph
            </td>
        </tr>
        <tr>
            <td class="code">threeDimensional</td>
            <td>Boolean</td>
            <td>
                A boolean indicating whether this chart is two-dimensional (<span class="code">false</span>) or
                three-dimensional (<span class="code">true</span>).
                Default <span class="code">false</span>.
            </td>
        </tr>
        <tr>
            <td class="code">title</td>
            <td>String</td>
            <td>
                A title to write at the top of the graph.
            </td>
        </tr>
        <tr>
            <td class="code">titleOffset</td>
            <td>Array of two numbers</td>
            <td>
                This is used to manually tweak the position of the title of the graph, in pixels.
                Default <span class="code">[0, 0]</span>.
            </td>
        </tr>
        <tr>
            <td class="code">width</td>
            <td>Number or String</td>
            <td>
                The width of the graph &ndash; either specified as a numerical number of pixels, or as a percentage
                of the available canvas width, e.g. "50%". Alternatively, if set null, the graph automatically
                scales to fill the available canvas width. Default: <span class="code">null</span>.
            </td>
        </tr>
        <tr>
            <td class="code">widthIncludesAxes</td>
            <td>Boolean</td>
            <td>
                A boolean indicating whether the specified width of the chart should include its axes, or specify the
                width of the plotting area. This should usually be set <span class="code">true</span>, but it may be
                useful to set it <span class="code">false</span> when trying to make multiple graphs line up on a
                shared canvas.
                Default <span class="code">true</span>.
            </td>
        </tr>
        <tr>
            <td class="code">viewAngleXY</td>
            <td>Number</td>
            <td>
                The viewing angle of 3D charts around the XY-plane (degrees). Default: 60 degrees.
            </td>
        </tr>
        <tr>
            <td class="code">viewAngleYZ</td>
            <td>Number</td>
            <td>
                The viewing angle of 3D charts around the YZ-plane (degrees). Default: 30 degrees.
            </td>
        </tr>
        <tr id="config_x1_axis">
            <td class="code">x1_axis</td>
            <td>Array</td>
            <td>
                An array of settings to pass to the bottom horizontal axis's
                <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
            </td>
        </tr>
        <tr>
            <td class="code">x2_axis</td>
            <td>Array</td>
            <td>
                An array of settings to pass to the top horizontal axis's
                <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
            </td>
        </tr>
        <tr>
            <td class="code">y1_axis</td>
            <td>Array</td>
            <td>
                An array of settings to pass to the left vertical axis's
                <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
            </td>
        </tr>
        <tr>
            <td class="code">y2_axis</td>
            <td>Array</td>
            <td>
                An array of settings to pass to the right vertical axis's
                <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
            </td>
        </tr>
        <tr>
            <td class="code">z1_axis</td>
            <td>Array</td>
            <td>
                An array of settings to pass to the front z-axis's
                <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
                (3D plots only)
            </td>
        </tr>
        <tr>
            <td class="code">z2_axis</td>
            <td>Array</td>
            <td>
                An array of settings to pass to the back z-axis's
                <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
                (3D plots only)
            </td>
        </tr>
        </tbody>
    </table>

<?php
$pageTemplate->footer($pageInfo);
