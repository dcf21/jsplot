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
$options_key_pos = [
    ["below", "Below plot"], ["above", "Above plot"], ["left", "Left side"], ["right", "Right side"],
    ["tl", "Top-left corner"], ["tm", "Top middle"], ["tr", "Top-right corner"],
    ["ml", "Middle left"], ["mm", "Plot center"], ["mr", "Middle right"],
    ["bl", "Bottom-left corner"], ["bm", "Bottom middle"], ["br", "Bottom-right corner"]
];

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
        <div id="template_graph_settings">
            <div class="dcf-ui-setting">
                <span class="dcf-ui-label">Width:</span>
                <label class="dcf-ui-nested-setting">
                    <input type="checkbox" class="width_auto" name="width_auto" checked="checked"/> Auto
                </label>
                <label class="dcf-ui-nested-setting width_value_holder">
                    <span class="dcf-ui-label">Pixels:</span>
                    <input type="number" class="width_value" name="width_value" value="400" min="200" max="4096"/>
                </label>
            </div>
            <div class="dcf-ui-setting">
                <span class="dcf-ui-label">Aspect ratio:</span>
                <label class="dcf-ui-nested-setting">
                    <input type="checkbox" class="aspect_auto" name="aspect_auto" checked="checked"/> Auto
                </label>
                <label class="dcf-ui-nested-setting aspect_value_holder">
                    <span class="dcf-ui-label">Value:</span>
                    <input type="number" class="aspect_value" name="aspect_value" value="0.61803399" min="0.01"
                           max="20"/>
                </label>
            </div>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Plot title:</span>
                <input type="text" class="plot_title" name="plot_title" value=""/>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Title offset:</span>
                <input type="number" class="title_offset_x" name="title_offset_x" value="0"/> x
                <input type="number" class="title_offset_y" name="title_offset_y" value="0"/>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">3D:</span>
                <?php
                html_getargs::makeFormSelect("three_dim", 0, $options_boolean, 0);
                ?>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Show key:</span>
                <?php
                html_getargs::makeFormSelect("show_key", 1, $options_boolean, 0);
                ?>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Key position:</span>
                <?php
                html_getargs::makeFormSelect("key_pos", "tr", $options_key_pos, 0);
                ?>
            </label>
            <div class="dcf-ui-setting">
                <span class="dcf-ui-label">Key columns:</span>
                <label class="dcf-ui-nested-setting">
                    <input type="checkbox" class="key_cols_auto" name="key_cols_auto" checked="checked"/> Auto
                </label>
                <label class="dcf-ui-nested-setting key_cols_value_holder">
                    <span class="dcf-ui-label">Value:</span>
                    <input type="number" class="key_cols_value" name="key_cols_value" value="1"/>
                </label>
            </div>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Key offset:</span>
                <input type="number" class="key_offset_x" name="key_offset_x" value="0"/> x
                <input type="number" class="key_offset_y" name="key_offset_y" value="0"/>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Show grid:</span>
                <?php
                html_getargs::makeFormSelect("show_grid", 1, $options_boolean, 0);
                ?>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Bar chart base:</span>
                <input type="number" class="box_from" name="box_from" value="0"/>
            </label>
            <div class="dcf-ui-setting">
                <span class="dcf-ui-label">Bar chart bar width:</span>
                <label class="dcf-ui-nested-setting">
                    <input type="checkbox" class="box_width_auto" name="box_width_auto" checked="checked"/> Auto
                </label>
                <label class="dcf-ui-nested-setting box_width_value_holder">
                    <span class="dcf-ui-label">Value:</span>
                    <input type="number" class="box_width_value" name="box_width_value" value="1"/>
                </label>
            </div>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Clip to axes:</span>
                <?php
                html_getargs::makeFormSelect("clip", 1, $options_boolean, 0);
                ?>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Font size:</span>
                <input type="number" class="box_from" name="font_size" value="1" min="0.1" max="10"/>
            </label>
            <h5>3D graph options</h5>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">View angle (XY):</span>
                <input type="number" class="view_angle_xy" name="view_angle_xy" value="60" min="-180" max="180"/>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">View angle (YZ):</span>
                <input type="number" class="view_angle_yz" name="view_angle_yz" value="30" min="-180" max="180"/>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Aspect ratio (Z):</span>
                <input type="number" class="aspect_z" name="aspect_z" value="1" min="0.01" max="20"/>
            </label>
            <h5>Color options</h5>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Axes color:</span>
                <input type="color" class="axes_color" name="axes_color" value="#000000"/>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Grid color (major):</span>
                <input type="color" class="grid_maj_color" name="grid_maj_color" value="#CCCCCC"/>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Grid color (minor):</span>
                <input type="color" class="grid_min_color" name="grid_min_color" value="#CCCCCC"/>
            </label>
            <label class="dcf-ui-setting">
                <span class="dcf-ui-label">Text color:</span>
                <input type="color" class="text_color" name="text_color" value="#000000"/>
            </label>
        </div>
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
            <label class="dcf-ui-setting">
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

            /**
             * html_setting_hide_when_auto - Show/hide html value setting, depending whether it is set to automatic value
             * @param settings {Object} - Associative array of current settings
             * @param element {Object} - jQuery element we are to read data from
             * @param setting_name {string} - Name of the setting we are controlling in <settings>
             * @param html_holder {string} - Class of the HTML element holding the <input> tag that we show/hide
             */
            function html_setting_hide_when_auto(settings, element, setting_name, html_holder) {
                // Automatically show/hide html value setting, depending whether it is set to automatic value
                if (settings[setting_name] === null) {
                    $(html_holder, element).hide();
                } else {
                    $(html_holder, element).show();
                }
            }

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

                // Automatically show/hide axis range settings, depending whether they are set to autoscale
                html_setting_hide_when_auto(axis_settings, element, "min", ".axis_min_value_holder");
                html_setting_hide_when_auto(axis_settings, element, "max", ".axis_max_value_holder");
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

            // Function to extract graph settings from HTML elements
            /**
             * graph_settings_extract - Extract graph settings from HTML elements
             * @param element {Object} - jQuery element we are to read data from
             */
            function graph_settings_extract(element) {
                // Read settings out of HTML form
                return {
                    "width": $(".width_auto", element).is(":checked") ? null : $(".width_value", element).val(),
                    "aspect": $(".aspect_auto", element).is(":checked") ? null : $(".aspect_value", element).val(),
                    "title": $(".plot_title", element).val(),
                    "titleOffset": [$(".title_offset_x", element).val(), $(".title_offset_y", element).val()],
                    "threeDimensional": $(".three_dim", element).val() === "1",
                    "key": $(".show_key", element).val() === "1",
                    "keyPosition": $(".key_pos", element).val(),
                    "keyColumns": $(".key_cols_auto", element).is(":checked") ? null : $(".key_cols_value", element).val(),
                    "keyOffset": [$(".key_offset_x", element).val(), $(".key_offset_y", element).val()],
                    "gridAxes": ($(".show_grid", element).val() === "1") ? ['x1', 'y1', 'z1'] : [],
                    "boxFrom": $(".box_from", element).val(),
                    "boxWidth": $(".box_width_auto", element).is(":checked") ? null : $(".box_width_value", element).val(),
                    "clip": $(".clip", element).val() === "1",
                    "fontSize": $(".font_size", element).val(),
                    "viewAngleXY": $(".view_angle_xy", element).val(),
                    "viewAngleYZ": $(".view_angle_yz", element).val(),
                    "aspectZ": $(".aspect_z", element).val(),
                    "axesColor": colorFromHtmlString($(".axes_color", element).val()),
                    "gridMajorColor": colorFromHtmlString($(".grid_maj_color", element).val()),
                    "gridMinorColor": colorFromHtmlString($(".grid_min_color", element).val()),
                    "textColor": colorFromHtmlString($(".text_color", element).val())
                };
            }

            // Function to propagate graph settings to graph object
            /**
             * graph_settings_commit - Update JSPlot_Graph object to reflect contents of HTML elements
             * @param element {Object} - jQuery element we are to read data from
             * @param target {JSPlot_Graph} - Target graph object to update
             */
            function graph_settings_commit(element, target) {
                // Read settings out of HTML form and pass into JSPlot_Graph object
                var graph_settings = graph_settings_extract(element);
                target.configure(graph_settings);

                // Automatically show/hide axis range settings, depending whether they are set to autoscale
                html_setting_hide_when_auto(graph_settings, element, "width", ".width_value_holder");
                html_setting_hide_when_auto(graph_settings, element, "aspect", ".aspect_value_holder");
                html_setting_hide_when_auto(graph_settings, element, "keyColumns", ".key_cols_value_holder");
                html_setting_hide_when_auto(graph_settings, element, "boxWidth", ".box_width_value_holder");
            }

            // Function to propagate graph settings from JSPlot_Graph object to HTML
            /**
             * graph_settings_import_from_target - Update HTML elements to reflect contents of a JSON object
             * @param element {Object} - jQuery element we are to read data from
             * @param json_input {Object} - JSON structure we are to fetch settings from
             * @param target {JSPlot_Graph} - Target graph to update
             */
            function graph_settings_import_from_json(element, json_input, target) {
                $(".width_auto", element).prop('checked', json_input.width === null);
                $(".width_value", element).val(json_input.width);
                $(".title", element).val(json_input.title);
                $(".title_offset_x", element).val(json_input.titleOffset[0]);
                $(".title_offset_y", element).val(json_input.titleOffset[1]);
                $(".three_dim", element).val(json_input.threeDimensional ? "1" : "0");
                $(".key", element).val(json_input.key ? "1" : "0");
                $(".key_pos", element).val(json_input.keyPosition);
                $(".key_cols_auto", element).prop('checked', json_input.keyColumns === null);
                $(".key_cols_value", element).val(json_input.keyColumns);
                $(".key_offset_x", element).val(json_input.keyOffset[0]);
                $(".key_offset_y", element).val(json_input.keyOffset[1]);
                $(".show_grid", element).val((json_input.gridAxes.length > 0) ? "1" : "0");
                $(".box_from", element).val(json_input.boxFrom);
                $(".box_width_auto", element).prop('checked', json_input.boxWidth === null);
                $(".box_width_value", element).val(json_input.boxWidth);
                $(".clip", element).val(json_input.clip ? "1" : "0");
                $(".font_size", element).val(json_input.fontSize);
                $(".view_angle_xy", element).val(json_input.viewAngleXY);
                $(".view_angle_yz", element).val(json_input.viewAngleYZ);
                $(".aspect_z", element).val(json_input.aspectZ);
                $(".axes_color", element).val(json_input.axesColor.toHTML());
                $(".grid_maj_color", element).val(json_input.gridMajorColor.toHTML());
                $(".grid_min_color", element).val(json_input.gridMinorColor.toHTML());
                $(".text_color", element).val(json_input.textColor.toHTML());

                graph_settings_commit(element, target);
            }

            var graph_settings_holder = $("#graph_settings");

            // Function to save all settings to a JSON file
            function save_settings() {
                var output = {
                    'jsplot': 1,
                    'graph': graph_settings_extract(graph_settings_holder),
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

                    graph_settings_import_from_json(graph_settings_holder, obj.graph, graph)

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

            // Wire up graph configuration controls
            $("input, select", graph_settings_holder).change(function () {
                graph_settings_commit(graph_settings_holder, graph);
                update_display();
            })

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
