<?php

// documentation05.php

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
    "pageTitle" => "JSPlot Documentation: Graph plotting styles",
    "pageDescription" => "JSPlot - Documentation: Graph plotting styles",
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
        <li><b>Graph plotting styles</b></li>
        <li><a href="documentation06.php">Graph options</a></li>
        <li><a href="documentation07.php">Graph axis options</a></li>
        <li><a href="documentation08.php">Vector graphics objects</a></li>
    </ol>

    <hr/>

    <p>
        The table below lists the plot styles available in JSPlot. They should be selected using the
        <a href="documentation06.php#plotStyle">plotStyle</a> setting passed to a
        <a href="documentation06.php#JSPlot_DataSet"><span class="code">JSPlot_DataSet</span></a> instance.
    </p>
    <p>
        The plot styles available in JSPlot loosely follows those available in
        <a href="http://pyxplot.org.uk/current/doc/html/sec-list_of_plotstyles.html">Pyxplot</a>.
        These, in turn, loosely follow those available in
        <a href="http://www.gnuplot.info/">gnuplot</a>.
    </p>

    <table class="bordered stripy api_ref">
        <thead>
        <tr>
            <td>Style name</td>
            <td>Description</td>
            <td>Required columns (2D)</td>
            <td>Required columns (3D)</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="code">points</td>
            <td>Data points</td>
            <td>(x, y)</td>
            <td>(x, y, z)</td>
        </tr>
        <tr>
            <td class="code">lines</td>
            <td>Straight lines joining points</td>
            <td>(x, y)</td>
            <td>(x, y, z)</td>
        </tr>
        <tr>
            <td class="code">linespoints</td>
            <td>Both points and lines styles together</td>
            <td>(x, y)</td>
            <td>(x, y, z)</td>
        </tr>
        <tr>
            <td class="code">xerrorbars</td>
            <td>Error bars along the x-axis</td>
            <td>(x, y, x_error_size)</td>
            <td>(x, y, z, x_error_size)</td>
        </tr>
        <tr>
            <td class="code">yerrorbars</td>
            <td>Error bars along the y-axis</td>
            <td>(x, y, y_error_size)</td>
            <td>(x, y, z, y_error_size)</td>
        </tr>
        <tr>
            <td class="code">zerrorbars</td>
            <td>Error bars along the z-axis</td>
            <td>&ndash;</td>
            <td>(x, y, z, z_error_size)</td>
        </tr>
        <tr>
            <td class="code">xyerrorbars</td>
            <td>Error bars along the x- and y-axes</td>
            <td>(x, y, x_error_size, y_error_size)</td>
            <td>(x, y, z, x_error_size, y_error_size)</td>
        </tr>
        <tr>
            <td class="code">yzerrorbars</td>
            <td>Error bars along the y- and z-axes</td>
            <td>&ndash;</td>
            <td>(x, y, z, y_error_size, z_error_size)</td>
        </tr>
        <tr>
            <td class="code">xzerrorbars</td>
            <td>Error bars along the x- and z-axes</td>
            <td>&ndash;</td>
            <td>(x, y, z, x_error_size, z_error_size)</td>
        </tr>
        <tr>
            <td class="code">xyzerrorbars</td>
            <td>Error bars along the x-, y- and z-axes</td>
            <td>&ndash;</td>
            <td>(x, y, z, x_error_size, y_error_size, z_error_size)</td>
        </tr>
        <tr>
            <td class="code">xerrorrange</td>
            <td>Error range along the x-axis</td>
            <td>(x, y, x_min, x_max)</td>
            <td>(x, y, z, x_min, x_max)</td>
        </tr>
        <tr>
            <td class="code">yerrorrange</td>
            <td>Error range along the y-axis</td>
            <td>(x, y, y_min, y_max)</td>
            <td>(x, y, z, y_min, y_max)</td>
        </tr>
        <tr>
            <td class="code">zerrorrange</td>
            <td>Error range along the z-axis</td>
            <td>&ndash;</td>
            <td>(x, y, z, z_min, z_max)</td>
        </tr>
        <tr>
            <td class="code">xyerrorrange</td>
            <td>Error range along the x- and y-axes</td>
            <td>(x, y, x_min, x_max, y_min, y_max)</td>
            <td>(x, y, z, x_min, x_max, y_min, y_max)</td>
        </tr>
        <tr>
            <td class="code">yzerrorrange</td>
            <td>Error range along the y- and z-axes</td>
            <td>&ndash;</td>
            <td>(x, y, z, y_min, y_max, z_min, z_max)</td>
        </tr>
        <tr>
            <td class="code">xzerrorrange</td>
            <td>Error range along the x- and z-axes</td>
            <td>&ndash;</td>
            <td>(x, y, z, x_min, x_max, z_min, z_max)</td>
        </tr>
        <tr>
            <td class="code">xyzerrorrange</td>
            <td>Error range along the x-, y- and z-axes</td>
            <td>&ndash;</td>
            <td>(x, y, z, x_min, x_max, y_min, y_max, z_min, z_max)</td>
        </tr>
        <tr>
            <td class="code">dots</td>
            <td>Tiny circles</td>
            <td>(x, y)</td>
            <td>(x, y, z)</td>
        </tr>
        <tr>
            <td class="code">impulses</td>
            <td>Lines from horizontal axis to each point</td>
            <td>(x, y)</td>
            <td>(x, y, z)</td>
        </tr>
        <tr>
            <td class="code">boxes</td>
            <td>A bar chart</td>
            <td>(x, y)</td>
            <td>(x, y)</td>
        </tr>
        <tr>
            <td class="code">wboxes</td>
            <td>A bar chart, with manually specified width for each bar</td>
            <td>(x, y, width)</td>
            <td>(x, y, width)</td>
        </tr>
        <tr>
            <td class="code">steps</td>
            <td>A line to be plotted as steps</td>
            <td>(x, y)</td>
            <td>(x, y)</td>
        </tr>
        <tr>
            <td class="code">fsteps</td>
            <td>A line to be plotted as steps</td>
            <td>(x, y)</td>
            <td>(x, y)</td>
        </tr>
        <tr>
            <td class="code">histeps</td>
            <td>A line to be plotted as steps</td>
            <td>(x, y)</td>
            <td>(x, y)</td>
        </tr>
        <tr>
            <td class="code">arrows_head</td>
            <td>Each datapoint drawn as an arrow</td>
            <td>(x0, y0, x1, y1)</td>
            <td>(x0, y0, z0, x1, y1, z1)</td>
        </tr>
        <tr>
            <td class="code">arrows_nohead</td>
            <td>Each datapoint drawn as a line</td>
            <td>(x0, y0, x1, y1)</td>
            <td>(x0, y0, z0, x1, y1, z1)</td>
        </tr>
        <tr>
            <td class="code">arrows_twohead</td>
            <td>Each datapoint drawn as a bidirectional arrow</td>
            <td>(x0, y0, x1, y1)</td>
            <td>(x0, y0, z0, x1, y1, z1)</td>
        </tr>
        <tr>
            <td class="code">surface</td>
            <td>A surface plot (3D graphs only); data must be sampled on a regular grid in X and Y.</td>
            <td>(x, y, z)</td>
            <td>(x, y, z)</td>
        </tr>
        </tbody>
    </table>

<?php
$pageTemplate->footer($pageInfo);
