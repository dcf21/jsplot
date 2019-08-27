// graphics_collision_map.js

/**
 * GraphicsCollisionMap - A class for keeping track of the bounding boxes of text labels and calculating when they
 * collide.
 * @constructor
 */
function GraphicsCollisionMap() {
    this._reset();
}

/**
 * _reset - Clear the collision map.
 * @private
 */
GraphicsCollisionMap.prototype._reset = function () {
    this._items = [];
};

/**
 * _addBox - Add a rectangular region to the collision map.
 * @param x_min {number} - The x coordinate of the bottom-left corner of the rectangular region
 * @param x_max {number} - The y coordinate of the bottom-left corner of the rectangular region
 * @param y_min {number} - The x coordinate of the top-right corner of the rectangular region
 * @param y_max {number} - The y coordinate of the top-right corner of the rectangular region
 * @param mustnt_collide {boolean} - If true, reject this region if it collides with an existing item on the map
 * @param add_to_collision_map {boolean} - If true, add region to collision map
 * @returns {number} - Zero if this item does not collide with existing item. One if there is a collision.
 * @private
 */
GraphicsCollisionMap.prototype._addBox = function (x_min, x_max, y_min, y_max, mustnt_collide, add_to_collision_map) {
    var self = this;
    var collides = false;

    if (mustnt_collide) {
        $.each(self._items, function (index, item) {
            if ((x_min < item[1]) && (x_max > item[0]) && (y_min < item[3]) && (y_max > item[2]))
                collides = true;
        });
    }

    if (collides) return 1; // collision

    if (add_to_collision_map) {
        self._items.push([x_min, x_max, y_min, y_max]);
    }

    return 0; // no collision
};
