// jsplot_styles.js

function JSPlot_PlotStyles_NDataColumns(graph, style)
 {
  if      (style == "points"         ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style == "lines"          ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style == "linespoints"    ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style == "xerrorbars"     ) return 3 + (graph.threeDimensional ? 1 : 0);
  else if (style == "yerrorbars"     ) return 3 + (graph.threeDimensional ? 1 : 0);
  else if (style == "zerrorbars"     ) return 3 + 1;
  else if (style == "xyerrorbars"    ) return 4 + (graph.threeDimensional ? 1 : 0);
  else if (style == "xzerrorbars"    ) return 4 + 1;
  else if (style == "yzerrorbars"    ) return 4 + 1;
  else if (style == "xyzerrorbars"   ) return 5 + 1;
  else if (style == "xerrorrange"    ) return 4 + (graph.threeDimensional ? 1 : 0);
  else if (style == "yerrorrange"    ) return 4 + (graph.threeDimensional ? 1 : 0);
  else if (style == "zerrorrange"    ) return 4 + 1;
  else if (style == "xyerrorrange"   ) return 6 + (graph.threeDimensional ? 1 : 0);
  else if (style == "xzerrorrange"   ) return 6 + 1;
  else if (style == "yzerrorrange"   ) return 6 + 1;
  else if (style == "xyzerrorrange"  ) return 8 + 1;
  else if (style == "upperlimits"    ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style == "lowerlimits"    ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style == "dots"           ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style == "impulses"       ) return 2 + (graph.threeDimensional ? 1 : 0);
  else if (style == "boxes"          ) return 2;
  else if (style == "wboxes"         ) return 3;
  else if (style == "steps"          ) return 2;
  else if (style == "fsteps"         ) return 2;
  else if (style == "histeps"        ) return 2;
  else if (style == "arrows_head"    ) return 4 + 2*(graph.threeDimensional ? 1 : 0);
  else if (style == "arrows_nohead"  ) return 4 + 2*(graph.threeDimensional ? 1 : 0);
  else if (style == "arrows_twohead" ) return 4 + 2*(graph.threeDimensional ? 1 : 0);
  else if (style == "surface"        ) return 3;

  graph.errorLog += "Unrecognised style type passed to <JSPlot_PlotStyles_NDataColumns>";
  return -1;
 }

function JSPlot_PlotStyles_UpdateUsage(graph, data, style, a1, a2, a3)
 {
  var z;
  var ptAx, ptBx=0, ptCx=0, lasty=0;
  var ptAset=0, ptBset=0, ptCset=0;

  if ((data==NULL) || (data->Nrows<1)) return 0; // No data present

  // Cycle through data table, ensuring that axis ranges are sufficient to include all data
  $.each(data, function(index, dataPoint) 
   {

  var InRange, PartiallyInRange, InRangeMemory;

// UpdateUsage... get content of row X from data table
var UUR = function(X) { return dataPoint[X]; }

// UpdateUsage... check whether position is within range of axis
var UUC = function(X,Y)
{
 if (InRange && (!eps_plot_axis_InRange(X,Y))) InRange=0;
}

// Memory recall on within-range flag, adding previous flag to ORed list of points to be checked
var UUD = function(X,Y)
{
 PartiallyInRange = PartiallyInRange || InRange;
 InRange = InRangeMemory;
 UUC(X,Y);
}

// Store current within-range flag to memory
var UUE = function(X,Y)
{
 InRangeMemory = InRange;
 UUC(X,Y);
}

// Simultaneously update usage with UUU and check whether position is within range
var UUF = function(X,Y)
{
 UUC(X,logaxis?exp(Y):(Y))
 UUU(X,logaxis?exp(Y):(Y))
}

// Reset flags used to test whether a datapoint is within range before using it to update ranges of other axes
var UUC_RESET = function()
{
 InRange=1; PartiallyInRange=0; InRangeMemory=1;
}

// UpdateUsage... update axis X with ordinate value Y
var UUU = function(X,Y)
{
 if (InRange || PartiallyInRange)
  {
   z = Y;
   if ( (gsl_finite(z)) && ((!X->MinUsedSet) || (X->MinUsed > z)) && ((X->LogFinal) || (z>0.0)) ) { X->MinUsedSet=1; X->MinUsed=z; }
   if ( (gsl_finite(z)) && ((!X->MaxUsedSet) || (X->MaxUsed < z)) && ((X->LogFinal) || (z>0.0)) ) { X->MaxUsedSet=1; X->MaxUsed=z; }
  }
}

// UpdateUsage... update axis X to include value of BoxFrom
var UUUBF = function(X)
{
 if (!(X->DataUnitSet && (!ppl_unitsDimEqual(&sg->BoxFrom, &X->DataUnit)))) UUU(X,sg->BoxFrom.real);
}


      UUC_RESET();
      if      (style == "points"         ) { UUC(a1, UUR(0)); UUC(a2, UUR(1)); if (graph.threeDimensional) UUC(a3, UUR(2));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "lines"          ) { UUC(a1, UUR(0)); UUC(a2, UUR(1)); if (graph.threeDimensional) UUC(a3, UUR(2));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "linespoints"    ) { UUC(a1, UUR(0)); UUC(a2, UUR(1)); if (graph.threeDimensional) UUC(a3, UUR(2));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "xerrorbars"     ) { UUC(a2, UUR(1)); if (graph.threeDimensional) UUC(a3, UUR(2)); UUE(a1, UUR(0)-UUR(2+graph.threeDimensional));
                                                                                                    UUD(a1, UUR(0)                );
                                                                                                    UUD(a1, UUR(0)+UUR(2+graph.threeDimensional));
                                                    UUU(a1, UUR(0)); UUU(a1, UUR(0)-UUR(2+graph.threeDimensional)); UUU(a1, UUR(0)+UUR(2+graph.threeDimensional)); UUU(a2, UUR(1)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "yerrorbars"     ) { UUC(a1, UUR(0)); if (graph.threeDimensional) UUC(a3, UUR(2)); UUE(a2, UUR(1)-UUR(2+graph.threeDimensional));
                                                                                                    UUD(a2, UUR(1)                );
                                                                                                    UUD(a2, UUR(1)+UUR(2+graph.threeDimensional));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); UUU(a2, UUR(1)-UUR(2+graph.threeDimensional)); UUU(a2, UUR(1)+UUR(2+graph.threeDimensional)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "zerrorbars"     ) { UUC(a1, UUR(0)); UUC(a2, UUR(1)); UUE(a3, UUR(2)); UUD(a3, UUR(2)-UUR(3)); UUD(a3, UUR(2)+UUR(3));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); UUU(a3, UUR(2)); UUU(a3, UUR(2)-UUR(3)); UUU(a3, UUR(2)+UUR(3)); }
      else if (style == "xyerrorbars"    ) { if (graph.threeDimensional) UUC(a3, UUR(2)); UUE(a1, UUR(0)                ); UUC(a2, UUR(1)-UUR(3+graph.threeDimensional));
                                                                                   UUD(a1, UUR(0)                ); UUC(a2, UUR(1)                );
                                                                                   UUD(a1, UUR(0)                ); UUC(a2, UUR(1)+UUR(3+graph.threeDimensional));
                                                                                   UUD(a1, UUR(0)-UUR(2+graph.threeDimensional)); UUC(a2, UUR(1)                );
                                                                                   UUD(a1, UUR(0)+UUR(2+graph.threeDimensional)); UUC(a2, UUR(1)                );
                                                    UUU(a1, UUR(0)); UUU(a1, UUR(0)-UUR(2+graph.threeDimensional)); UUU(a1, UUR(0)+UUR(2+graph.threeDimensional)); UUU(a2, UUR(1)); UUU(a2, UUR(1)-UUR(3+graph.threeDimensional)); UUU(a2, UUR(1)+UUR(3+graph.threeDimensional)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "xzerrorbars"    ) { UUC(a2, UUR(1)); UUE(a1, UUR(0)       ); UUC(a3, UUR(2)-UUR(4));
                                                                     UUD(a1, UUR(0)       ); UUC(a3, UUR(2)       );
                                                                     UUD(a1, UUR(0)       ); UUC(a3, UUR(2)+UUR(4));
                                                                     UUD(a1, UUR(0)-UUR(3)); UUC(a3, UUR(2)       );
                                                                     UUD(a1, UUR(0)+UUR(3)); UUC(a3, UUR(2)       );
                                                    UUU(a1, UUR(0)); UUU(a1, UUR(0)-UUR(3)); UUU(a1, UUR(0)+UUR(3)); UUU(a2, UUR(1)); UUU(a3, UUR(2)); UUU(a3, UUR(2)-UUR(4)); UUU(a3, UUR(2)+UUR(4)); }
      else if (style == "yzerrorbars"    ) { UUC(a1, UUR(0)); UUE(a2, UUR(1)       ); UUC(a3, UUR(2)-UUR(4));
                                                                     UUD(a2, UUR(1)       ); UUC(a3, UUR(2)       );
                                                                     UUD(a2, UUR(1)       ); UUC(a3, UUR(2)+UUR(4));
                                                                     UUD(a2, UUR(1)-UUR(3)); UUC(a3, UUR(2)       );
                                                                     UUD(a2, UUR(1)+UUR(3)); UUC(a3, UUR(2)       );
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); UUU(a2, UUR(1)-UUR(3)); UUU(a2, UUR(1)+UUR(3)); UUU(a3, UUR(2)); UUU(a3, UUR(2)-UUR(4)); UUU(a3, UUR(2)+UUR(4)); }
      else if (style == "xyzerrorbars"   ) { UUC(a1, UUR(0)       ); UUC(a2, UUR(1)       ); UUC(a3, UUR(2)-UUR(5));
                                                    UUD(a1, UUR(0)       ); UUC(a2, UUR(1)       ); UUC(a3, UUR(2)       );
                                                    UUD(a1, UUR(0)       ); UUC(a2, UUR(1)       ); UUC(a3, UUR(2)+UUR(5));
                                                    UUD(a1, UUR(0)       ); UUC(a2, UUR(1)-UUR(4)); UUC(a3, UUR(2)       );
                                                    UUD(a1, UUR(0)       ); UUC(a2, UUR(1)+UUR(4)); UUC(a3, UUR(2)       );
                                                    UUD(a1, UUR(0)-UUR(3)); UUC(a2, UUR(1)       ); UUC(a3, UUR(2)       );
                                                    UUD(a1, UUR(0)+UUR(3)); UUC(a2, UUR(1)       ); UUC(a3, UUR(2)       );
                                                    UUU(a1, UUR(0)); UUU(a1, UUR(0)-UUR(3)); UUU(a1, UUR(0)+UUR(3)); UUU(a2, UUR(1)); UUU(a2, UUR(1)-UUR(4)); UUU(a2, UUR(1)+UUR(4)); UUU(a3, UUR(2)); UUU(a3, UUR(2)-UUR(5)); UUU(a3, UUR(2)+UUR(5)); }
      else if (style == "xerrorrange"    ) { UUC(a2, UUR(1)); if (graph.threeDimensional) UUC(a3, UUR(2)); UUE(a1, UUR(2+graph.threeDimensional));
                                                                                                    UUD(a1, UUR(0)         );
                                                                                                    UUD(a1, UUR(3+graph.threeDimensional));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); UUU(a1, UUR(2+graph.threeDimensional)); UUU(a1, UUR(3+graph.threeDimensional)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "yerrorrange"    ) { UUC(a1, UUR(0)); if (graph.threeDimensional) UUC(a3, UUR(2)); UUE(a2, UUR(2+graph.threeDimensional));
                                                                                                    UUD(a2, UUR(1)         );
                                                                                                    UUD(a2, UUR(3+graph.threeDimensional));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); UUU(a2, UUR(2+graph.threeDimensional)); UUU(a2, UUR(3+graph.threeDimensional)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "zerrorrange"    ) { UUC(a1, UUR(0)); UUC(a2, UUR(1)); UUE(a3, UUR(2)); UUD(a3, UUR(3)); UUD(a3, UUR(4));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); UUU(a3, UUR(2)); UUU(a3, UUR(3)); UUU(a3, UUR(4)); }
      else if (style == "xyerrorrange"   ) { if (graph.threeDimensional) UUC(a3, UUR(2)); UUE(a1, UUR(0)         ); UUC(a2, UUR(4+graph.threeDimensional));
                                                                                   UUD(a1, UUR(0)         ); UUC(a2, UUR(1)         );
                                                                                   UUD(a1, UUR(0)         ); UUC(a2, UUR(5+graph.threeDimensional));
                                                                                   UUD(a1, UUR(2+graph.threeDimensional)); UUC(a2, UUR(1)         );
                                                                                   UUD(a1, UUR(3+graph.threeDimensional)); UUC(a2, UUR(1)         );
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); UUU(a1, UUR(2+graph.threeDimensional)); UUU(a1, UUR(3+graph.threeDimensional)); UUU(a2, UUR(4+graph.threeDimensional)); UUU(a2, UUR(5+graph.threeDimensional)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "xzerrorrange"   ) { UUC(a2, UUR(1)); UUE(a1, UUR(0)); UUC(a3, UUR(5));
                                                                     UUD(a1, UUR(0)); UUC(a3, UUR(2));
                                                                     UUD(a1, UUR(0)); UUC(a3, UUR(6));
                                                                     UUD(a1, UUR(3)); UUC(a3, UUR(2));
                                                                     UUD(a1, UUR(4)); UUC(a3, UUR(2));
                                                    UUU(a2, UUR(1)); UUU(a1, UUR(0)); UUU(a1, UUR(3)); UUU(a1, UUR(4)); UUU(a3, UUR(2)); UUU(a3, UUR(5)); UUU(a3, UUR(6)); }
      else if (style == "yzerrorrange"   ) { UUC(a1, UUR(0)); UUE(a2, UUR(1)); UUC(a3, UUR(5));
                                                                     UUD(a2, UUR(1)); UUC(a3, UUR(2));
                                                                     UUD(a2, UUR(1)); UUC(a3, UUR(6));
                                                                     UUD(a2, UUR(3)); UUC(a3, UUR(2));
                                                                     UUD(a2, UUR(4)); UUC(a3, UUR(2));
                                                    UUU(a1, UUR(0)); UUU(a1, UUR(3)); UUU(a1, UUR(4)); UUU(a2, UUR(1)); UUU(a2, UUR(5)); UUU(a2, UUR(6)); UUU(a3, UUR(2)); UUU(a3, UUR(7)); UUU(a3, UUR(8)); }
      else if (style == "xyzerrorrange"  ) { UUC(a1, UUR(0)); UUC(a2, UUR(1)); UUC(a3, UUR(7));
                                                    UUD(a1, UUR(0)); UUC(a2, UUR(1)); UUC(a3, UUR(2));
                                                    UUD(a1, UUR(0)); UUC(a2, UUR(1)); UUC(a3, UUR(8));
                                                    UUD(a1, UUR(0)); UUC(a2, UUR(5)); UUC(a3, UUR(2));
                                                    UUD(a1, UUR(0)); UUC(a2, UUR(6)); UUC(a3, UUR(2));
                                                    UUD(a1, UUR(3)); UUC(a2, UUR(1)); UUC(a3, UUR(2));
                                                    UUD(a1, UUR(4)); UUC(a2, UUR(1)); UUC(a3, UUR(2));
                                                    UUU(a1, UUR(0)); UUU(a1, UUR(0)-UUR(3)); UUU(a1, UUR(0)+UUR(3)); UUU(a2, UUR(1)); UUU(a2, UUR(1)-UUR(4)); UUU(a2, UUR(1)+UUR(4)); UUU(a3, UUR(2)); UUU(a3, UUR(2)-UUR(5)); UUU(a3, UUR(2)+UUR(5)); }
      else if (style == "lowerlimits"    ) { UUC(a1, UUR(0)); UUC(a2, UUR(1)); if (graph.threeDimensional) UUC(a3, UUR(2));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "upperlimits"    ) { UUC(a1, UUR(0)); UUC(a2, UUR(1)); if (graph.threeDimensional) UUC(a3, UUR(2));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "dots"           ) { UUC(a1, UUR(0)); UUC(a2, UUR(1)); if (graph.threeDimensional) UUC(a3, UUR(2));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); if (graph.threeDimensional) UUU(a3, UUR(2)); }
      else if (style == "impulses"       ) { UUC(a1, UUR(0)); UUC(a2, UUR(1)); if (graph.threeDimensional) UUC(a3, UUR(2));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); if (graph.threeDimensional) UUU(a3, UUR(2)); UUUBF(a2); }
      else if (style == "wboxes"         ) { UUC(a2, UUR(1)); UUE(a1, UUR(0)); UUD(a1, UUR(0)-UUR(2)); UUD(a1, UUR(0)+UUR(2));
                                                    UUU(a2, UUR(1)); UUU(a1, UUR(0)); UUU(a1, UUR(0)-UUR(2)); UUU(a1, UUR(0)+UUR(2)); UUUBF(a2); }
      else if ((style == "arrows_head") || (style == "arrows_nohead") || (style == "arrows_twohead"))
                                                  { UUC(a1, UUR(0         )); UUC(a2, UUR(1         )); if (graph.threeDimensional) UUC(a3, UUR(2));
                                                    UUD(a1, UUR(2+graph.threeDimensional)); UUC(a2, UUR(3+graph.threeDimensional)); if (graph.threeDimensional) UUC(a3, UUR(5));
                                                    UUU(a1, UUR(0)); UUU(a2, UUR(1)); UUU(a1, UUR(2+graph.threeDimensional)); UUU(a2, UUR(3+graph.threeDimensional)); if (graph.threeDimensional) { UUU(a3, UUR(2)); UUU(a3, UUR(5)); } }
}
  return 0;
 }

