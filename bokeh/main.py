from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from starlette.responses import HTMLResponse

import bokeh.plotting as bop
from bokeh.plotting import figure, show
from bokeh.resources import CDN
from bokeh.embed import json_item, components, file_html
from bokeh.layouts import layout, column, row
from bokeh.models import CustomJS, ColumnDataSource, Slider, Spinner
from bokeh.sampledata.autompg import autompg
from bokeh.resources import CDN
import json

import panel as pn

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Bokeh python for frontend"
)

origins = [
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello world"}

@app.get("/test")
async def test():
    x = [x*0.005 for x in range(0, 200)]
    y = x

    # create a new plot with a title and axis labels
    p = figure(title="Simple line example", x_axis_label="x", y_axis_label="y")

    # add a line renderer with legend and line thickness
    p.line(x, y, legend_label="Temp.", line_width=2)

    # show the results
    return json_item(p, "#plot")

@app.get("/test2")
async def test2():
    x = [x*0.005 for x in range(0, 200)]
    y = x

    p = figure(title="Simple line example", x_axis_label="x", y_axis_label="y")

    # add a line renderer with legend and line thickness
    points = p.circle(x=x, y=y, size=30, fill_color="#21a7df")
    spinner = Spinner(title="Glyph size", low=1, high=40, step=0.5, value=4, width=80)
    spinner.js_link('value', points.glyph, 'size')

    layout = row(column(spinner, width=100), p)

    return json_item(layout, "#plot")

class JsonButton(pn.widgets.Button):
    def to_dict(self):
        button_dict = super().to_dict()
        button_dict["clicks"] = self.clicks
        return button_dict

@app.route("/test-callback")
def buttonCallback(event):
    print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

buttonPanel = JsonButton(name='Click me!', button_type='primary').get_root()
# buttonPanel.on_click(buttonCallback)
buttonPanel.js_on_click(CustomJS(args=dict(button=buttonPanel), code="""
    fetch('/test-callback', {method: 'GET'})
"""))

layoutButton = pn.Column(buttonPanel)
# layoutButton.servable()
@app.get("/widgets")
async def widgets():
    # button_dict = buttonPanel.to_dict()
    # button_json = json.dumps(button_dict)
    # return button_json
    script,html = components(buttonPanel)
    # return json_item(buttonPanel, '#plot')
    return file_html(buttonPanel, CDN, "my plot")
    # return html

import numpy as np

bop.reset_output()
def sourcee():
    x5 = np.linspace(0, np.pi)
    y5 = np.sin(x5)
    source5 = ColumnDataSource(data=dict(x=x5, y=y5))
    return source5

def sliding(source):
    freq = Slider(name="Frequency", start=0, end=10, value=2)
    phase = Slider(name="Phase", start=0, end=np.pi)

    callback5 = CustomJS(args=dict(source=source, val=freq),
                        code="""
        const data5 = source.data;
        const freq5 = val.value;
        const x = data5['x'];
        const y = data5['y'];
        for (var i = 0; i < x.length; i++) {
            y[i] = Math.sin(freq5*x[i]);
        }
        console.log(y)
        source.change.emit()
    """)
    freq.js_on_change('value', callback5)
    return freq

def sine():
    source5 = sourcee()
    bop.reset_output()
    p5 = figure()
    p5.line('x', 'y', source = source5, line_width=3, line_alpha=0.5)
    freq = sliding(source5)
    return p5, freq

# sine = pn.bind(sine, freq = freq, phase = phase)

@app.get("/try-fastgrid")
async def fastGrid(): 
    # temp = row(phase, freq, sine)
    p5, freq = sine()
    try:
        layout = row(column(freq, width=100), p5)
        print("AAAAAAAAAA")
        return json_item(layout, "plot")
    except:
        layout = row(column(freq, width=100), p5)
        print("BBBBBBBBBBBBBBB")
        return json_item(layout, "plot")

pn.extension()
button2 = pn.widgets.Button(name='Click me!', button_type='primary')
@app.get("/try-button", response_class=JSONResponse)
async def try_button():
    # response_data = button2.serve(json=True)
    return button2.param.get_param_values()


if __name__=="__main__":
    pn.serve(app)