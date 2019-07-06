// graphics_collision_map.js

// This class creates a simple framework for detecting collisions between items.

function GraphicsCollisionMap() {
    this._reset();
}

GraphicsCollisionMap.prototype._reset = function () {
    this._items = [];
};

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
