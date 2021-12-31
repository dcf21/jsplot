<?php

// documentation07.php

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
    "pageTitle" => "JSPlot Documentation: Graph axis options",
    "pageDescription" => "JSPlot - Documentation: Graph axis options",
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
        <li><a href="documentation06.php">Graph options</a></li>
        <li><b>Graph axis options</b></li>
        <li><a href="documentation08.php">Vector graphics objects</a></li>
    </ol>

    <hr/>

    <p>Documentation lives here.</p>

    <h5 id="JSPlot_Axis"><span class="code">JSPlot_Axis</span> class: API reference</h5>

    <p>
        Instances of the <span class="code">JSPlot_Axis</span> class are used to configure the axes associated with
        a graph. You should never normally need to instantiate this class yourself, since axes are already
        instantiated by the
        <a href="documentation06.php#JSPlot_Graph"><span class="code">JSPlot_Graph</span></a> class.
        However, you can configure the <a href="#JSPlot_Axis_settings">settings</a>associated with each axis
        by passing the <a href="documentation06.php#config_x1_axis">appropriate settings</a> to the
        <a href="documentation06.php#JSPlot_Graph"><span class="code">JSPlot_Graph</span></a> instance.
    </p>

    <p class="code">
        my_axis = new JSPlot_Axis(graph, axis_name, enabled, settings);
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
            <td class="code">graph</td>
            <td>
                <a href="documentation06.php#JSPlot_Graph"><span class="code">JSPlot_Graph</span></a> instance
            </td>
            <td>
                <p>
                    The graph that this axis is to be associated with.
                </p>
            </td>
        </tr>
        <tr>
            <td class="code">axis_name</td>
            <td>
                String
            </td>
            <td>
                <p>
                    The name of this axis. Possibilities are
                    <span class="code">x1</span>, <span class="code">x2</span>,
                    <span class="code">y1</span>, <span class="code">y2</span>,
                    <span class="code">z1</span> or <span class="code">z2</span>.
                </p>
            </td>
        </tr>
        <tr>
            <td class="code">enabled</td>
            <td>
                Boolean
            </td>
            <td>
                <p>
                    Boolean flag indicating whether this axis is in use.
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

    <table class="bordered stripy api_ref" id="JSPlot_Axis_settings">
        <thead>
        <tr>
            <td>Field</td>
            <td>Allowed values</td>
            <td>Description</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="code">arrowType</td>
            <td>String</td>
            <td>
                String indicating the kinds of arrowhead to place on the axis. Options are:
                <span class="code">none</span> &ndash; No arrowhead (default),
                <span class="code">single</span> &ndash; An arrow on the upper end of the axis,
                <span class="code">double</span> &ndash; An arrow on both ends of the axis.
            </td>
        </tr>
        <tr>
            <td class="code">atZero</td>
            <td>Boolean</td>
            <td>
                Not implemented.
            </td>
        </tr>
        <tr>
            <td class="code">dataType</td>
            <td>String</td>
            <td>
                Indicates the type of data to be plotted along the axis &ndash; either
                <span class="code">numeric</span> or <span class="code">timestamp</span>.
                In the latter case, data should be supplied as (numeric) Unix timestamps, but will be rendered
                as dates and times.
            </td>
        </tr>
        <tr>
            <td class="code">enabled</td>
            <td>Boolean</td>
            <td>
                Boolean indicating whether this axis is in use.
            </td>
        </tr>
        <tr>
            <td class="code">label</td>
            <td>String</td>
            <td>
                The text label to write next to this axis.
            </td>
        </tr>
        <tr>
            <td class="code">labelRotate</td>
            <td>Number</td>
            <td>
                A rotation to apply to the label written next to this axis (degrees). Default: 0
            </td>
        </tr>
        <tr>
            <td class="code">linkTo</td>
            <td>Array of two strings</td>
            <td>
                This setting is used to allow two axes &ndash; usually on different graphs, but on the same plotting
                canvas &ndash; to vary in lock-step. This is useful, for example, if two graphs are showing different
                data side-by-side, but need to have the same vertical scale. The first string in the array should be the
                name of the graph in the array of items in the canvas, and the second should be the name of the axis
                to link to within that graph. For an example, <a href="demo_linked_axes.php">see here</a>.
            </td>
        </tr>
        <tr>
            <td class="code">log</td>
            <td>Boolean</td>
            <td>
                Boolean indicating whether this axis is logarithmically spaced. Default: <span class="code">false</span>
            </td>
        </tr>
        <tr>
            <td class="code">min</td>
            <td>Number</td>
            <td>
                The lower-limit for the range of this axis. If left <span class="code">null</span>, the axis will
                automatically scale to fit the supplied data.
            </td>
        </tr>
        <tr>
            <td class="code">max</td>
            <td>Number</td>
            <td>
                The upper-limit for the range of this axis. If left <span class="code">null</span>, the axis will
                automatically scale to fit the supplied data.
            </td>
        </tr>
        <tr>
            <td class="code">mirror</td>
            <td>Boolean</td>
            <td>
                Boolean indicating whether this axis should be duplicated on the opposite side of the graph.
            </td>
        </tr>
        <tr>
            <td class="code">rangeReversed</td>
            <td>Boolean</td>
            <td>
                Boolean indicating whether this axis should have be flipped relative to its usual orientation, with
                higher values on the left/bottom of the axis. Default: <span class="code">false</span>
            </td>
        </tr>
        <tr>
            <td class="code">scrollEnabled</td>
            <td>Boolean</td>
            <td>
                Boolean indicating whether this axis should scroll when the user clicks and drags the graph (providing
                that the
                <a href="documentation06.php#JSPlot_Graph_interactiveMode"><span class="code">interactiveMode</span></a>
                setting on the
                <a href="documentation06.php#JSPlot_Graph"><span class="code">JSPlot_Graph</span></a> instance
                is also set to <span class="code">pan</span>).
                Default: <span class="code">false</span>
            </td>
        </tr>
        <tr>
            <td class="code">scrollMin</td>
            <td>Number</td>
            <td>
                The lower-limit for the possible range of this axis, when being scrolled by the user. If left
                <span class="code">null</span>, the user will be able to scroll the axis indefinitely far to the left.
            </td>
        </tr>
        <tr>
            <td class="code">scrollMax</td>
            <td>Number</td>
            <td>
                The upper-limit for the possible range of this axis, when being scrolled by the user. If left
                <span class="code">null</span>, the user will be able to scroll the axis indefinitely far to the right.
            </td>
        </tr>
        <tr>
            <td class="code">scrollSpan</td>
            <td>Number</td>
            <td>
                The span of this axis, from left to right, when being panned by the user.
            </td>
        </tr>
        <tr>
            <td class="code">showLabels</td>
            <td>Boolean</td>
            <td>
                Boolean indicating whether this axis should have numerical labels placed along it.
                Default: <span class="code">true</span>
            </td>
        </tr>
        <tr>
            <td class="code">tickLabelRotation</td>
            <td>Number</td>
            <td>
                Specify an arbitrary rotation to apply to the tick labels written along this axis (degrees).
                Default: 0
            </td>
        </tr>
        <tr>
            <td class="code">ticksMinor</td>
            <td>Assocative array</td>
            <td>
                Configure the minor (small, unlabelled) tick markers placed along the axis. The allowed settings are
                <a href="#tick_settings">listed below</a>.
            </td>
        </tr>
        <tr>
            <td class="code">ticks</td>
            <td>Assocative array</td>
            <td>
                Configure the major (larger, labelled) tick markers placed along the axis. The allowed settings are
                <a href="#tick_settings">listed below</a>.
            </td>
        </tr>
        <tr>
            <td class="code">visible</td>
            <td>Boolean</td>
            <td>
                Boolean indicating whether this axis should be visible, or invisible.
                Default: <span class="code">true</span>
            </td>
        </tr>
        <tr>
            <td class="code">zoomEnabled</td>
            <td>Boolean</td>
            <td>
                Boolean indicating whether this axis should zoom when the user scrolls the scroll-wheel, or uses
                a pinch gesture on a touchscreen device.
                Default: <span class="code">true</span>
            </td>
        </tr>
        </tbody>
    </table>

    <h5 id="tick_settings"><span class="code">JSPlot_AxisTics</span> class</h5>

    <p>
        The following configuration parameters can be passed in an associative array to the
        <span class="code">ticks</span> and <span class="code">ticksMinor</span> settings of
        <a href="documentation06.php#JSPlot_Graph"><span class="code">JSPlot_Graph</span></a> instances:
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
            <td class="code">ticDir</td>
            <td>String</td>
            <td>
                Not implemented
            </td>
        </tr>
        <tr>
            <td class="code">tickList</td>
            <td>Array of [Number, String]</td>
            <td>
                An array of manually-placed ticks to render along this axis. Each tick is specified by an array
                containing the numerical position of the tick, followed by the label to place next to that tick.
                Set to <span class="code">null</span> (default) to enabled automatic tick placement.
            </td>
        </tr>
        <tr>
            <td class="code">tickMin</td>
            <td>Number</td>
            <td>
                The numerical value at which to place the leftmost tick along the axis.
                Set to <span class="code">null</span> (default) to enabled automatic tick placement.
            </td>
        </tr>
        <tr>
            <td class="code">tickMax</td>
            <td>Number</td>
            <td>
                The numerical value at which to place the rightmost tick along the axis.
                Set to <span class="code">null</span> (default) to enabled automatic tick placement.
            </td>
        </tr>
        <tr>
            <td class="code">tickStep</td>
            <td>Number</td>
            <td>
                The numerical spacing of the ticks along the axis. This should either be a linear spacing (linear axes)
                or a multiplicative spacing (logarithmic axes).
                Set to <span class="code">null</span> (default) to enabled automatic tick placement.
            </td>
        </tr>
        </tbody>
    </table>

<?php
$pageTemplate->footer($pageInfo);
