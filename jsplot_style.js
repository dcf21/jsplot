// jsplot_style.js

function JSPlot_Style() {
    this.color = null; // auto
    this.fillColor = new JSPlot_Color(0, 0, 0, 0); // transparent
    this.plotStyle = 'lines';
    this.lineType = null;
    this.pointType = null;
    this.lineWidth = 1;
    this.pointLineWidth = 1;
    this.pointSize = 1;
}

JSPlot_Style.prototype.clone = function () {
    var other = new JSPlot_Style();
    other.color = new JSPlot_Color(this.color.red, this.color.green, this.color.blue, this.color.alpha);
    other.fillColor = new JSPlot_Color(this.fillColor.red, this.fillColor.green, this.fillColor.blue, this.fillColor.alpha);
    other.plotStyle = this.plotStyle;
    other.lineType = this.lineType;
    other.pointType = this.pointType;
    other.lineWidth = this.lineWidth;
    other.pointLineWidth = this.pointLineWidth;
    other.pointSize = this.pointSize;
};
