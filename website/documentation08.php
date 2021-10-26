<?php

// documentation08.php

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
    "pageTitle" => "JSPlot Documentation: Vector graphics objects",
    "pageDescription" => "JSPlot - Documentation: Vector graphics objects",
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
        <li><a href="documentation07.php">Graph axis options</a></li>
        <li><b>Vector graphics objects</b></li>
    </ol>

    <hr/>

    <p>Documentation lives here.</p>

    <h5 id="JSPlot_Arrow"><span class="code">JSPlot_Arrow</span> class</h5>

    <p>
        Instances of the <span class="code">JSPlot_Arrow</span> class can be used to add arrows and lines to the
        drawing canvas.
    </p>
    <p class="code">
        my_pointer = new JSPlot_Arrow(settings);
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
        Allowed configuration parameters are as follows:
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
            <td class="code">arrowType</td>
            <td>
                string
            </td>
            <td>
                Allowed values:
                <br />
                <span class="code">single</span> &ndash; A single-headed arrow
                <br />
                <span class="code">double</span> &ndash; A double-headed bi-directional arrow
                <br />
                <span class="code">back</span> &ndash; A single-headed arrow pointing backwards
                <br />
                <span class="code">none</span> &ndash; A line with no arrow head
            </td>
        </tr>
        <tr>
            <td class="code">color</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color of the arrow or line
            </td>
        </tr>
        <tr>
            <td class="code">strokeLineWidth</td>
            <td>Number</td>
            <td>The width of the line (pixels)</td>
        </tr>
        <tr>
            <td class="code">origin</td>
            <td>[Number, Number]</td>
            <td>The pixel coordinates of the start of the arrow</td>
        </tr>
        <tr>
            <td class="code">target</td>
            <td>[Number, Number]</td>
            <td>The pixel coordinates of the end of the arrow</td>
        </tr>
        <tr>
            <td class="code">z_index</td>
            <td>Number</td>
            <td>
                The stack order of the element on the canvas. An element with greater stack order is always in front of
                an element with a lower stack order.
            </td>
        </tr>
        </tbody>
    </table>

    <h5 id="JSPlot_Circle"><span class="code">JSPlot_Circle</span> class</h5>

    <p>
        Instances of the <span class="code">JSPlot_Circle</span> class can be used to add circles to the drawing canvas.
    </p>
    <p class="code">
        my_circle = new JSPlot_Circle(settings);
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
        Allowed configuration parameters are as follows:
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
            <td class="code">strokeColor</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color to stroke the outline of the circle
            </td>
        </tr>
        <tr>
            <td class="code">fillColor</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color to fill the interior of the circle
            </td>
        </tr>
        <tr>
            <td class="code">strokeLineWidth</td>
            <td>Number</td>
            <td>The width of the line (pixels) to stroke around the outline of the circle</td>
        </tr>
        <tr>
            <td class="code">origin</td>
            <td>[Number, Number]</td>
            <td>The pixel coordinates of the center of the circle</td>
        </tr>
        <tr>
            <td class="code">radius</td>
            <td>Number</td>
            <td>The radius of the circle, in pixels</td>
        </tr>
        <tr>
            <td class="code">z_index</td>
            <td>Number</td>
            <td>
                The stack order of the element on the canvas. An element with greater stack order is always in front of
                an element with a lower stack order.
            </td>
        </tr>
        </tbody>
    </table>

    <h5 id="JSPlot_Rectangle"><span class="code">JSPlot_Rectangle</span> class</h5>

    <p>
        Instances of the <span class="code">JSPlot_Rectangle</span> class can be used to add rectangle to the
        drawing canvas.
    </p>
    <p class="code">
        my_box = new JSPlot_Rectangle(settings);
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
        Allowed configuration parameters are as follows:
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
            <td class="code">strokeColor</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color to stroke the outline of the rectangle
            </td>
        </tr>
        <tr>
            <td class="code">fillColor</td>
            <td>
                Any valid <a href="documentation08.php#JSPlot_Color"><span class="code">JSPlot_Color</span></a> instance
            </td>
            <td>
                The color to fill the interior of the rectangle
            </td>
        </tr>
        <tr>
            <td class="code">strokeLineWidth</td>
            <td>Number</td>
            <td>The width of the line (pixels) to stroke around the outline of the rectangle</td>
        </tr>
        <tr>
            <td class="code">origin</td>
            <td>[Number, Number]</td>
            <td>The pixel coordinates of the top-left corner of the rectangle</td>
        </tr>
        <tr>
            <td class="code">height</td>
            <td>Number</td>
            <td>The height of the rectangle, in pixels. Negative values are allowed.</td>
        </tr>
        <tr>
            <td class="code">width</td>
            <td>Number</td>
            <td>The width of the rectangle, in pixels. Negative values are allowed.</td>
        </tr>
        <tr>
            <td class="code">z_index</td>
            <td>Number</td>
            <td>
                The stack order of the element on the canvas. An element with greater stack order is always in front of
                an element with a lower stack order.
            </td>
        </tr>
        </tbody>
    </table>

    <h5 id="JSPlot_Color"><span class="code">JSPlot_Color</span> class</h5>

    <p>
        Instances of the <span class="code">JSPlot_Color</span> class are used to specify the colors to be used in
        plots and vector graphics. The constructor takes four parameters to specify the color and opacity (alpha),
        each of which should be between 0 and 1 inclusive:
    </p>
    <p class="code">
        my_color = new JSPlot_Color(red, green, blue, alpha);
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
            <td class="code">red</td>
            <td>
                Number (0&ndash;1)
            </td>
            <td>
                Red channel component
            </td>
        </tr>
        <tr>
            <td class="code">green</td>
            <td>
                Number (0&ndash;1)
            </td>
            <td>
                Green channel component
            </td>
        </tr>
        <tr>
            <td class="code">blue</td>
            <td>
                Number (0&ndash;1)
            </td>
            <td>
                Blue channel component
            </td>
        </tr>
        <tr>
            <td class="code">alpha</td>
            <td>
                Number (0&ndash;1)
            </td>
            <td>
                Alpha channel, from 0 (transparent) to 1 (fully opaque)
            </td>
        </tr>
        </tbody>
    </table>
<?php
$pageTemplate->footer($pageInfo);
