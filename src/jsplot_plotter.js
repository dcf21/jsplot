// jsplot_plotter.js

function JSPlot_Plotter(page, graph) {
    this.page = page;
    this.graph = graph;
}

JSPlot_Plotter.prototype.data_columns_required = function(style)
 {
  if      (style === "points"         ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style === "lines"          ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style === "linespoints"    ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style === "xerrorbars"     ) return 3 + (graph.threeDimensional ? 1 : 0);
  else if (style === "yerrorbars"     ) return 3 + (graph.threeDimensional ? 1 : 0);
  else if (style === "zerrorbars"     ) return 3 + 1;
  else if (style === "xyerrorbars"    ) return 4 + (graph.threeDimensional ? 1 : 0);
  else if (style === "xzerrorbars"    ) return 4 + 1;
  else if (style === "yzerrorbars"    ) return 4 + 1;
  else if (style === "xyzerrorbars"   ) return 5 + 1;
  else if (style === "xerrorrange"    ) return 4 + (graph.threeDimensional ? 1 : 0);
  else if (style === "yerrorrange"    ) return 4 + (graph.threeDimensional ? 1 : 0);
  else if (style === "zerrorrange"    ) return 4 + 1;
  else if (style === "xyerrorrange"   ) return 6 + (graph.threeDimensional ? 1 : 0);
  else if (style === "xzerrorrange"   ) return 6 + 1;
  else if (style === "yzerrorrange"   ) return 6 + 1;
  else if (style === "xyzerrorrange"  ) return 8 + 1;
  else if (style === "upperlimits"    ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style === "lowerlimits"    ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style === "dots"           ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style === "impulses"       ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style === "boxes"          ) return 2;
  else if (style === "wboxes"         ) return 3;
  else if (style === "steps"          ) return 2;
  else if (style === "fsteps"         ) return 2;
  else if (style === "histeps"        ) return 2;
  else if (style === "arrows_head"    ) return 4 + 2*(graph.threeDimensional ? 1 : 0);
  else if (style === "arrows_nohead"  ) return 4 + 2*(graph.threeDimensional ? 1 : 0);
  else if (style === "arrows_twohead" ) return 4 + 2*(graph.threeDimensional ? 1 : 0);
  else if (style === "surface"        ) return 3;

  page.workspace.errorLog += "Unrecognised style type passed to <data_columns_required>\n";
  return -1;
 };

JSPlot_Plotter.prototype.update_axis_usage = function(data, style, a1, a2, a3)
 {
  var z;
  var ptAx, ptBx=0, ptCx=0, lasty=0;
  var ptAset=0, ptBset=0, ptCset=0;

  // Cycle through data table, ensuring that axis ranges are sufficient to include all data
  $.each(data, function(index, dataPoint) 
   {

// Simultaneously update usage with UUU and check whether position is within range
var UUF = function(X,Y)
{
 UUC(X,logaxis?exp(Y):(Y));
 UUU(X,logaxis?exp(Y):(Y));
};

// UpdateUsage... update axis X with ordinate value Y
var UUU = function(X,Y)
{
 if (InRange || PartiallyInRange)
  {
   z = Y;
   if ( (isFinite(z)) && ((X.workspace.minUsed === null) || (X.workspace.minUsed > z)) && ((X.workspace.logFinal) || (z>0.0)) ) { X.workspace.minUsed=z; }
   if ( (isFinite(z)) && ((X.workspace.maxUsed === null) || (X.workspace.maxUsed < z)) && ((X.workspace.logFinal) || (z>0.0)) ) { X.workspace.maxUsed=z; }
  }
};

// UpdateUsage... update axis X to include value of BoxFrom
var UUUBF = function(X)
{
 UUU(X,graph.boxFrom);
};

      if      (style === "points"         ) {
          if (a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]) && ((!graph.threeDimensional) || a3.in_range(dataPoint[2]))) {
              UUU(a1, dataPoint[0]);
              UUU(a2, dataPoint[1]);
              if (graph.threeDimensional) UUU(a3, dataPoint[2]);
          }
      }
      else if (style === "lines"          ) {
          if (a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]) && ((!graph.threeDimensional) || a3.in_range(dataPoint[2]))) {
              UUU(a1, dataPoint[0]);
              UUU(a2, dataPoint[1]);
              if (graph.threeDimensional) UUU(a3, dataPoint[2]);
          }
      }
      else if (style === "linespoints"    ) {
          if (a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]) && ((!graph.threeDimensional) || a3.in_range(dataPoint[2]))) {
              UUU(a1, dataPoint[0]);
              UUU(a2, dataPoint[1]);
              if (graph.threeDimensional) UUU(a3, dataPoint[2]);
          }
      }
      else if (style === "xerrorbars"     ) {
          if (a2.in_range(dataPoint[1]) && ((!graph.threeDimensional) && a3.in_range(dataPoint[2])) &&
              (a1.in_range(dataPoint[0] - dataPoint[2 + graph.threeDimensional])
               || a1.in_range(dataPoint[0])
               || a1.in_range(dataPoint[0] + dataPoint[2 + graph.threeDimensional])
              )) {
              UUU(a1, dataPoint[0]);
              UUU(a1, dataPoint[0] - dataPoint[2 + graph.threeDimensional]);
              UUU(a1, dataPoint[0] + dataPoint[2 + graph.threeDimensional]);
              UUU(a2, dataPoint[1]);
              if (graph.threeDimensional) UUU(a3, dataPoint[2]);
          }
      }
      else if (style === "yerrorbars"     ) {
          if (a1.in_range(dataPoint[0]) && ((!graph.threeDimensional) && a3.in_range(dataPoint[2])) &&
              (a2.in_range(dataPoint[1] - dataPoint[2 + graph.threeDimensional])
                  || a2.in_range(dataPoint[1])
                  || a2.in_range(dataPoint[1] + dataPoint[2 + graph.threeDimensional])
              )) {
              UUU(a1, dataPoint[0]);
              UUU(a2, dataPoint[1]);
              UUU(a2, dataPoint[1] - dataPoint[2 + graph.threeDimensional]);
              UUU(a2, dataPoint[1] + dataPoint[2 + graph.threeDimensional]);
              if (graph.threeDimensional) UUU(a3, dataPoint[2]);
          }
      }
      else if (style === "zerrorbars"     ) {
          if (a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]) &&
              (a3.in_range(dataPoint[2])
                  || a3.in_range(dataPoint[2] - dataPoint[3])
                  || a3.in_range(dataPoint[2] + dataPoint[3])
              )) {
              UUU(a1, dataPoint[0]);
              UUU(a2, dataPoint[1]);
              UUU(a3, dataPoint[2]);
              UUU(a3, dataPoint[2] - dataPoint[3]);
              UUU(a3, dataPoint[2] + dataPoint[3]);
          }
      }
      else if (style === "xyerrorbars"    ) {
          if (((!graph.threeDimensional) || a3.in_range(dataPoint[2])) &&
              ((a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1] - dataPoint[3 + graph.threeDimensional]))
               || (a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]))
               || (a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1] + dataPoint[3 + graph.threeDimensional]))
               || (a1.in_range(dataPoint[0] - dataPoint[2 + graph.threeDimensional]) && a2.in_range(dataPoint[1]))
               || (a1.in_range(dataPoint[0] + dataPoint[2 + graph.threeDimensional]) && a2.in_range(dataPoint[1]))
              )) {
              UUU(a1, dataPoint[0]);
              UUU(a1, dataPoint[0] - dataPoint[2 + graph.threeDimensional]);
              UUU(a1, dataPoint[0] + dataPoint[2 + graph.threeDimensional]);
              UUU(a2, dataPoint[1]);
              UUU(a2, dataPoint[1] - dataPoint[3 + graph.threeDimensional]);
              UUU(a2, dataPoint[1] + dataPoint[3 + graph.threeDimensional]);
              if (graph.threeDimensional) UUU(a3, dataPoint[2]);
          }
      }
      else if (style === "xzerrorbars"    ) {
          if (a2.in_range(dataPoint[1]) &&
              ((a1.in_range(dataPoint[0]) && a3.in_range(dataPoint[2] - dataPoint[4]))
                  || (a1.in_range(dataPoint[0]) && a3.in_range(dataPoint[2]))
                  || (a1.in_range(dataPoint[0]) && a3.in_range(dataPoint[2] + dataPoint[4]))
                  || (a1.in_range(dataPoint[0] - dataPoint[3]) && a3.in_range(dataPoint[2]))
                  || (a1.in_range(dataPoint[0] + dataPoint[3]) && a3.in_range(dataPoint[2]))
              )) {
              UUU(a1, dataPoint[0]);
              UUU(a1, dataPoint[0] - dataPoint[3]);
              UUU(a1, dataPoint[0] + dataPoint[3]);
              UUU(a2, dataPoint[1]);
              UUU(a3, dataPoint[2]);
              UUU(a3, dataPoint[2] - dataPoint[4]);
              UUU(a3, dataPoint[2] + dataPoint[4]);
          }
      }
      else if (style === "yzerrorbars"    ) { if ( a1.in_range(dataPoint[0]) && (a2.in_range( dataPoint[1]       ) && a3.in_range(dataPoint[2]-dataPoint[4])
                                                                     ) || (a2.in_range( dataPoint[1]       ) && a3.in_range(dataPoint[2]       )
                                                                     ) || (a2.in_range( dataPoint[1]       ) && a3.in_range(dataPoint[2]+dataPoint[4])
                                                                     ) || (a2.in_range( dataPoint[1]-dataPoint[3]) && a3.in_range(dataPoint[2]       )
                                                                     ) || (a2.in_range( dataPoint[1]+dataPoint[3]) && a3.in_range(dataPoint[2]       )
                                                    UUU(a1, dataPoint[0]); UUU(a2, dataPoint[1]); UUU(a2, dataPoint[1]-dataPoint[3]); UUU(a2, dataPoint[1]+dataPoint[3]); UUU(a3, dataPoint[2]); UUU(a3, dataPoint[2]-dataPoint[4]); UUU(a3, dataPoint[2]+dataPoint[4]); }
      else if (style === "xyzerrorbars"   ) { if ( a1.in_range(dataPoint[0]       ) && a2.in_range(dataPoint[1]       ) && a3.in_range(dataPoint[2]-dataPoint[5])
                                                    ) || (a1.in_range( dataPoint[0]       ) && a2.in_range(dataPoint[1]       ) && a3.in_range(dataPoint[2]       )
                                                    ) || (a1.in_range( dataPoint[0]       ) && a2.in_range(dataPoint[1]       ) && a3.in_range(dataPoint[2]+dataPoint[5])
                                                    ) || (a1.in_range( dataPoint[0]       ) && a2.in_range(dataPoint[1]-dataPoint[4]) && a3.in_range(dataPoint[2]       )
                                                    ) || (a1.in_range( dataPoint[0]       ) && a2.in_range(dataPoint[1]+dataPoint[4]) && a3.in_range(dataPoint[2]       )
                                                    ) || (a1.in_range( dataPoint[0]-dataPoint[3]) && a2.in_range(dataPoint[1]       ) && a3.in_range(dataPoint[2]       )
                                                    ) || (a1.in_range( dataPoint[0]+dataPoint[3]) && a2.in_range(dataPoint[1]       ) && a3.in_range(dataPoint[2]       )
                                                    UUU(a1, dataPoint[0]); UUU(a1, dataPoint[0]-dataPoint[3]); UUU(a1, dataPoint[0]+dataPoint[3]); UUU(a2, dataPoint[1]); UUU(a2, dataPoint[1]-dataPoint[4]); UUU(a2, dataPoint[1]+dataPoint[4]); UUU(a3, dataPoint[2]); UUU(a3, dataPoint[2]-dataPoint[5]); UUU(a3, dataPoint[2]+dataPoint[5]); }
      else if (style === "xerrorrange"    ) { if ( a2.in_range(dataPoint[1]) if (graph.threeDimensional) && a3.in_range(dataPoint[2]) && (a1.in_range( dataPoint[2+graph.threeDimensional])
                                                                                                    ) || (a1.in_range( dataPoint[0]         )
                                                                                                    ) || (a1.in_range( dataPoint[3+graph.threeDimensional])
                                                    UUU(a1, dataPoint[0]); UUU(a2, dataPoint[1]); UUU(a1, dataPoint[2+graph.threeDimensional]); UUU(a1, dataPoint[3+graph.threeDimensional]); if (graph.threeDimensional) UUU(a3, dataPoint[2]); }
      else if (style === "yerrorrange"    ) { if ( a1.in_range(dataPoint[0]) if (graph.threeDimensional) && a3.in_range(dataPoint[2]) && (a2.in_range( dataPoint[2+graph.threeDimensional])
                                                                                                    ) || (a2.in_range( dataPoint[1]         )
                                                                                                    ) || (a2.in_range( dataPoint[3+graph.threeDimensional])
                                                    UUU(a1, dataPoint[0]); UUU(a2, dataPoint[1]); UUU(a2, dataPoint[2+graph.threeDimensional]); UUU(a2, dataPoint[3+graph.threeDimensional]); if (graph.threeDimensional) UUU(a3, dataPoint[2]); }
      else if (style === "zerrorrange"    ) { if ( a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]) && (a3.in_range( dataPoint[2]) ) || (a3.in_range( dataPoint[3]) ) || (a3.in_range( dataPoint[4])
                                                    UUU(a1, dataPoint[0]); UUU(a2, dataPoint[1]); UUU(a3, dataPoint[2]); UUU(a3, dataPoint[3]); UUU(a3, dataPoint[4]); }
      else if (style === "xyerrorrange"   ) { if (graph.threeDimensional) && a3.in_range(dataPoint[2]) && (a1.in_range( dataPoint[0]         ) && a2.in_range(dataPoint[4+graph.threeDimensional])
                                                                                   ) || (a1.in_range( dataPoint[0]         ) && a2.in_range(dataPoint[1]         )
                                                                                   ) || (a1.in_range( dataPoint[0]         ) && a2.in_range(dataPoint[5+graph.threeDimensional])
                                                                                   ) || (a1.in_range( dataPoint[2+graph.threeDimensional]) && a2.in_range(dataPoint[1]         )
                                                                                   ) || (a1.in_range( dataPoint[3+graph.threeDimensional]) && a2.in_range(dataPoint[1]         )
                                                    UUU(a1, dataPoint[0]); UUU(a2, dataPoint[1]); UUU(a1, dataPoint[2+graph.threeDimensional]); UUU(a1, dataPoint[3+graph.threeDimensional]); UUU(a2, dataPoint[4+graph.threeDimensional]); UUU(a2, dataPoint[5+graph.threeDimensional]); if (graph.threeDimensional) UUU(a3, dataPoint[2]); }
      else if (style === "xzerrorrange"   ) { if ( a2.in_range(dataPoint[1]) && (a1.in_range( dataPoint[0]) && a3.in_range(dataPoint[5])
                                                                     ) || (a1.in_range( dataPoint[0]) && a3.in_range(dataPoint[2])
                                                                     ) || (a1.in_range( dataPoint[0]) && a3.in_range(dataPoint[6])
                                                                     ) || (a1.in_range( dataPoint[3]) && a3.in_range(dataPoint[2])
                                                                     ) || (a1.in_range( dataPoint[4]) && a3.in_range(dataPoint[2])
                                                    UUU(a2, dataPoint[1]); UUU(a1, dataPoint[0]); UUU(a1, dataPoint[3]); UUU(a1, dataPoint[4]); UUU(a3, dataPoint[2]); UUU(a3, dataPoint[5]); UUU(a3, dataPoint[6]); }
      else if (style === "yzerrorrange"   ) { if ( a1.in_range(dataPoint[0]) && (a2.in_range( dataPoint[1]) && a3.in_range(dataPoint[5])
                                                                     ) || (a2.in_range( dataPoint[1]) && a3.in_range(dataPoint[2])
                                                                     ) || (a2.in_range( dataPoint[1]) && a3.in_range(dataPoint[6])
                                                                     ) || (a2.in_range( dataPoint[3]) && a3.in_range(dataPoint[2])
                                                                     ) || (a2.in_range( dataPoint[4]) && a3.in_range(dataPoint[2])
                                                    UUU(a1, dataPoint[0]); UUU(a1, dataPoint[3]); UUU(a1, dataPoint[4]); UUU(a2, dataPoint[1]); UUU(a2, dataPoint[5]); UUU(a2, dataPoint[6]); UUU(a3, dataPoint[2]); UUU(a3, dataPoint[7]); UUU(a3, dataPoint[8]); }
      else if (style === "xyzerrorrange"  ) { if ( a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]) && a3.in_range(dataPoint[7])
                                                    ) || (a1.in_range( dataPoint[0]) && a2.in_range(dataPoint[1]) && a3.in_range(dataPoint[2])
                                                    ) || (a1.in_range( dataPoint[0]) && a2.in_range(dataPoint[1]) && a3.in_range(dataPoint[8])
                                                    ) || (a1.in_range( dataPoint[0]) && a2.in_range(dataPoint[5]) && a3.in_range(dataPoint[2])
                                                    ) || (a1.in_range( dataPoint[0]) && a2.in_range(dataPoint[6]) && a3.in_range(dataPoint[2])
                                                    ) || (a1.in_range( dataPoint[3]) && a2.in_range(dataPoint[1]) && a3.in_range(dataPoint[2])
                                                    ) || (a1.in_range( dataPoint[4]) && a2.in_range(dataPoint[1]) && a3.in_range(dataPoint[2])
                                                    UUU(a1, dataPoint[0]); UUU(a1, dataPoint[0]-dataPoint[3]); UUU(a1, dataPoint[0]+dataPoint[3]); UUU(a2, dataPoint[1]); UUU(a2, dataPoint[1]-dataPoint[4]); UUU(a2, dataPoint[1]+dataPoint[4]); UUU(a3, dataPoint[2]); UUU(a3, dataPoint[2]-dataPoint[5]); UUU(a3, dataPoint[2]+dataPoint[5]); }
      else if (style === "lowerlimits"    ) { if ( a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]) if (graph.threeDimensional) && a3.in_range(dataPoint[2])
                                                    UUU(a1, dataPoint[0]); UUU(a2, dataPoint[1]); if (graph.threeDimensional) UUU(a3, dataPoint[2]); }
      else if (style === "upperlimits"    ) { if ( a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]) if (graph.threeDimensional) && a3.in_range(dataPoint[2])
                                                    UUU(a1, dataPoint[0]); UUU(a2, dataPoint[1]); if (graph.threeDimensional) UUU(a3, dataPoint[2]); }
      else if (style === "dots"           ) { if ( a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]) if (graph.threeDimensional) && a3.in_range(dataPoint[2])
                                                    UUU(a1, dataPoint[0]); UUU(a2, dataPoint[1]); if (graph.threeDimensional) UUU(a3, dataPoint[2]); }
      else if (style === "impulses"       ) { if ( a1.in_range(dataPoint[0]) && a2.in_range(dataPoint[1]) if (graph.threeDimensional) && a3.in_range(dataPoint[2])
                                                    UUU(a1, dataPoint[0]); UUU(a2, dataPoint[1]); if (graph.threeDimensional) UUU(a3, dataPoint[2]); UUUBF(a2); }
      else if (style === "wboxes"         ) { if ( a2.in_range(dataPoint[1]) && (a1.in_range( dataPoint[0]) ) || (a1.in_range( dataPoint[0]-dataPoint[2]) ) || (a1.in_range( dataPoint[0]+dataPoint[2])
                                                    UUU(a2, dataPoint[1]); UUU(a1, dataPoint[0]); UUU(a1, dataPoint[0]-dataPoint[2]); UUU(a1, dataPoint[0]+dataPoint[2]); UUUBF(a2); }
      else if ((style === "arrows_head") || (style === "arrows_nohead") || (style === "arrows_twohead"))
                                                  { && a1.in_range(dataPoint[0         ]) && a2.in_range(dataPoint[1         ]) if (graph.threeDimensional) && a3.in_range(dataPoint[2])
                                                    ) || (a1.in_range( dataPoint[2+graph.threeDimensional]) && a2.in_range(dataPoint[3+graph.threeDimensional]) if (graph.threeDimensional) && a3.in_range(dataPoint[5])
                                                    UUU(a1, dataPoint[0]); UUU(a2, dataPoint[1]); UUU(a1, dataPoint[2+graph.threeDimensional]); UUU(a2, dataPoint[3+graph.threeDimensional]); if (graph.threeDimensional) { UUU(a3, dataPoint[2]); UUU(a3, dataPoint[5]); } }
};

  return 0;
 }

