<?php

// demos.php

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
                <a href="demo_annotations.php">Annotated graph demo</a>
            </td>
            <td>
                A chart with labels
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_axes_dual.php">Multiple axes demo</a>
            </td>
            <td>
                A demo with two different vertical axes on the same graph
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_axes_inverted.php">Inverted axes demo</a>
            </td>
            <td>
                A demo with a bar chart plotted along the vertical axis
            </td>
        </tr>
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
                <a href="demo_styles_arrows.php">Plot styles: Arrows demo</a>
            </td>
            <td>
                A chart with the <span class="code">arrows</span> plot styles
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_barchart.php">Plot styles: Bar charts demo</a>
            </td>
            <td>
                A chart with the <span class="code">boxes</span> plot styles
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_barchart_dynamic.php">Plot styles: Bar charts demo (dynamic box widths)</a>
            </td>
            <td>
                A chart with the <span class="code">boxes</span> plot style and the <span class="code">boxWidth</span> setting
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_barchart_fixed.php">Plot styles: Bar charts demo (fixed width)</a>
            </td>
            <td>
                A chart with the <span class="code">wboxes</span> plot styles
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_dots.php">Plot styles: Dots demo</a>
            </td>
            <td>
                A chart with the <span class="code">dots</span> plot style
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_error_bars_2d.php">Plot styles: 2D error bars demo</a>
            </td>
            <td>
                A chart with the <span class="code">errorbars</span> plot styles
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_error_bars_3d.php">Plot styles: 3D error bars demo</a>
            </td>
            <td>
                A chart with the <span class="code">errorbars</span> plot styles
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_impulses.php">Plot styles: Impulses demo</a>
            </td>
            <td>
                A chart with the <span class="code">impulses</span> plot style
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_limits.php">Plot styles: Limits demo</a>
            </td>
            <td>
                A chart with the <span class="code">lowerlimits</span> and <span class="code">upperlimits</span> plot
                styles
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_linespoints.php">Plot styles: Lines-points demo</a>
            </td>
            <td>
                A chart with the <span class="code">linespoints</span> plot style
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_steps.php">Plot styles: Steps demo</a>
            </td>
            <td>
                A chart with the <span class="code">steps</span> plot styles
            </td>
        </tr>
        <tr>
            <td>
                <a href="demo_styles_surface.php">Plot styles: Surface demo</a>
            </td>
            <td>
                A chart with the <span class="code">surface</span> plot style
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
