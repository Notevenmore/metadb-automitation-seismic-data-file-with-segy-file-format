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
# source = ColumnDataSource(data=dict(x=x, y=y))

def sine(source=source):
    # source = ColumnDataSource(data=dict(x=x, y=y))
    freq = Slider(name="Frequency", start=0, end=100, value=2, step=1)
    callback = CustomJS(args=dict(source=source, val=freq),
                        code="""
        const data = source.data;
        const freq = val.value;
        const x = data['x'];
        const y = data['y'];
        for (var i = 0; i < x.length; i++) {
            y[i] = Math.sin(freq*x[i]);
        }
        source.change.emit()
    """)
    freq.js_on_change('value', callback)

    p = figure()
    p.line('x', 'y', source = source, line_width=3, line_alpha=0.5)
    layout = row(column(freq, width=100), p)
    return json_item(layout, "plot")

def cosine():
    source = ColumnDataSource(data=dict(x=x, y=y))
    freq = Slider(name="Frequency", start=0, end=10, value=2)
    callback = CustomJS(args=dict(source=source, val=freq),
                        code="""
        const data = source.data;
        const freq = val.value;
        const x = data['x'];
        const y = data['y'];
        for (var i = 0; i < x.length; i++) {
            y[i] = Math.cos(freq*x[i]);
        }
        console.log(y)
        source.change.emit()
    """)
    freq.js_on_change('value', callback)

    p = figure()
    p.line('x', 'y', source = source, line_width=3, line_alpha=0.5)
    layout = row(column(freq, width=100), p)
    return json_item(layout, "plot")

def tan():
    source = ColumnDataSource(data=dict(x=x, y=y))
    freq = Slider(name="Frequency", start=0, end=10, value=2)
    callback = CustomJS(args=dict(source=source, val=freq),
                        code="""
        const data = source.data;
        const freq = val.value;
        const x = data['x'];
        const y = data['y'];
        for (var i = 0; i < x.length; i++) {
            y[i] = Math.cos(freq*x[i]);
        }
        console.log(y)
        source.change.emit()
    """)
    freq.js_on_change('value', callback)

    p = figure()
    p.line('x', 'y', source = source, line_width=3, line_alpha=0.5)
    layout = row(column(freq, width=100), p)
    return json_item(layout, "plot")

# def allFunc():
