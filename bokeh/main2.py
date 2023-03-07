from fastapi import FastAPI
from bokeh.models import ColumnDataSource, HoverTool, AllLabels
from bokeh.plotting import figure
from bokeh.embed import json_item
from bokeh.layouts import column
from fastapi.responses import HTMLResponse
import json
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

app = FastAPI(
    title="Bokeh python for frontend >~<"
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


doc = figure(title="My plot")
source = ColumnDataSource(data=dict(x=[], y=[]))
doc.line(x='x', y='y', source=source)

# Add a hover tool
hover = HoverTool()
hover.tooltips = [("x", "@x"), ("y", "@y")]
doc.add_tools(hover)

@app.get("/")
async def read_root():
    # Convert the Bokeh document to a JSON format that can be embedded in an HTML page
    doc_json = json_item(column(doc), "myplot")

    # Return an HTML response with the Bokeh plot embedded
    return doc_json

@app.post("/update_data/")
async def update_data(x: int, y: int):
    # Update the data source with the new data point
    source.stream(dict(x=[x], y=[y]))

    # Update the title of the Bokeh plot with the new data point
    # doc.title.text = f"My plot ({x}, {y})"

    # Create a new instance of the AllLabels model with the new data point
    label = AllLabels(x=[x], y=[y], text=[f"{x}, {y}"])

    # Add the new label to the Bokeh document
    doc.add_layout(label)

    # Return a message indicating success
    return {"message": "Data updated successfully",
            "data": source}