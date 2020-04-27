# -*- coding: utf-8 -*-
# php_preprocess.py

# -------------------------------------------------
# Copyright 2020 Dominic Ford.

# This file is part of JSPlot.

# JSPlot is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# JSPlot is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with JSPlot.  If not, see <http://www.gnu.org/licenses/>.
# -------------------------------------------------

import os
import shutil


def php_preprocess(fname, infile, outfile):
    print("Working on file <{}>".format(fname))
    shutil.copyfile(infile, outfile)

    # Make PHP files executable
    os.system("chmod 755 {}".format(outfile))
