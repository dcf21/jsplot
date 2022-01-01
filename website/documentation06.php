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
        <tr id="annotations_setting">
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

    <h5 id="JSPlot_DataSet"><span class="code">JSPlot_DataSet</span> class</h5>

    <p>
        Instances of the <span class="code">JSPlot_DataSet</span> class are used to add datasets to graphs.
        An array of such instances should be passed to the <span class="code">datasets</span> argument of
        the <a href="documentation06.php#JSPlot_Graph"><span class="code">JSPlot_Graph</span></a> constructor.
    </p>
    <p class="code">
        my_dataset = new JSPlot_DataSet(title, styling, data, update_callback);
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
            <td class="code">title</td>
            <td>
                String
            </td>
            <td>
                The label for this dataset in the graph's legend. Set to a blank string to create no legend entry
                for this dataset.
            </td>
        </tr>
        <tr>
            <td class="code">styling</td>
            <td>
                Associative array
            </td>
            <td>
                An associative array of styling options for this dataset. Allowed key values are
                <a href="documentation06.php#styling_options">listed below</a>.
            </td>
        </tr>
        <tr>
            <td class="code">data</td>
            <td>
                Array of arrays of numbers
            </td>
            <td>
                The data to be plotted.
            </td>
        </tr>
        <tr>
            <td class="code">update_callback</td>
            <td>
                Function
            </td>
            <td>
                Supply an optional callback-function to be called whenever the ranges of the axes on the graph
                on which this data is displayed get updated. This is used internally by the
                <a href="documentation03.php#JSPlot_FunctionEvaluator">JSPlot_FunctionEvaluator</a> class to
                ensure that datasets which are automatically generated by evaluating Javascript functions are
                re-evaluated over an appropriate span of values whenever the user scrolls the graph.
            </td>
        </tr>
        </tbody>
    </table>

    <p id="styling_options">
        Allowed configuration parameters within the <span class="code">styling</span> array are as follows:
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
            <td class="code">color</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color to use when drawing each data point. If null, then a sequence of colors is automatically
                cycled through.
            </td>
        </tr>
        <tr>
            <td class="code">fillColor</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color to use when filling each data point. This setting is not used by all
                <a href="documentation04.php">plot styles</a>.
            </td>
        </tr>
        <tr id="plotStyle">
            <td class="code">plotStyle</td>
            <td>
                String
            </td>
            <td>
                The style to use when plotting this data set. See
                <a href="documentation04.php">this page</a> for a complete list of the available styles.
            </td>
        </tr>
        <tr>
            <td class="code">lineType</td>
            <td>
                Number
            </td>
            <td>
                The style of line (e.g. solid, dotted, dashed) to use when plotting this data set. See
                <a href="documentation04.php">this page</a> for a complete list of the available styles.
            </td>
        </tr>
        <tr>
            <td class="code">pointType</td>
            <td>
                Number
            </td>
            <td>
                The style of points (e.g. circles, squares, triangles) to use when plotting this data set. See
                <a href="documentation04.php">this page</a> for a complete list of the available styles.
            </td>
        </tr>
        <tr>
            <td class="code">lineWidth</td>
            <td>
                Number
            </td>
            <td>
                The width of line to use when drawing a line between the data points of this data set, in plot styles
                which do this. Default: 1
            </td>
        </tr>
        <tr>
            <td class="code">pointLineWidth</td>
            <td>
                Number
            </td>
            <td>
                The width of line to use when drawing data points, in plot styles which do this. Default: 1
            </td>
        </tr>
        <tr>
            <td class="code">pointSize</td>
            <td>
                Number
            </td>
            <td>
                A scaling factor to apply to the size of all the points drawn for this dataset. Default: 1
            </td>
        </tr>
        </tbody>
    </table>

    <h5 id="JSPlot_Label_Arrow"><span class="code">JSPlot_Label_Arrow</span> class</h5>

    <p>
        Instances of the <span class="code">JSPlot_Label_Arrow</span> class can be used to superimpose arrows on top of
        graphs. A list of annotations to superimpose over a graph should be passed as that graph's
        <a href="#annotations_setting"><span class="code">annotations</span></a> setting.
    </p>
    <p class="code">
        my_annotation = new JSPlot_Label_Arrow(settings);
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
            <td class="code">axis_x</td>
            <td>
                Any valid <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
            </td>
            <td>
                The horizontal axis along which the position of this arrow is specified.
            </td>
        </tr>
        <tr>
            <td class="code">axis_y</td>
            <td>
                Any valid <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
            </td>
            <td>
                The vertical axis along which the position of this arrow is specified.
            </td>
        </tr>
        <tr>
            <td class="code">axis_z</td>
            <td>
                Any valid <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
            </td>
            <td>
                The Z-axis along which the position of this arrow is specified (3D plots only).
            </td>
        </tr>
        <tr>
            <td class="code">arrowType</td>
            <td>
                string
            </td>
            <td>
                Allowed values:
                <br/>
                <span class="code">single</span> &ndash; A single-headed arrow
                <br/>
                <span class="code">double</span> &ndash; A double-headed bi-directional arrow
                <br/>
                <span class="code">back</span> &ndash; A single-headed arrow pointing backwards
                <br/>
                <span class="code">none</span> &ndash; A line with no arrow head
            </td>
        </tr>
        <tr>
            <td class="code">color</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color of this arrow.
            </td>
        </tr>
        <tr>
            <td class="code">strokeLineWidth</td>
            <td>
                Number
            </td>
            <td>
                The width of line to use when drawing this arrow. Default: 1
            </td>
        </tr>
        <tr>
            <td class="code">origin</td>
            <td>[Number, Number]</td>
            <td>
                The coordinates of the start of the arrow, measured against the selected axes. Two coordinates should
                be supplied on 2D graphs, and three coordinates on 3D graphs.
            </td>
        </tr>
        <tr>
            <td class="code">target</td>
            <td>[Number, Number]</td>
            <td>
                The coordinates of the end of the arrow, measured against the selected axes. Two coordinates should
                be supplied on 2D graphs, and three coordinates on 3D graphs.
            </td>
        </tr>
        <tr>
            <td class="code">z_index</td>
            <td>Number</td>
            <td>
                The stack order of the items to be superimposed over this graph. An element with greater stack order
                is always in front of an element with a lower stack order.
            </td>
        </tr>
        </tbody>
    </table>

    <h5 id="JSPlot_Label_Text"><span class="code">JSPlot_Label_Text</span> class</h5>

    <p>
        Instances of the <span class="code">JSPlot_Label_Text</span> class can be used to superimpose text labels on
        top of graphs. A list of annotations to superimpose over a graph should be passed as that graph's
        <a href="#annotations_setting"><span class="code">annotations</span></a> setting.
    </p>
    <p class="code">
        my_annotation = new JSPlot_Label_Text(settings);
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
            <td class="code">axis_x</td>
            <td>
                Any valid <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
            </td>
            <td>
                The horizontal axis along which the position of this text label is specified.
            </td>
        </tr>
        <tr>
            <td class="code">axis_y</td>
            <td>
                Any valid <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
            </td>
            <td>
                The vertical axis along which the position of this text label is specified.
            </td>
        </tr>
        <tr>
            <td class="code">axis_z</td>
            <td>
                Any valid <a href="documentation07.php#JSPlot_Axis"><span class="code">JSPlot_Axis</span></a> instance
            </td>
            <td>
                The Z-axis along which the position of this text label is specified (3D plots only).
            </td>
        </tr>
        <tr>
            <td class="code">color</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color of this text label.
            </td>
        </tr>
        <tr>
            <td class="code">fontFamily</td>
            <td>
                String
            </td>
            <td>
                The font family to use for this text label.
                Default: <span class="code">Arial,Helvetica,sans-serif</span>
            </td>
        </tr>
        <tr>
            <td class="code">fontSize</td>
            <td>
                Number
            </td>
            <td>
                A scaling factor to apply to the font size of this text label. Default: 13
            </td>
        </tr>
        <tr>
            <td class="code">fontStyle</td>
            <td>
                String
            </td>
            <td>
                The font style to use for this text label: either a blank string, or <span class="code">italic</span>
                Default: None.
            </td>
        </tr>
        <tr>
            <td class="code">fontWeight</td>
            <td>
                String
            </td>
            <td>
                The font weight to use for this text label: either a blank string, or <span class="code">bold</span>
                Default: None.
            </td>
        </tr>
        <tr>
            <td class="code">h_align</td>
            <td>
                String
            </td>
            <td>
                The horizontal alignment of this label, relative to the specified position.
                Options: <span class="code">left</span>, <span class="code">center</span>, <span class="code">right</span>.
                Default: <span class="code">center</span>.
            </td>
        </tr>
        <tr>
            <td class="code">position</td>
            <td>[Number, Number]</td>
            <td>
                The coordinates of the position of the label, measured against the selected axes. Two coordinates should
                be supplied on 2D graphs, and three coordinates on 3D graphs.
            </td>
        </tr>
        <tr>
            <td class="code">text</td>
            <td>
                String
            </td>
            <td>
                The text string to display.
            </td>
        </tr>
        <tr>
            <td class="code">v_align</td>
            <td>
                String
            </td>
            <td>
                The vertical alignment of this label, relative to the specified position.
                Options: <span class="code">top</span>, <span class="code">center</span>, <span class="code">bottom</span>.
                Default: <span class="code">center</span>.
            </td>
        </tr>
        <tr>
            <td class="code">z_index</td>
            <td>Number</td>
            <td>
                The stack order of the items to be superimposed over this graph. An element with greater stack order
                is always in front of an element with a lower stack order.
            </td>
        </tr>
        </tbody>
    </table>

<?php
$pageTemplate->footer($pageInfo);
