// common.js

/**
 * Offer a blob of text (e.g. an SVG file) as a download.
 * @param filename - The filename to suggest to the user for this download
 * @param data - The blob of text to offer for download
 */
function saveBlob(filename, data) {
    var blob = new Blob([data], {type: 'image/svg+xml'});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
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
