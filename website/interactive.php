<?php

// interactive.php

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
require_once "php/html_getargs.php";

$cssextra = <<<__HTML__
.settings-block        { margin: 15px 0; border: 1px solid #ccc; border-radius: 4px; padding: 10px; background-color: #eee; }
select                 { max-width: 300px; }
.dcf-ui-setting        { display: block; }
.dcf-ui-label          { min-width: 300px; }
.dcf-ui-nested-setting { display: inline-block; margin: 0 15px; }
__HTML__;

$pageInfo = [
    "pageTitle" => "Interactive graph plotter",
    "pageDescription" => "JSPlot - Interactive graph plotter",
    "fluid" => true,
    "activeTab" => "interactive",
    "teaserImg" => null,
    "cssextra" => $cssextra,
    "includes" => [],
    "linkRSS" => null,
    "options" => []
];

$options_data_type = ["numeric", "timestamp"];
$options_boolean = [[0, "No"], [1, "Yes"]];

$pageTemplate->header($pageInfo);

?>

    <div id="demo_graph">
        <div id="graph_holder"></div>
    </div>

    <h2>Graph configuration</h2>

    <div id="editor-tabs">
        <ul>
            <li><a href="#tabs-graph">Graph settings</a></li>
            <li><a href="#tabs-axes">Axis settings</a></li>
            <li><a href="#tabs-data">Graph data</a></li>
            <li><a href="#tabs-io">Load/save settings</a></li>
        </ul>
        <div id="tabs-graph">
            <h5>Graph settings</h5>
            <div id="graph_settings" class="settings-block"></div>
        </div>
        <div id="tabs-axes">
            <h5>Bottom axis (x1)</h5>
            <div id="axis_x1" class="settings-block"></div>
            <h5>Left axis (y1)</h5>
            <div id="axis_y1" class="settings-block"></div>
            <h5>Top axis (x2)</h5>
            <div id="axis_x2" class="settings-block"></div>
            <h5>Right axis (y2)</h5>
            <div id="axis_y2" class="settings-block"></div>
        </div>
        <div id="tabs-data">
            <h5>Graph data</h5>
            <div id="graph_data"></div>
        </div>
        <div id="tabs-io">
            <h5>Load/save graph</h5>
            <div id="settings_io" class="settings-block">
                <form action="javascript:void(0);">
                    <button class="btn btn-success btn-load-settings" value="Load settings...">Load settings...</button>
                    <div style="display:none;">
                        <input type="file" class="load_file"/>
                    </div>
                    <br/>
                    <button class="btn btn-success btn-save-settings" value="Save settings...">Save settings...</button>
                </form>
            </div>
        </div>
    </div>

    <div id="templates" style="display: none;">
        <div id="template_graph_settings"></div>
        <div id="template_axis_settings">
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Enabled:</span>
                <?php
                html_getargs::makeFormSelect("axis_enabled", 1, $options_boolean, 0);
                ?>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Log axis:</span>
                <?php
                html_getargs::makeFormSelect("axis_log", 0, $options_boolean, 0);
                ?>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Data type:</span>
                <?php
                html_getargs::makeFormSelect("axis_dataType", "numeric", $options_data_type, 0);
                ?>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Label:</span>
                <input type="text" class="axis_label" name="axis_label" value=""/>
            </label>
            <div class="dcf-ui-setting">
                <span class="dcf-ui-label">Minimum:</span>
                <label class="dcf-ui-nested-setting">
                    <input type="checkbox" class="axis_min_auto" name="axis_min_auto" checked="checked"/> Auto
                </label>
                <label class="dcf-ui-nested-setting axis_min_value_holder">
                    <span class="dcf-ui-label">Value:</span>
                    <input type="number" class="axis_min_value" name="axis_min_value" value=""/>
                </label>
            </div>
            <div class="dcf-ui-setting">
                <span class="dcf-ui-label">Maximum:</span>
                <label class="dcf-ui-nested-setting">
                    <input type="checkbox" class="axis_max_auto" name="axis_max_auto" checked="checked"/> Auto
                </label>
                <label class="dcf-ui-nested-setting axis_max_value_holder">
                    <span class="dcf-ui-label">Value:</span>
                    <input type="number" class="axis_max_value" name="axis_max_value" value=""/>
                </label>
            </div>
            <label class="dcf-ui-setting" style="display: none;">
                <span class="dcf-ui-label">Range reversed:</span>
                <?php
                html_getargs::makeFormSelect("axis_range_reversed", 0, $options_boolean, 0);
                ?>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Visible:</span>
                <?php
                html_getargs::makeFormSelect("axis_visible", 1, $options_boolean, 0);
                ?>
            </label>
        </div>
        <div id="template_dataset_settings"></div>
    </div>

    <!-- Javascript code -->
    <script type="text/javascript">
        // Enable UI tabs
        $(function () {
            $("#editor-tabs").tabs();
        });

        // Set up plot
        $(function () {

            // Create graph object
            /** @type JSPlot_Graph */
            var graph = new JSPlot_Graph([], {
                'key': true,
                'keyPosition': 'tl',
                'x1_axis': {
                    'scrollMin': null,
                    'scrollMax': null,
                    'scrollEnabled': true,
                    'zoomEnabled': true
                }
            });

            // Create canvas to put graph onto
            /** @type JSPlot_Canvas */
            var canvas = new JSPlot_Canvas({
                "graph_1": graph
            }, {});

            // Function to display graph
            function update_display() {
                canvas.renderToCanvas(
                    $("#graph_holder")[0]
                );
            }

            // Populate UI
            $("#template_axis_settings").clone().appendTo("#axis_x1");
            $("#template_axis_settings").clone().appendTo("#axis_y1");
            $("#template_axis_settings").clone().appendTo("#axis_x2");
            $("#template_axis_settings").clone().appendTo("#axis_y2");

            $("#template_graph_settings").clone().appendTo("#graph_settings");

            // Function to extract axis settings from HTML elements
            /**
             * axis_settings_extract - Extract axis settings from HTML elements
             * @param element {Object} - jQuery element we are to read data from
             */
            function axis_settings_extract(element) {
                // Read settings out of HTML form
                return {
                    "enabled": $(".axis_enabled", element).val() === "1",
                    "log": $(".axis_log", element).val() === "1",
                    "dataType": $(".axis_dataType", element).val(),
                    "label": $(".axis_label", element).val(),
                    "min": $(".axis_min_auto", element).is(":checked") ? null : $(".axis_min_value", element).val(),
                    "max": $(".axis_max_auto", element).is(":checked") ? null : $(".axis_max_value", element).val(),
                    "rangeReversed": $(".axis_range_reversed", element).val() === "1",
                    "visible": $(".axis_visible", element).val() === "1"
                };
            }

            // Function to propagate axis settings to graph
            /**
             * axis_settings_commit - Update JSPlot_Axis object to reflect contents of HTML elements
             * @param element {Object} - jQuery element we are to read data from
             * @param target {JSPlot_Axis} - Target axis to update
             */
            function axis_settings_commit(element, target) {
                // Read settings out of HTML form and pass into JSPlot_Axis object
                var axis_settings = axis_settings_extract(element);
                target.configure(axis_settings);

                // Automatically show/hide axis minimum value setting, depending whether it is set to autoscale
                if (axis_settings["min"] === null) {
                    $(".axis_min_value_holder", element).hide();
                } else {
                    $(".axis_min_value_holder", element).show();
                }

                // Automatically show/hide axis maximum value setting, depending whether it is set to autoscale
                if (axis_settings["max"] === null) {
                    $(".axis_max_value_holder", element).hide();
                } else {
                    $(".axis_max_value_holder", element).show();
                }
            }

            // Function to propagate axis settings from JSPlot_Axis object to HTML
            /**
             * axis_settings_import_from_target - Update HTML elements to reflect contents of a JSON object
             * @param element {Object} - jQuery element we are to read data from
             * @param json_input {Object} - JSON structure we are to fetch settings from
             * @param target {JSPlot_Axis} - Target axis to update
             */
            function axis_settings_import_from_json(element, json_input, target) {
                $(".axis_enabled", element).val(json_input.enabled ? "1" : "0");
                $(".axis_log", element).val(json_input.log ? "1" : "0");
                $(".axis_dataType", element).val(json_input.dataType);
                $(".axis_label", element).val(json_input.label);
                $(".axis_min_auto", element).prop('checked', json_input.min === null);
                $(".axis_min_value", element).val(json_input.min);
                $(".axis_max_auto", element).prop('checked', json_input.max === null);
                $(".axis_max_value", element).val(json_input.max);
                $(".axis_range_reversed", element).val(json_input.rangeReversed ? "1" : "0");
                $(".axis_visible", element).val(json_input.visible ? "1" : "0");

                axis_settings_commit(element, target);
            }

            // Function to save all settings to a JSON file
            function save_settings() {
                var output = {
                    'jsplot': 1,
                    'graph': null,
                    'data': null,
                    'axis_x1': axis_settings_extract($("#axis_x1")),
                    'axis_x2': axis_settings_extract($("#axis_x2")),
                    'axis_y1': axis_settings_extract($("#axis_y1")),
                    'axis_y2': axis_settings_extract($("#axis_y2"))
                };

                var json = JSON.stringify(output);
                var blob = new Blob([json], {type: "application/json"});
                saveBlob("plot_data.json", blob);
            }

            // Function to load all settings from a JSON file
            function load_settings() {
                var file_el = $(".load_file")[0];

                // Check that the file input has a file upload to offer
                if ((!file_el.files) || (!file_el.files[0])) {
                    alert("Could not open file");
                    return;
                }

                // Read the contents of the uploaded file. A callback is triggered once it has been read
                var reader = new FileReader();
                reader.onload = function () {
                    var obj;

                    // Convert JSON into an object, throwing an error is the file is not valid JSON
                    try {
                        obj = JSON.parse(reader.result);
                    } catch (e) {
                        alert("This file is not in the correct format, and cannot be loaded");
                        return;
                    }

                    // Validate that the uploaded file is in the correct format.
                    if ((typeof (obj) !== 'object') || (!obj.hasOwnProperty('jsplot'))) {
                        alert("This file is not in the correct format, and cannot be loaded");
                        return;
                    }

                    // Import settings from JSON
                    axis_settings_import_from_json($("#axis_x1"), obj.axis_x1, graph.axes["x1"]);
                    axis_settings_import_from_json($("#axis_x2"), obj.axis_x2, graph.axes["x2"]);
                    axis_settings_import_from_json($("#axis_y1"), obj.axis_y1, graph.axes["y1"]);
                    axis_settings_import_from_json($("#axis_y2"), obj.axis_y2, graph.axes["y2"]);

                    // Update graph display
                    update_display();
                };

                // Trigger reading of JSON
                reader.readAsText($(".load_file")[0].files[0]);
            }

            // Wire up axis controls
            $.each(["x1", "x2", "y1", "y2"], function (index, axis_name) {
                var settings_block = $("#axis_" + axis_name);

                $("input, select", settings_block).change(function () {
                    axis_settings_commit(settings_block, graph.axes[axis_name]);
                    update_display();
                })
            });

            // Wire up load/save buttons
            $(".btn-save-settings").click(save_settings);

            $(".btn-load-settings").click(function () {
                $(".load_file").trigger("click");
            });

            $(".load_file").change(load_settings);

            // Render initial plot
            update_display();
        });
    </script>
<?php
$pageTemplate->footer($pageInfo);
