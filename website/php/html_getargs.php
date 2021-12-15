<?php

// html_getargs.php

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

$php_path = realpath(dirname(__FILE__));

class html_getargs
{
    public static function makeFormSelect($elementName, $selectedValue, $optionList, $escapeHTML)
    {
        print "<select class=\"slt $elementName\" name=\"$elementName\">";
        foreach ($optionList as $o) {
            if (!is_array($o)) $o = [$o, $o];
            print "<option value=\"$o[0]\" " . (($selectedValue == $o[0]) ? " selected=\"selected\"" : "") . ">";
            print $escapeHTML ? htmlentities($o[1], ENT_QUOTES) : $o[1];
            print "</option>";
        }
        print "</select>";
    }
}
