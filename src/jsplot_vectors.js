// jsplot_vectors.js

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

// Functions for handling 3D vectors

/**
 * JSPlot_Point - A class representing a point in 3D space
 * @param x {number} - Vector element
 * @param y {number} - Vector element
 * @param z {number} - Vector element
 * @constructor
 */
function JSPlot_Point(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
}

/**
 * Return string representation of a JSPlot_Point instance
 * @returns {string}
 */
JSPlot_Point.prototype.str = function () {
    return "Point(" + this._x + "," + this._y + "," + this._z + ")";
};

/**
 * Cast a JSPlot_Point instance into a JSPlot_Vector instance
 * @returns {JSPlot_Vector}
 */
JSPlot_Point.prototype.to_vector = function () {
    return new JSPlot_Vector(this._x, this._y, this._z);
};

/**
 * Add a vector to a point, and return a new point
 * @param other {JSPlot_Vector} - Vector to add to point
 * @returns {JSPlot_Point} - New point
 */
JSPlot_Point.prototype.add_vector = function (other) {
    return new JSPlot_Point(this._x + other._x, this._y + other._y, this._z + other._z);
};

/**
 * Returns the vector displacement of this point from another point
 * @param other {JSPlot_Point} - Other point
 * @returns {JSPlot_Vector} - Vector displacement
 */
JSPlot_Point.prototype.displacement_vector_from = function (other) {
    return new JSPlot_Vector(this._x - other._x, this._y - other._y, this._z - other._z);
};

/**
 * Returns the vector displacement of this point from the origin
 * @returns {JSPlot_Vector} - Vector displacement
 */
JSPlot_Point.prototype.displacement_from_origin = function () {
    return new JSPlot_Vector(this._x, this._y, this._z);
};

/**
 * Returns the distance of this point from the origin
 * @returns {number} - Distance
 */
JSPlot_Point.prototype.abs = function () {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
};


/**
 * JSPlot_Vector - A class representing a 3D vector
 * @param x {number} - Vector element
 * @param y {number} - Vector element
 * @param z {number} - Vector element
 * @constructor
 */
function JSPlot_Vector(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
}

/**
 * Convert a JSPlot_Vector into an Array
 * @returns {[number, number, number]}
 */
JSPlot_Vector.prototype.to_list = function () {
    return [this._x, this._y, this._z];
};

/**
 * Produce a string representation of a JSPlot_Vector instance
 * @returns {string}
 */
JSPlot_Vector.prototype.str = function () {
    return "Vector(" + this._x + "," + this._y + "," + this._z + ")";
};

/**
 * JSPlot_Vector_from_lat_lng - Create a unit vector pointing in a direction described by a pair of polar coordinates
 * @param lat {number} - Polar coordinate, radians.
 * @param lng {number} - Polar coordinate, radians.
 * @returns {JSPlot_Vector} - Computed vector
 * @constructor
 */
function JSPlot_Vector_from_lat_lng(lat, lng) {
    var x = Math.cos(lng) * Math.cos(lat);
    var y = Math.sin(lng) * Math.cos(lat);
    var z = Math.sin(lat);
    return new JSPlot_Vector(x, y, z);
}

/**
 * Add two vectors together, and return a new vector
 * @param other {JSPlot_Vector} - Vector to add to this one
 * @returns {JSPlot_Vector} - Sum of two vectors
 */
JSPlot_Vector.prototype.add = function (other) {
    return new JSPlot_Vector(this._x + other._x, this._y + other._y, this._z + other._z)
};

/**
 * Subtract another vector from this one, and return a new vector
 * @param other {JSPlot_Vector} - Vector to subtract from this one
 * @returns {JSPlot_Vector} - Difference between two vectors
 */
JSPlot_Vector.prototype.sub = function (other) {
    return new JSPlot_Vector(this._x - other._x, this._y - other._y, this._z - other._z)
};

/**
 * Multiply this vector by a scalar
 * @param other {number} - Scalar to multiply this vector by
 * @returns {JSPlot_Vector} - Result of multiplication
 */
JSPlot_Vector.prototype.mul = function (other) {
    return new JSPlot_Vector(this._x * other, this._y * other, this._z * other)
};

/**
 * Return the magnitude (i.e. length) of this vector
 * @returns {number} - Magnitude of vector
 */
JSPlot_Vector.prototype.abs = function () {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z)
};

/**
 * Compute the cross product of two vectors
 * @param other {JSPlot_Vector} - Vector to form cross product with this vector
 * @returns {JSPlot_Vector} - Result of cross product of this vector with other
 */
JSPlot_Vector.prototype.cross_product = function (other) {
    var x_out = this._y * other._z - this._z * other._y;
    var y_out = this._z * other._x - this._x * other._z;
    var z_out = this._x * other._y - this._y * other._x;
    return new JSPlot_Vector(x_out, y_out, z_out);
};

/**
 * Compute the dot product of two vectors
 * @param other {JSPlot_Vector} - Vector to form dot product with this vector
 * @returns {JSPlot_Vector} - Result of dot product of this vector with other
 */
JSPlot_Vector.prototype.dot_product = function (other) {
    return this._x * other._x + this._y * other._y + this._z * other._z;
};

/**
 * Returns the angle between two vectors (radians)
 * @param other {JSPlot_Vector} - Vector to compare with this vector
 * @returns {number} - Angle between two vectors
 */
JSPlot_Vector.prototype.angle_with = function (other) {
    var dot = this.dot_product(other);
    var mag1 = this.abs();
    var mag2 = other.abs();
    var angle_cosine = dot / mag1 / mag2;

    // Avoid domain errors in inverse cosine
    if (angle_cosine > 1) angle_cosine = 1;
    if (angle_cosine < -1) angle_cosine = -1;

    return Math.acos(angle_cosine);
};

/**
 * Return the unit vector in the same direction as this vector
 * @returns {JSPlot_Vector} - unit vector
 */
JSPlot_Vector.prototype.normalise = function () {
    var mag = this.abs();
    return new JSPlot_Vector(this._x / mag, this._y / mag, this._z / mag);
};

/**
 * JSPlot_Line - A class representing a line in 3D space, represented by the equation <x = x0 + i*direction>
 * @param x0 {JSPlot_Point} - Any point on the line
 * @param direction {JSPlot_Vector} - The direction of the line
 * @constructor
 */
function JSPlot_Line(x0, direction) {
    this._x0 = x0;
    this._direction = direction;
}

/**
 * Return a point on the line
 * @param i {number} - Distance along the line from <x0>, measured in units of <direction>.
 * @returns {JSPlot_Point} - A point on the line
 */
JSPlot_Line.prototype.point = function (i) {
    return this._x0.add_vector(this._direction.mul(i))
};

/**
 * Find the point of closest approach between two lines
 * @param other {JSPlot_Line} - Other line to find point of closest intersection with
 * @returns {{other_point, distance: number, angular_distance: number, self_point: JSPlot_Point}}
 */
// Find the point of closest approach between two lines.
JSPlot_Line.prototype.find_closest_approach = function (other) {

    // For details of algorithm, see https://books.google.co.uk/books?id=NKONAgAAQBAJ&pg=PA20#v=onepage&q&f=false
    var p1 = this._x0;
    var p2 = other._x0;
    var r = this._direction;
    var d = other._direction;

    var p1_minus_p2 = p2.displacement_vector_from(p1);

    var d_dot_r = d.dot_product(r);

    var mu = (p1_minus_p2.dot_product(d) - p1_minus_p2.dot_product(r) * d_dot_r) / (1 - Math.pow(d_dot_r, 2));

    var lambda_ = mu * d_dot_r - p1_minus_p2.dot_product(r);

    var self_point = this.point(lambda_);
    var other_point = other.point(mu);
    var distance = Math.abs(self_point.displacement_vector_from(other_point));
    var angular_distance = Math.abs(self_point.displacement_from_origin().angle_with(other_point.displacement_from_origin()));

    return {
        'self_point': self_point, 'other_point': other_point,
        'distance': distance, 'angular_distance': angular_distance
    };
};

/**
 * Rotate a vector by angle <theta> radians in the x/y plane
 * @param theta {number} - Rotation angle
 * @returns {JSPlot_Vector} - Rotated vector
 */
JSPlot_Vector.prototype.rotate_xy = function (theta) {
    var x = this._x * Math.cos(theta) + this._y * -Math.sin(theta);
    var y = this._x * Math.sin(theta) + this._y * Math.cos(theta);
    var z = this._z;
    return new JSPlot_Vector(x, y, z);
};

/**
 * Rotate a vector by angle <theta> radians in the x/z plane
 * @param theta {number} - Rotation angle
 * @returns {JSPlot_Vector} - Rotated vector
 */
JSPlot_Vector.prototype.rotate_xz = function (theta) {
    var x = this._x * Math.cos(theta) + this._z * -Math.sin(theta);
    var y = this._y;
    var z = this._x * Math.sin(theta) + this._z * Math.cos(theta);
    return new JSPlot_Vector(x, y, z);
};

/**
 * Rotate a vector by angle <theta> radians in the y/z plane
 * @param theta {number} - Rotation angle
 * @returns {JSPlot_Vector} - Rotated vector
 */
JSPlot_Vector.prototype.rotate_yz = function (theta) {
    var x = this._x;
    var y = this._y * Math.cos(theta) + this._z * -Math.sin(theta);
    var z = this._y * Math.sin(theta) + this._z * Math.cos(theta);
    return new JSPlot_Vector(x, y, z);
};

/**
 * JSPlot_Matrix - A class representing a 3x3 matrix
 * @constructor
 */
function JSPlot_Matrix() {
    this._m = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
}

/**
 * Initialise a JSPlot_Matrix to represent a rotation matrix which turns by <x_angle> around the x axis, and then by
 * <y_angle> around the y axis.
 * @param x_angle {number} - Rotation angle around the x axis, radians
 * @param y_angle {number} - Rotation angle around the y axis, radians
 * @returns {JSPlot_Matrix} - Rotation matrix
 */
JSPlot_Matrix.prototype.rotate = function (x_angle, y_angle) {
    var sin_x = Math.sin(x_angle);
    var cos_x = Math.cos(x_angle);
    var sin_y = Math.sin(y_angle);
    var cos_y = Math.cos(y_angle);
    var m = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    var o = this._m;
    m[0][0] = cos_x * o[0][0] + sin_x * o[2][0];
    m[0][1] = cos_x * o[0][1] + sin_x * o[2][1];
    m[0][2] = cos_x * o[0][2] + sin_x * o[2][2];
    m[1][0] = -sin_x * sin_y * o[0][0] + cos_y * o[1][0] + sin_y * cos_x * o[2][0];
    m[1][1] = -sin_x * sin_y * o[0][1] + cos_y * o[1][1] + sin_y * cos_x * o[2][1];
    m[1][2] = -sin_x * sin_y * o[0][2] + cos_y * o[1][2] + sin_y * cos_x * o[2][2];
    m[2][0] = -cos_y * sin_x * o[0][0] - sin_y * o[1][0] + cos_y * cos_x * o[2][0];
    m[2][1] = -cos_y * sin_x * o[0][1] - sin_y * o[1][1] + cos_y * cos_x * o[2][1];
    m[2][2] = -cos_y * sin_x * o[0][2] - sin_y * o[1][2] + cos_y * cos_x * o[2][2];
    var output = new JSPlot_Matrix();
    output._m = m;
    return output;
};

/**
 * Assuming that this JSPlot_Matrix represents a valid rotation matrix, extract the angle <x_angle> which it turns
 * around the x axis, followed by a rotation of <y_angle> around the y axis.
 * @returns {[number, number, number]}
 */
JSPlot_Matrix.prototype.to_euler_angles = function () {
    var m = this._m;
    if (m[0][0] > 1) m[0][0] = 1;
    if (m[0][0] < -1) m[0][0] = -1;
    if (m[0][1] > 1) m[0][1] = 1;
    if (m[0][1] < -1) m[0][1] = -1;
    if (m[0][2] > 1) m[0][2] = 1;
    if (m[0][2] < -1) m[0][2] = -1;
    if (m[1][0] > 1) m[1][0] = 1;
    if (m[1][0] < -1) m[1][0] = -1;
    if (m[1][1] > 1) m[1][1] = 1;
    if (m[1][1] < -1) m[1][1] = -1;
    if (m[1][2] > 1) m[1][2] = 1;
    if (m[1][2] < -1) m[1][2] = -1;
    if (m[2][0] > 1) m[2][0] = 1;
    if (m[2][0] < -1) m[2][0] = -1;
    if (m[2][1] > 1) m[2][1] = 1;
    if (m[2][1] < -1) m[2][1] = -1;
    if (m[2][2] > 1) m[2][2] = 1;
    if (m[2][2] < -1) m[2][2] = -1;

    // See http://www.soi.city.ac.uk/~sbbh653/publications/euler.pdf
    // Paper assumes rotate around x, then y, then z. But to keep north up, need to rotate in RA, then Dec, and then *not* in position angle.
    // This means rotates around y, then x, and then not around z. So equations below swap x and y, i.e. matrix indices 0 and 1.
    var theta;
    var phi;
    var psi; // Decompose rotation matrix into Euler angles
    if ((m[2][1] < 1) && (m[2][1] > -1)) {
        var theta1 = -Math.asin(m[2][1]);
        // var theta2 = Math.PI-theta1;
        var psi1 = Math.atan2(m[2][0] / Math.cos(theta1), m[2][2] / Math.cos(theta1));
        //var psi2   = Math.atan2(m[2][0]/Math.cos(theta2) , m[2][2]/Math.cos(theta2));
        var phi1 = Math.atan2(m[0][1] / Math.cos(theta1), m[1][1] / Math.cos(theta1));
        //var phi2   = Math.atan2(m[0][1]/Math.cos(theta2) , m[1][1]/Math.cos(theta2));
        theta = theta1;
        phi = phi1;
        psi = psi1;
    } else {
        phi = 0;
        var delta = Math.atan2(m[1][0], m[1][2]);
        if (m[2][0] < 0) {
            theta = Math.PI / 2;
            psi = phi + delta;
        } else {
            theta = -Math.PI / 2;
            psi = -phi + delta;
        }
    }
    return [theta, phi, psi];
};

/**
 * Inverse of the above. Create a rotation matrix from a set of Euler angles.
 * @param theta {number} - Euler angle
 * @param phi {number} - Euler angle
 * @param psi {number} - Euler angle
 * @returns {JSPlot_Matrix} - Rotation matrix
 * @constructor
 */
function JSPlot_Matrix_from_euler_angles(theta, phi, psi) {
    var output = new JSPlot_Matrix();
    var m = output._m;
    m[1][1] = Math.cos(theta) * Math.cos(phi);
    m[1][0] = Math.sin(psi) * Math.sin(theta) * Math.cos(phi) - Math.cos(psi) * Math.sin(phi);
    m[1][2] = Math.cos(psi) * Math.sin(theta) * Math.cos(phi) + Math.sin(psi) * Math.sin(phi);
    m[0][1] = Math.cos(theta) * Math.sin(phi);
    m[0][0] = Math.sin(psi) * Math.sin(theta) * Math.sin(phi) + Math.cos(psi) * Math.cos(phi);
    m[0][2] = Math.cos(psi) * Math.sin(theta) * Math.sin(phi) - Math.sin(psi) * Math.cos(phi);
    m[2][1] = -Math.sin(theta);
    m[2][0] = Math.sin(psi) * Math.cos(theta);
    m[2][2] = Math.cos(psi) * Math.cos(theta);
    return output;
}

/**
 * Multiply a vector by a matrix
 * @param v {JSPlot_Vector} - Vector to multiply by this matrix
 * @returns {JSPlot_Vector} - Result of matrix multiplication
 */
JSPlot_Matrix.prototype.multiply_vector = function (v) {
    var m = this._m;
    // Rotate view with user-variable rotation matrix
    var xo = v._x * m[0][0] + v._y * m[0][1] + v._z * m[0][2];
    var yo = v._x * m[1][0] + v._y * m[1][1] + v._z * m[1][2];
    var zo = v._x * m[2][0] + v._y * m[2][1] + v._z * m[2][2];
    return new JSPlot_Vector(xo, yo, zo);
};

/**
 * Matrix rotation in the y/z plane
 * @param theta {number} - Rotation angle, radians
 * @returns {JSPlot_Matrix} - Result of rotating the rotation matrix
 */
JSPlot_Matrix.prototype.rotate_m_yz = function (theta) {
    var matrix_in = this._m;
    var output = new JSPlot_Matrix();
    var out = output._m;
    out[0][0] = matrix_in[0][0];
    out[0][1] = matrix_in[0][1];
    out[0][2] = matrix_in[0][2];
    out[1][0] = matrix_in[1][0] * Math.cos(theta) - matrix_in[2][0] * Math.sin(theta);
    out[1][1] = matrix_in[1][1] * Math.cos(theta) - matrix_in[2][1] * Math.sin(theta);
    out[1][2] = matrix_in[1][2] * Math.cos(theta) - matrix_in[2][2] * Math.sin(theta);
    out[2][0] = matrix_in[1][0] * Math.sin(theta) + matrix_in[2][0] * Math.cos(theta);
    out[2][1] = matrix_in[1][1] * Math.sin(theta) + matrix_in[2][1] * Math.cos(theta);
    out[2][2] = matrix_in[1][2] * Math.sin(theta) + matrix_in[2][2] * Math.cos(theta);
    return output;
};

/**
 * Matrix rotation in the x/z plane
 * @param theta {number} - Rotation angle, radians
 * @returns {JSPlot_Matrix} - Result of rotating the rotation matrix
 */
JSPlot_Matrix.prototype.rotate_m_xz = function (theta) {
    var matrix_in = this._m;
    var output = new JSPlot_Matrix();
    var out = output._m;
    out[0][0] = matrix_in[0][0] * Math.cos(theta) + matrix_in[2][0] * Math.sin(theta);
    out[0][1] = matrix_in[0][1] * Math.cos(theta) + matrix_in[2][1] * Math.sin(theta);
    out[0][2] = matrix_in[0][2] * Math.cos(theta) + matrix_in[2][2] * Math.sin(theta);
    out[1][0] = matrix_in[1][0];
    out[1][1] = matrix_in[1][1];
    out[1][2] = matrix_in[1][2];
    out[2][0] = -matrix_in[0][0] * Math.sin(theta) + matrix_in[2][0] * Math.cos(theta);
    out[2][1] = -matrix_in[0][1] * Math.sin(theta) + matrix_in[2][1] * Math.cos(theta);
    out[2][2] = -matrix_in[0][2] * Math.sin(theta) + matrix_in[2][2] * Math.cos(theta);
    return output;
};

/**
 * Matrix rotation in the x/y plane
 * @param theta {number} - Rotation angle, radians
 * @returns {JSPlot_Matrix} - Result of rotating the rotation matrix
 */
JSPlot_Matrix.prototype.rotate_m_xy = function (theta) {
    var matrix_in = this._m;
    var output = new JSPlot_Matrix();
    var out = output._m;
    out[0][0] = matrix_in[0][0] * Math.cos(theta) - matrix_in[1][0] * Math.sin(theta);
    out[0][1] = matrix_in[0][1] * Math.cos(theta) - matrix_in[1][1] * Math.sin(theta);
    out[0][2] = matrix_in[0][2] * Math.cos(theta) - matrix_in[1][2] * Math.sin(theta);
    out[1][0] = matrix_in[0][0] * Math.sin(theta) + matrix_in[1][0] * Math.cos(theta);
    out[1][1] = matrix_in[0][1] * Math.sin(theta) + matrix_in[1][1] * Math.cos(theta);
    out[1][2] = matrix_in[0][2] * Math.sin(theta) + matrix_in[1][2] * Math.cos(theta);
    out[2][0] = matrix_in[2][0];
    out[2][1] = matrix_in[2][1];
    out[2][2] = matrix_in[2][2];
    return output;
};
