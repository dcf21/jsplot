<?php

// documentation03.php

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
    "pageTitle" => "JSPlot Documentation: Plotting functions",
    "pageDescription" => "JSPlot - Documentation: Plotting functions",
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
        <li><b>Plotting functions</b></li>
        <li><a href="documentation04.php">Vector graphics</a></li>
        <li><a href="documentation05.php">Graph plotting styles</a></li>
        <li><a href="documentation06.php">Graph options</a></li>
        <li><a href="documentation07.php">Graph axis options</a></li>
        <li><a href="documentation08.php">Vector graphics objects</a></li>
    </ol>

    <hr/>

    <p>Documentation lives here.</p>

    <h5 id="JSPlot_Graph"><span class="code">JSPlot_FunctionEvaluator</span> class: API reference</h5>

    <p>
        Instances of the <span class="code">JSPlot_FunctionEvaluator</span> class are used to automatically generate
        datasets (instances of the
        <a href="documentation06.php#JSPlot_DataSet"><span class="code">JSPlot_DataSet</span></a> class)
        by evaluating Javascript functions.
    </p>

    <p class="code">
        my_function = new JSPlot_FunctionEvaluator(title, styling, functions);
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
                <a href="documentation06.php#styling_options">listed here</a>.
            </td>
        </tr>
        <tr>
            <td class="code">functions</td>
            <td>
                Array
            </td>
            <td>
                <p>
                    An array of Javascript functions which should be evaluated to produce each column of the data set.
                </p>
            </td>
        </tr>
        </tbody>
    </table>

    <p>
        Once instantiated, the following methods of the
        <span class="code">JSPlot_FunctionEvaluator</span> class can be used to generate
        <a href="documentation06.php#JSPlot_DataSet"><span class="code">JSPlot_DataSet</span></a> instances:
    </p>

    <table class="bordered stripy api_ref">
        <thead>
        <tr>
            <td>Method</td>
            <td>Arguments</td>
            <td>Description</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="code">evaluate_linear_raster</td>
            <td>
                <span class="code">x_min</span> &ndash; number<br />
                <span class="code">x_max</span> &ndash; number<br />
                <span class="code">point_count</span> &ndash; number<br />
                <span class="code">auto_update</span> &ndash; boolean
            </td>
            <td>
                Evaluate the functions at <span class="code">point_count</span> linearly-spaced points
                between <span class="code">x_min</span> and <span class="code">x_max</span>.
            </td>
        </tr>
        <tr>
            <td class="code">evaluate_log_raster</td>
            <td>
                <span class="code">x_min</span> &ndash; number<br />
                <span class="code">x_max</span> &ndash; number<br />
                <span class="code">point_count</span> &ndash; number<br />
                <span class="code">auto_update</span> &ndash; boolean
            </td>
            <td>
                Evaluate the functions at <span class="code">point_count</span> log-spaced points
                between <span class="code">x_min</span> and <span class="code">x_max</span>.
            </td>
        </tr>
        <tr>
            <td class="code">evaluate_over_grid</td>
            <td>
                <span class="code">x_min</span> &ndash; number<br />
                <span class="code">x_max</span> &ndash; number<br />
                <span class="code">point_count_x</span> &ndash; number<br />
                <span class="code">y_min</span> &ndash; number<br />
                <span class="code">y_max</span> &ndash; number<br />
                <span class="code">point_count_y</span> &ndash; number
            </td>
            <td>
                Evaluate the functions over a grid of linearly-spaced points along the x- and y-axes.
            </td>
        </tr>
        </tbody>
    </table>

<?php
$pageTemplate->footer($pageInfo);
