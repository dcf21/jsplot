<?php

// about.php

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

require "php/imports.php";

$pageInfo = [
    "pageTitle" => "About JSPlot",
    "pageDescription" => "JSPlot",
    "activeTab" => "about",
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
            <b>JSPlot</b> is an open-source Javascript graph-plotting and vector-graphics library, designed for
            embedding scientific charts in websites. It is licensed under the Gnu General Public License (GPL v3), and
            can be
            <a href="download.php">downloaded from GitHub</a>.
        </p>
        <p>
            It was developed by
            <a href="https://dcford.org.uk/">Dominic Ford</a>,
            with the aim of making it possible to embed scienfically-accurate charts in websites, in a style similar
            to that used by most scientific journals.
        </p>
        <p>
            It is also designed to make it easy to make interactive plots, where the user can change the axis ranges
            with intuitive scroll and zoom operations.
        </p>
        <p>
            JSPlot can render charts onto HTML5 canvas objects, to PNG files, or to SVG files.
        </p>


        <p class="widetitle" id="dcf21">Dominic Ford</p>

        <div class="framebox">
            <img src="<?php echo $const->server; ?>img/dcf.jpg" width="200" alt="Dominic Ford"/>
        </div>

        <p>
            I work on the Exoplanet Analysis System for the European Space Agency's forthcoming
            <a href="http://sci.esa.int/plato/">PLATO</a> mission, which is scheduled for launch
            in 2026. I am based at the <a href="http://www.ast.cam.ac.uk">Institute of Astronomy</a> in
            Cambridge, UK, where I work with Nicholas Walton.
        </p>

        <p>
            From 2017 until 2019, I worked at
            <a href="http://www.astro.lu.se/">Lund Observatory</a>, Sweden, leading the development of the
            <a href="https://www.4most.eu">4MOST</a> consortium's
            data analysis pipeline for spectroscopic surveys of the Milky Way.
            In particular, I studied the strengths and limitations of machine-learning
            techniques for analysing astronomical spectra, since such methods may be the only feasible way to process
            the tens of thousands of spectra that 4MOST will observe every night.
        </p>

        <h5>Projects I work on in my spare time</h5>

        <ul style="margin:30px 20px">
            <li>
                <b>
                    <a href="https://in-the-sky.org">
                        In-The-Sky.org
                    </a>
                </b>
                &ndash;
                a guide to what's visible in the night sky, which automatically tailors information
                to wherever you happen to live on Earth.
            </li>
            <li>
                <b>
                    <a href="https://sciencedemos.org.uk">
                        ScienceDemos.org.uk
                    </a>
                </b>
                &ndash;
                a collection of fun interactive online science demos.
            </li>
            <li>
                <b>
                    <a href="https://hilltopviews.org.uk">
                        HillTopViews.org.uk
                    </a>
                </b>
                &ndash;
                a three-dimensional terrain map of the world, based on altitude data collected by NASA's
                Shuttle Radar Topography Mission (SRTM) in 2000, combined with additional open-source data from
                Open Street Map.
            </li>
            <li>
                <b>
                    <a href="https://jsplot.dcford.org.uk">
                        JSPlot
                    </a>
                </b>
                &ndash;
                an open-source Javascript graph-plotting and vector-graphics library, designed for
                embedding scientific charts in websites.
            </li>
            <li>
                <b>
                    <a href="http://photos.dcford.org.uk">
                        Dominic's photos
                    </a>
                </b>
                &ndash;
                When I'm not doing other things, I dabble in amateur photography, and you can find some of my
                photos here.
            </li>
        </ul>

        <h5>Experimental projects</h5>

        <ul style="margin:30px 20px">
            <li>
                <b>
                    <a href="https://images.dcford.org.uk">
                        An astrophoto archive
                    </a>
                </b>
                &ndash;
                A highly experimental tool for publishing galleries of astrophotos online, searchable by object
                name or celestial coordinates.
            </li>
            <li>
                <b>
                    <a href="https://pigazing.dcford.org.uk">
                        Pi Gazing
                    </a>
                </b>
                &ndash;
                a fun project to set up a network of motion-sensitive security cameras which triangulate
                the three-dimensional trajectories of shooting stars, satellites and aircraft. We use Raspberry
                Pis to do the real-time image analysis, running <a href="http://astrometry.net">astrometry.net</a>
                to precisely determine the direction each camera was pointing, and a GPS receiver to determine their
                positions.

                This project ran from 2014&ndash;2016 in collaboration with Cambridge Science Centre under its former
                name of MeteorPi. I doing some work in my spare time to try to restart. The code needs a lot of
                cleaning up, but is all available on <a href="https://github.com/dcf21/pi-gazing">GitHub</a>.
            </li>
        </ul>
    </div>

<?php
$pageTemplate->footer($pageInfo);
