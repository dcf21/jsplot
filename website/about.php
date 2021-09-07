<?php

// about.php

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

            By day, I am a software developer working on the exoplanet search pipeline for the European Space Agency's
            <a href="https://sci.esa.int/web/plato/">PLATO</a> mission, which is scheduled to launch
            in 2026. I am based at the <a href="https://www.ast.cam.ac.uk">Institute of Astronomy</a> in
            Cambridge, UK.

        </p>
        <p>

            I previously led the development of the data-analysis pipeline for
            <a href="https://www.4most.eu">4MOST</a>'s spectroscopic surveys of the Milky Way,
            working in Sofia Feltzing's group at <a href="https://www.astro.lu.se/">Lund Observatory</a>,
            Sweden (2017&ndash;2019). The volume of data 4MOST will collect poses some interesting challenges, since
            it will observe tens of thousands of spectra every night. In practice, machine-learning
            techniques are likely to offer the only affordable way to analyse such a large dataset, but the
            interpretation of their output can be challenging.

        </p>

        <h5>Projects I work on in my spare time</h5>

        <p>
            In my spare time, I work on many science communication and amateur astronomy projects:
        </p>

        <ul style="margin:30px 20px">
            <li>
                <b>
                    <a href="https://in-the-sky.org">
                        In-The-Sky.org
                    </a>
                </b>
                &ndash;
                A guide to what's visible in the night sky which I have been developing since 2012. It includes an
                extensive list of astronomical events spanning the years from 1950 to 2300, and automatically tailors
                the information it provides to wherever you happen to live on Earth.
            </li>
            <li>
                <p>
                    <b>
                        <a href="https://britastro.org/observations">
                            Amateur astrophotography archive
                        </a>
                    </b>
                    &ndash;
                    In 2020, I worked with the British Astronomical Association to produce a searchable online
                    database of amateur astronomical images.
                </p>
                <p>
                    The archive went live in December 2020 with just over 40,000 images, searchable by object, object
                    type, date, etc. We hope the archive should grow rapidly from here, as all BAA members can now
                    upload a few images per day directly into the database, and the BAA also hopes to start uploading
                    some of its extensive collection of historical images.
                </p>
                <p>
                    The BAA's archives go back many decades, and should soon start to provide a really nice view of
                    how amateur astronomy has changed over time. Until now there's been very limited public access
                    to these images, so it's great to open up access to these images.
                </p>
                <p>
                    In addition to the BAA's archive, I also keep my own
                    <a href="https://images.dcford.org.uk">personal archive</a> of astrophotography.
                </p>
            </li>
            <li>
                <b>
                    <a href="https://sciencedemos.org.uk">
                        ScienceDemos.org.uk
                    </a>
                </b>
                &ndash;
                A collection of fun interactive online science demos, implemented in Javascript.
            </li>
            <li>
                <b>
                    <a href="https://jsplot.dcford.org.uk">
                        JSPlot
                    </a>
                </b>
                &ndash;
                An open-source Javascript graph-plotting and vector-graphics library, designed for
                embedding scientific charts in websites. I use this library extensively throughout the websites
                I maintain.
            </li>
            <li>
                <p>
                    <b>
                        <a href="https://hilltopviews.org.uk">
                            HillTopViews.org.uk
                        </a>
                    </b>
                    &ndash;
                    A three-dimensional interactive terrain map of the
                    <a href="https://hilltopviews.org.uk">Earth</a>
                    and
                    <a href="https://moon.in-the-sky.org/">Moon</a>.
                    The Earth maps are based on altitude data collected by NASA's
                    Shuttle Radar Topography Mission (SRTM) in 2000, combined with additional open-source data from
                    Open Street Map. The Moon maps are based on a
                    <a href="https://astrogeology.usgs.gov/search/details/Moon/LRO/LOLA/Lunar_LRO_LOLA_Global_LDEM_118m_Mar2014/cub">
                        digital elevation model
                    </a>
                    (DEM) from the Lunar Orbiter Laser Altimeter (LOLA; Smith et al., 2010), an
                    instrument on the NASA Lunar Reconnaissance Orbiter (LRO) spacecraft (Tooley et al., 2010).
                </p>
                <p>
                    In both cases, the data is displayed using a custom-built three-dimensional Javascript
                    rendering engine.
                </p>
            </li>
            <li>
                <p>
                    <b>
                        <a href="https://pigazing.dcford.org.uk">
                            Pi Gazing
                        </a>
                    </b>
                    &ndash;
                    A fun project to set up a network of motion-sensitive security cameras which are pointed upwards at
                    the sky, and can triangulate the three-dimensional trajectories of shooting stars, satellites and
                    aircraft. I use Raspberry Pi computers housed in the same enclosures as the cameras to do
                    real-time analysis on the images. Each camera is highly autonomous, running
                    <a href="http://astrometry.net">astrometry.net</a> to precisely determine the sky area the camera
                    is pointing at, and using a GPS receiver to determine the camera's location.
                </p>
                <p>
                    This project ran from 2014&ndash;2016 in collaboration with Cambridge Science Centre under its
                    former name of MeteorPi. In March 2020, the project started observing again under its new name
                    of Pi Gazing. The code is all freely available on
                    <a href="https://github.com/dcf21/pi-gazing">GitHub</a>.
                </p>
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

        <h5>Older projects</h5>

        <ul style="margin:30px 20px">
            <li>
                <b>
                    <a href="http://www.amazon.co.uk/Observers-Guide-Planetary-Motion-Explaining/dp/1493906283/">
                        The Observer's Guide to Planetary Motion
                    </a>
                </b>
                &ndash;
                My book, which describes much of the science behind how In-The-Sky.org does its calculations.
            </li>
            <li>
                <b>
                    <a href="http://www.pyxplot.org.uk">
                        Pyxplot
                    </a>
                </b>
                &ndash;
                A graphing and vector graphics package which I wrote in 2008&ndash;2012.
            </li>
            <li>
                <b>
                    <a href="https://in-the-sky.org/software.php">
                        GrepNova
                    </a>
                </b>
                &ndash;
                An automated image-comparison tool which I wrote in 2005 for amateur astronomers who hunt for supernova.
                This tool was used by Tom Boles, who currently holds the world record for the largest number of
                supernovae discovered by any single individual.
            </li>
            <li>
                <b>
                    Naked Astronomy
                </b>
                &ndash;
                Between 2012 and 2014 I worked for the Naked Scientists in Cambridge, where I produced the
                monthly STFC-funded podcast <i>Naked Astronomy</i>. I also spent one day a week in the newsroom of
                BBC Radio Cambridgeshire, acting as a science advisor.
            </li>
            <li>
                <b>
                    Square Kilometre Array
                </b>
                &ndash;
                Between 2007 and 2012, I worked at the Cavendish Laboratory, Cambridge, on feasibility studies for the
                use of Graphics Processing Units (GPUs) to build a correlator for the SKA.
            </li>
            <li>
                <b>
                    PhD Thesis
                </b>
                &ndash;
                I was awarded my PhD from the University of Cambridge in 2008, where my supervisor was Prof Paul
                Alexander. I built a model of the infrared spectra of dusty star-forming galaxies,
                which were being observed in large numbers at that time by
                <a href="https://en.wikipedia.org/wiki/Spitzer_Space_Telescope">Spitzer</a>.
            </li>
        </ul>

        <h5>Ancient projects</h5>

        <p>
            In the 1990s I was the kind of geeky teenager who sat in my bedroom writing
            computer games for my Acorn Electron. I even got a couple of them published. Though the reviewers spotted,
            quite correctly, that I wasn't very good at making up story lines.
        </p>

        <ul>
            <li>
                <b>Shipwrecked</b>
                &ndash;
                Published
                <a href="http://www.acornelectron.co.uk/eug/cats/eug30.html">here</a> (1996)
                and reviewed in detail
                <a href="http://8bs.com/elecgame/shipwrecked.htm">here</a>.
                In the unlikely event you want to try and complete it, you may find this
                <a href="http://www.acornelectron.co.uk/eug/sols/eug/Shipwrecked_000.html">solution</a>
                useful. It even got ported to the
                <a href="http://www.gamebase64.com/game.php?id=16601&amp;d=45">Commodore 64</a> and
                some YouTubers have recently made some
                <a href="https://www.youtube.com/watch?v=SvJDpdhnZpQ">videos</a> about it (!!).
            </li>
            <li>
                <b>Jupiter III</b>
                &ndash;
                The sequel to Shipwrecked, published
                <a href="http://www.acornelectron.co.uk/eug/cats/eug35.html">here</a> (1996)
                and reviewed in detail
                <a href="http://8bs.com/elecgame/shipwrecked_2.htm">here</a>.
                This was my first attempt at high-speed scrolling graphics.
                In the unlikely event you want to try and complete it, you may find this
                <a href="http://acornelectron.co.uk/eug/sols/eug/Shipwrecked_2_Jupiter_3_000.html">solution</a>
                useful.
            </li>
        </ul>
    </div>

<?php
$pageTemplate->footer($pageInfo);
