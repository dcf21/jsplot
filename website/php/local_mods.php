<?php

// local_mods.php

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

// User this to make local modifications, e.g. adding Google Analytics code

class local_mods
{
    // This function returns a dictionary of settings that affect the headers of each page
    public static function get_settings()
    {
        return [
        ];
    }

    // Use this function to add arbitrary code to the headers of every page of the JSPlot website
    // For example, you might want to add Google Analytics code here
    public static function extra_headers()
    {
        ?>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-22395429-9"></script>
        <script>
            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }

            gtag('js', new Date());
            gtag('config', 'UA-22395429-9');
        </script>
        <?php
    }

    public static function advertFooter()
    {
        ?>
        <div>
            <div class="tallright2">
                <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                <!-- jsplot.dcford.org.uk -->
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-0140009944980327"
                     data-ad-slot="9542057108"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
        </div>
        <?php
    }

    public static function advertSidebar()
    {
        ?>
        <div>
            <div class="tallright1 centerblock">
                <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                <!-- jsplot.dcford.org.uk -->
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-0140009944980327"
                     data-ad-slot="9542057108"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
        </div>
        <?php
    }
}

