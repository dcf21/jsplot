// jsplot_bounding_box.js

JSPlot_BoundingBox = function() {
    this.left = null;
    this.right=null;
    this.top = null;
    this.bottom=null;
};

JSPlot_BoundingBox.prototype.includePoint = function(x, y) {
    if ((this.left === null) || (this.left > x)) this.left = x;
    if ((this.right === null) || (this.right < x)) this.right = x;
    if ((this.top === null) || (this.top > y)) this.top = y;
    if ((this.bottom === null) || (this.bottom < y)) this.bottom = y;
};

JSPlot_BoundingBox.prototype.includeBox = function(box) {
    if ((this.left === null) || (this.left > box.left)) this.left = box.left;
    if ((this.right === null) || (this.right < box.right)) this.right = box.right;
    if ((this.top === null) || (this.top > box.top)) this.top = box.top;
    if ((this.bottom === null) || (this.bottom < box.bottom)) this.bottom = box.bottom;
};
