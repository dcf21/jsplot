// common.js

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

// Common functions

function padStr(i) {
    return (i < 10) ? "0" + i : "" + i;
}

/**
 * Offer a blob of text (e.g. an SVG file) as a download.
 * @param filename - The filename to suggest to the user for this download
 * @param data - The blob of text to offer for download
 */
function saveBlob(filename, data) {
    var mime_type = "text/plain";
    if (filename.endsWith(".svg")) mime_type = "image/svg+xml";
    if (filename.endsWith(".csv")) mime_type = "text/csv";
    var blob = new Blob([data], {type: mime_type});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

/**
 * Detect Internet Explorer, and if used, return the version number
 * @returns {boolean|number}
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function toInt(value) {
    return ~~value;
}

function getCursorPos(e, name) {
    var o = name.offset();
    var posx = e.pageX - o.left;
    var posy = e.pageY - o.top;
    return [posx, posy];
}
