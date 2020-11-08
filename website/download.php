<?php

// download.php

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
    "pageTitle" => "Download JSPlot",
    "pageDescription" => "Download JSPlot",
    "activeTab" => "download",
    "teaserImg" => null,
    "cssextra" => null,
    "includes" => [],
    "linkRSS" => null,
    "options" => []
];

$pageTemplate->header($pageInfo);

?>

    <div class="large_text">
        <p>
            <b>JSPlot</b> is open-source software, licensed under the Gnu General Public License (GPL v3).
        </p>
        <p>
            You can download the source code from
            <a href="https://github.com/dcf21/jsplot">GitHub</a>.
        </p>
    </div>

<?php
$pageTemplate->footer($pageInfo);
