<?php

// demos.php

// -------------------------------------------------
// Copyright 2020 Dominic Ford.

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
    "pageTitle" => "JSPlot Examples",
    "pageDescription" => "JSPlot - Examples",
    "activeTab" => "about",
    "teaserImg" => null,
    "cssextra" => null,
    "includes" => [],
    "linkRSS" => null,
    "options" => []
];

$pageTemplate->header($pageInfo);

?>

    <table class="padded-table stripy">
        <thead>
        <tr>
            <td>
                Demo name
            </td>
            <td>
                Description
            </td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>
                <a href="demo_helix.php">Helix demo</a>
            </td>
            <td>
                A 3D chart showing a double helix
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_linespoints.php">Lines-points plot style demo</a>
            </td>
            <td>
                A chart with the linespoints plot style
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_linked_axes.php">Linked axes demo</a>
            </td>
            <td>
                A panel of charts with linked x axes
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_log_axis.php">Log axis demo</a>
            </td>
            <td>
                A graph of 10<sup>x</sup> on a log axis
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_logo.php">Logo demo</a>
            </td>
            <td>
                The script which produces the JSPlot logo
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_sin_x.php">sin(x) demo</a>
            </td>
            <td>
                A chart of sin(x)
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_timeline.php">Timeline demo</a>
            </td>
            <td>
                An example of an axis with units of time
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_timeline_autoscale.php">Timeline autoscaling demo</a>
            </td>
            <td>
                An example of an autoscaling axis with units of time
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_vector_graphics.php">Vector graphics demo</a>
            </td>
            <td>
                A demo of JSPlot's vector graphics features
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_x2.php">x<sup>2</sup> demo</a>
            </td>
            <td>
                A chart of x<sup>2</sup>
            </td>
        </tr>
        </tbody>
    </table>

<?php
$pageTemplate->footer($pageInfo);
