<?php

// html_template.php

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

require_once "constants.php";
require_once "local_mods.php";

class HTMLtemplate
{
    public static function breadcrumb($items, $area, $postbreadcrumb = null)
    {
        global $const;
        $server = $const->server;
        if (is_null($items)) return;
        if ($area == "home") {
            return;
        } else if ($area == "demos") {
            array_unshift($items, ["demos.php", "Demos"]);
        } else if ($area == "search") {
            array_unshift($items, ["documentation.php", "Documentation"]);
        } else if ($area == "about") {
            array_unshift($items, ["about.php", "About"]);
        }
        array_unshift($items, ["", "Home"]);
        ?>
        <table style="margin-top:18px;">
            <tr>
                <td class="snugtop" style="white-space:nowrap;">
                    <p class="smtext" style="padding:12px 0 6px 0;">
                        <?php
                        $firstItem = true;
                        foreach ($items as $arg) {
                            print '<span class="chevron_holder">';
                            if (!$firstItem) print '<span class="chevronsep">&nbsp;</span>';
                            print "<a class='chevron' href='{$server}{$arg[0]}'>{$arg[1]}</a></span>";
                            $firstItem = false;
                        }
                        ?>
                    </p></td>
                <?php if ($postbreadcrumb): ?>
                    <td style="padding-left:20px;vertical-align:middle;">
                        <span class="postchevron">
<?php
$first = true;
foreach ($postbreadcrumb as $c) {
    $cname = str_replace(" ", "&nbsp;", htmlentities($c[1], ENT_QUOTES));
    if (!$first) {
        print "&nbsp;| ";
    } else {
        $first = false;
    }
    print "<a href=\"{$server}{$c[0]}\">" . $cname . "</a>";
}
?>
                        </span>
                    </td>
                <?php endif; ?>
            </tr>
        </table>
        <?php
    }

    public static function header($pageInfo)
    {
        global $const, $user;
        if (!isset($pageInfo["breadcrumb"])) $pageInfo["breadcrumb"] = [];
        if (!isset($pageInfo["postbreadcrumb"])) $pageInfo["postbreadcrumb"] = null;
        $server = $const->server;
        $settings = local_mods::get_settings();

        header("Content-Security-Policy: frame-ancestors 'none'");
        header("X-Frame-Options: DENY");

        print<<<__HTML__
<!DOCTYPE html>
<html lang="en">
__HTML__;
        ?>
        <head>
            <meta charset="utf-8">
            <meta name="description" content="<?php echo $pageInfo["pageDescription"]; ?>"/>
            <meta name="keywords" content="Javascript, graph, chart, plot"/>
            <meta name="generator" content="Dominic Ford"/>
            <meta name="author" content="Dominic Ford"/>
            <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
            <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
            <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
            <meta name="viewport" content="width=device-width, initial-scale=1">

            <title id="title1">
                <?php echo $pageInfo["pageTitle"]; ?>
            </title>

            <!--[if lt IE 9]>
            <script src="<?php echo $server; ?>vendor/html5shiv/dist/html5shiv.min.js" type="text/javascript"></script>
            <script src="<?php echo $server; ?>vendor/ExplorerCanvas/excanvas.js" type="text/javascript"></script>
            <![endif]-->

            <script src="<?php echo $server; ?>vendor/jquery/dist/jquery.min.js" type="text/javascript"></script>
            <script src="<?php echo $server; ?>vendor/tether/dist/js/tether.min.js"></script>
            <script src="<?php echo $server; ?>vendor/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
            <link rel="stylesheet" type="text/css"
                  href="<?php echo $server; ?>vendor/jquery-ui/themes/ui-darkness/jquery-ui.min.css"/>
            <style type="text/css">
                .ui-slider-horizontal .ui-state-default {
                    background: url(<?php echo $server; ?>/images/sliderarrow.png) no-repeat;
                    width: 9px;
                    height: 20px;
                    border: 0 none;
                    margin-left: -4px;
                }

                .ui-slider-vertical .ui-state-default {
                    background: url(<?php echo $server; ?>/images/slidervarrow.png) no-repeat;
                    width: 20px;
                    height: 9px;
                    border: 0 none;
                    margin-left: -4px;
                }
            </style>
            <link rel="stylesheet" href="<?php echo $server; ?>vendor/bootstrap/dist/css/bootstrap.min.css">
            <script src="<?php echo $server; ?>vendor/bootstrap/dist/js/bootstrap.min.js"></script>

            <link rel="stylesheet" href="<?php echo $server; ?>vendor/font-awesome/css/font-awesome.min.css">

            <link rel="stylesheet" type="text/css" href="<?php echo $server; ?>css/style.css" media="all"/>

            <script type="text/javascript" src="<?php echo $server; ?>js/jsplot.min.js"></script>

            <?php if ($pageInfo["teaserImg"]): ?>
                <link rel="image_src" href="<?php echo $server . $pageInfo["teaserImg"]; ?>"
                      title="<?php echo $pageInfo["pageTitle"]; ?>"/>
                <meta property="og:image" content="<?php echo $server . $pageInfo["teaserImg"]; ?>"/>
            <?php endif; ?>

            <?php echo $pageInfo["cssextra"]; ?>
            <?php local_mods::extra_headers(); ?>
        </head>

        <?php echo "<body><div class=\"contentwrapper\">"; ?>

        <div class="bannerback">
            <div class="banner">
                <div class="banner_txt_right" id="top">
                    <p class="toptitleA"><a href="#">JSPlot</a></p>
                </div>
            </div>
            <div id="bannerfull"></div>
        </div>

        <nav id="navbar-header" class="navbar navbar-dark bg-inverse navbar-fixed-top">
            <div class="container-fluid">
                <button class="navbar-toggler hidden-md-up" type="button"
                        data-toggle="collapse" data-target="#collapsing-navbar">
                    <i class="fa fa-bars" aria-hidden="true"></i>
                </button>
                <div class="collapse in" id="collapsing-navbar">

                    <a class="navbar-brand" style="padding-right:25px;" href="<?php echo $server; ?>">
                        <i class="fa fa-home" aria-hidden="true"></i>
                    </a>

                    <ul class="nav navbar-nav">
                        <li class="nav-item <?php if ($pageInfo["activeTab"] == "home") echo "active "; ?>">
                            <a class="nav-link" href="<?php echo $server; ?>">
                                JSPlot
                            </a>
                        </li>
                        <li class="nav-item <?php if ($pageInfo["activeTab"] == "demos") echo "active "; ?>">
                            <a class="nav-link" href="<?php echo $server; ?>demos.php">
                                Demos
                            </a>
                        </li>
                        <li class="nav-item <?php if ($pageInfo["activeTab"] == "documentation") echo "active "; ?>">
                            <a class="nav-link" href="<?php echo $server; ?>documentation.php">
                                Documentation
                            </a>
                        </li>
                        <li class="nav-item <?php if ($pageInfo["activeTab"] == "about") echo "active "; ?>">
                            <a class="nav-link" href="<?php echo $server; ?>about.php">
                                About
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <script type="application/javascript">
            if ($(window).width() < 768) $("#collapsing-navbar").collapse("hide");

            $(function () {
                setInterval(function () {
                    if ($(window).width() > 768) {
                        if (!window.is_large) $("#collapsing-navbar").collapse("show");
                        window.is_large = true;
                    } else {
                        window.is_large = false;

                    }
                }, 500);
            });
        </script>

        <div class="bannerfade"></div>

        <?php
        print '<div class="mainpage container' .
            ((isset($pageInfo["fluid"]) && $pageInfo["fluid"]) ? "-fluid" : "") . '">';
        print '<div class="row">';
        print '<div class="col-xl-10">';
        print '<div class="mainpane">';
        HTMLtemplate::breadcrumb($pageInfo["breadcrumb"], $pageInfo["activeTab"], $pageInfo["postbreadcrumb"]);
        ?>

        <?php if (!array_key_exists("noTitle", $pageInfo)) echo "<h2>" . $pageInfo["pageTitle"] . "</h2>"; ?>

        <?php
    }

    public static function sidebar($pageInfo)
    {
        ?>
        <div class="tallright">
            <?php local_mods::advertSidebar(); ?>
        </div>
        <?php
    }

    public function footer($pageInfo)
    {
        global $const;

        print "<div style='clear:both;'></div></div></div>"; // mainpane and col-xl-10
        ?>
        <div class="col-xl-2 tallright noprint">
            <?php $this->sidebar($pageInfo); ?>
        </div>
        <?php echo "</div>"; ?>
        <div class="row">
            <div class="col-xl-12 wideright">
                <hr/>
                <?php local_mods::advertFooter(); ?>
            </div>
        </div>

        <?php echo "</div>";  // mainpage
        ?>

        <div class="footer">
            <div class="container">
                <div class="row">
                    <div class="col-sm-2" style="text-align:center;padding:4px;">
                    </div>

                    <div class="col-sm-4" style="padding:4px;">
                        <p class="copyright">
                            <span style="font-size:15px;">
                            &copy;
                                <a href="https://dcford.org.uk/">Dominic Ford</a>
                                    2019&ndash;<?php echo date("Y"); ?>
                            </span>
                        </p>

                        <p class="copyright">
                            For more information about JSPlot,
                            <a href="<?php echo $const->server; ?>about.php">click here</a>.<br/>
                            Website designed by Dominic Ford.<br/>
                        </p>

                    </div>
                </div>
            </div>
        </div>

        <?php
        print "</body></html>";
    }
}

$pageTemplate = new HTMLtemplate();

