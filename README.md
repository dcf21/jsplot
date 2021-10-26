# JSPlot

JSPlot is an open-source Javascript graph-plotting and vector-graphics library, designed for embedding scientific charts
in websites.

The full source code is available in this GitHub repository, in the `src` directory.
A [gallery of example plots](https://jsplot.dcford.org.uk/demos.php), together
with [API documentation](https://jsplot.dcford.org.uk/documentation.php) is available on
the [JSPlot website](https://jsplot.dcford.org.uk/). A minified version of the source code is available
here: https://jsplot.dcford.org.uk/js/jsplot.min.js

### License

This code is distributed under the Gnu General Public License (GPL v3). It is (C)
Dominic Ford 2019 - 2021.

### Plotting options

JSPlot supports a wide range of 2D and 3D chart types, which are designed to look similar to styles often seen in the
scientific literature. Supported chart types include scatter charts, line charts, bar charts, plots with error bars, and
more. Data can be either numerical or time stamps, making it easy to plot time-series data along axes which
automatically render dates and times into an appropriate format.

Options are provided to make plots either static or interactive. In the latter case, the user can click and drag plots
to scroll the axes or use the mouse wheel to zoom in/out. Such interactive charts are fully compatible with touch-screen
devices, where pinch gestures are used to zoom.

Supported output media include HTML5 canvas objects, PNG files, and SVG files.

### Directory structure

Within this repository, the code is stored in the following directories:

`src` &ndash; This contains all the Javascript source code for JSPlot.

`website` &ndash; This contains the PHP source code for the [JSPlot website](https://jsplot.dcford.org.uk/), including
all the example plots.

`build` &ndash; This contains a Python 3 script to build the example website into a form which can be served by an http
server such as Apache. It compiles the LESS style files into regular CSS, and minifies the Javascript sources into a
single file. It creates a directory `dist` containing the built website.

### Dependencies

JSPlot requires `jQuery`.

If you wish to build the example website (note that this is not necessary to run JSPlot), you will need to
install `Python 3`, `nodejs`, `bower`, `uglify-js`, `less`, `less-plugin-clean-css`. The latter four packages can be
installed via the node package manager (`npm`) as follows:

`npm install -g bower uglify-js less less-plugin-clean-css`

## Author

JSPlot was written by [Dominic Ford](https://dcford.org.uk/) 2019-2021.