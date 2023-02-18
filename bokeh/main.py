from fastapi import FastAPI
from bokeh.plotting import figure, show
from bokeh.resources import CDN
from bokeh.embed import json_item
from bokeh.layouts import layout, column, row
from bokeh.models import CustomJS, ColumnDataSource, Slider, Spinner
from bokeh.sampledata.autompg import autompg
import json

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

    p = figure(title="Simple line example", x_axis_label="x", y_axis_label="y")

    # add a line renderer with legend and line thickness
    points = p.circle(x=x, y=y, size=30, fill_color="#21a7df")

    return json_item(p, "plot")

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

    return json_item(layout, "plot")