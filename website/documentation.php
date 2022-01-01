<?php

// documentation.php

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
    "pageTitle" => "JSPlot Documentation: The plotting canvas",
    "pageDescription" => "JSPlot - Documentation: The plotting canvas",
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
        <li><b>The plotting canvas</b></li>
        <li><a href="documentation02.php">Plotting data</a></li>
        <li><a href="documentation03.php">Plotting functions</a></li>
        <li><a href="documentation04.php">Vector graphics</a></li>
        <li><a href="documentation05.php">Graph plotting styles</a></li>
        <li><a href="documentation06.php">Graph options</a></li>
        <li><a href="documentation07.php">Graph axis options</a></li>
        <li><a href="documentation08.php">Vector graphics objects</a></li>
    </ol>

    <hr/>

    <p>Documentation lives here.</p>

    <h5 id="JSPlot_Canvas"><span class="code">JSPlot_Canvas</span> class: API reference</h5>

    <p>
        Instances of the <span class="code">JSPlot_Canvas</span> class are used to create a new drawing canvas onto
        which to add charts and other vector graphics objects. Once a new canvas has been populated, call the
        <span class="code">renderToCanvas</span> method to render its contents onto an HTML5
        <span class="code">&lt;canvas&gt;</span> element. Alternatively, the <span class="code">renderToPNG</span>
        and <span class="code">renderToSVG</span> methods render the canvas to PNG and SVG files respectively.
    </p>

    <p class="code">
        my_canvas = new JSPlot_Canvas(list_of_objects, settings);
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
            <td class="code">list_of_objects</td>
            <td>
                Associative array
            </td>
            <td>
                <p>
                    An associative array of items to put on the canvas. These should be instances of the
                    <a href="documentation06.php#JSPlot_Graph"><span class="code">JSPlot_Graph</span></a>,
                    <a href="documentation08.php#JSPlot_Arrow"><span class="code">JSPlot_Arrow</span></a>,
                    <a href="documentation08.php#JSPlot_Circle"><span class="code">JSPlot_Circle</span></a>,
                    <a href="documentation08.php#JSPlot_Ellipse"><span class="code">JSPlot_Ellipse</span></a>,
                    <a href="documentation08.php#JSPlot_Rectangle"><span class="code">JSPlot_Rectangle</span></a> or
                    <a href="documentation08.php#JSPlot_Text"><span class="code">JSPlot_Text</span></a> classes.
                </p>
                <p>
                    The key associated with each member of the associated array may subsequently be used to remove
                    that item from the canvas, using the <span class="code">JSPlot_Canvas</span> instance's
                    <span class="code">removeItem</span> method. Additional items can be added to the canvas
                    using the <span class="code">addItem</span> method.
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
            <td class="code">allow_export_png</td>
            <td>
                boolean
            </td>
            <td>
                Choose whether a button should appear beneath the plot, inviting the user to download a PNG copy of the
                canvas.
            </td>
        </tr>
        <tr>
            <td class="code">allow_export_svg</td>
            <td>
                boolean
            </td>
            <td>
                Choose whether a button should appear beneath the plot, inviting the user to download a SVG copy of the
                canvas.
            </td>
        </tr>
        <tr>
            <td class="code">allow_export_csv</td>
            <td>
                boolean
            </td>
            <td>
                Choose whether a button should appear beneath the plot, inviting the user to download a copy of the data
                plotted on the first graph on the canvas, in CSV format.
            </td>
        </tr>
        </tbody>
    </table>

    <p>
        Once instantiated, a <span class="code">JSPlot_Canvas</span> instance offers the following methods:
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
            <td class="code">configure</td>
            <td>
                <span class="code">settings</span> (associative array)
            </td>
            <td>
                Update the settings for this canvas. <span class="code">settings</span> should be an associative
                array, with the same keys as listed above.
            </td>
        </tr>
        <tr>
            <td class="code">renderToCanvas</td>
            <td>
                <span class="code">target_element</span> (HTML element)
            </td>
            <td>
                Render the drawing canvas onto an HTML5 drawing canvas. The drawing canvas is resized to accommodate
                the objects on the JSPlot canvas.
            </td>
        </tr>
        <tr>
            <td class="code">addItem</td>
            <td>
                <span class="code">name</span> (string)
                <br/>
                <span class="code">item</span> (canvas object)
            </td>
            <td>
                <p>
                    Add an object to the drawing canvas. The <span class="code">name</span> should be a unique string
                    which can be used to subsequently remove the item by calling the
                    <span class="code">removeItem</span> method on the <span class="code">JSPlot_Canvas</span>
                    instance.
                </p>
                <p>
                    The <span class="code">item</span> argument should be an instance of the
                    <a href="documentation06.php#JSPlot_Graph"><span class="code">JSPlot_Graph</span></a>,
                    <a href="documentation08.php#JSPlot_Arrow"><span class="code">JSPlot_Arrow</span></a>,
                    <a href="documentation08.php#JSPlot_Circle"><span class="code">JSPlot_Circle</span></a>,
                    <a href="documentation08.php#JSPlot_Ellipse"><span class="code">JSPlot_Ellipse</span></a>,
                    <a href="documentation08.php#JSPlot_Rectangle"><span class="code">JSPlot_Rectangle</span></a> or
                    <a href="documentation08.php#JSPlot_Text"><span class="code">JSPlot_Text</span></a> classes.
                </p>
            </td>
        </tr>
        <tr>
            <td class="code">removeItem</td>
            <td>
                <span class="code">name</span> (string)
            </td>
            <td>
                Remove a named object from the drawing canvas.
            </td>
        </tr>
        <tr>
            <td class="code">renderToPNG</td>
            <td>
                <span class="code">page_width</span> (number)
            </td>
            <td>
                Render the contents of the canvas to a PNG file, and redirect the web browser to show the contents
                of that PNG file. If specified, the argument <span class="code">page_width</span> should indicate
                the width of the PNG file in pixels.
            </td>
        </tr>
        <tr>
            <td class="code">renderToSVG</td>
            <td>
                <span class="code">page_width</span> (number)
            </td>
            <td>
                Render the contents of the canvas to a SVG file, and return the contents of the SVG file as a string.
                If specified, the argument <span class="code">page_width</span> should indicate
                the width of the SVG file in pixels.
            </td>
        </tr>
        <tr>
            <td class="code">renderToCSV</td>
            <td>
                None
            </td>
            <td>
                Render the data shown on the first graph on the canvas into CSV, and return the contents of that CSV
                file as a string.
            </td>
        </tr>
        </tbody>
    </table>


    </p>

<?php
$pageTemplate->footer($pageInfo);
