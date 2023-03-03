import bokeh.plotting as bop
from bokeh.plotting import figure, show
from bokeh.resources import CDN
from bokeh.embed import json_item, components, file_html
from bokeh.layouts import layout, column, row
from bokeh.models import CustomJS, ColumnDataSource, Slider, Spinner
from bokeh.sampledata.autompg import autompg
from bokeh.resources import CDN

import numpy as np

source = 0
bop.reset_output()

x = np.linspace(0, np.pi)
y = np.sin(x)
source = ColumnDataSource(data=dict(x=x, y=y))

freq = Slider(name="Frequency", start=0, end=10, value=2)
phase = Slider(name="Phase", start=0, end=np.pi)

callback = CustomJS(args=dict(source=source, val=freq),
                    code="""
    const data = source.data;
    const freq = val.value;
    const x = data['x'];
    const y = data['y'];
    for (var i = 0; i < x.length; i++) {
        y[i] = Math.sin(freq5*x[i]);
    }
    console.log(y)
    source.change.emit()
""")
freq.js_on_change('value', callback)

def sine():
    bop.reset_output()
    p = figure()
    p.line('x', 'y', source = source, line_width=3, line_alpha=0.5)
    layout = row(column(freq, width=100), p)
    return json_item(layout, "plot")
