import React, { useEffect, useRef } from "react";
// import Plot from '@bokeh/bokehjs/build/js/lib/models/plots'
// import ColumnDataSource from '@bokeh/bokehjs/lib/data/column_data_source.js';
// import Circle from '@bokeh/bokehjs/build/js/lib/models/glyphs/circle.js';
// import Plotting from '@bokeh/bokehjs/build/js/lib/api/plotting.js';
// import { PlotCanvas } from '@bokeh/bokehjs-react';

import Bokeh from "@bokeh/bokehjs"
import { Button } from "@bokeh/bokehjs";

// import * as Bokeh from "@bokeh/bokehjs"
// import test from '../bokeh/test'

// import { Bokeh } from "bokehjs";
// import { useEffect, useRef } from "react";
// import { Bokehjs } from "bokeh";
// import { Plot, Plotting } from "bokehjs";

export default function BokehPage() {
    // const x = Bokeh.LinAlg.linspace(-0.5, 20.5, 10);
    // console.log(x)

    const [clicks, setClicks] = useState(0);

    const handleClick = () => {
      setCicks(clicks + 1);
      console.log("Button clicked!", clicks + 1);
    };
  
    const source = new Bokeh.ColumnDataSource({
      data: { x: [1, 2, 3, 4, 5], y: [2, 5, 8, 2, 7] }
    });
  
    const plot = new Bokeh.Plot({
      title: "Example Plot",
      x_range: new Bokeh.Range1d({ start: 0, end: 6 }),
      y_range: new Bokeh.Range1d({ start: 0, end: 10 }),
      plot_width: 300,
      plot_height: 300
    });
  
    plot.add_glyph(
      new Bokeh.Line({
        x: { field: "x" },
        y: { field: "y" },
        line_color: "blue",
        line_width: 3
      }),
      source
    );
  
    return (
      <div>
        <div id="plot" />
        <Button onClick={handleClick}>Click me!</Button>
        <p>Button clicked {clicks} times</p>
      </div>
    );
}
