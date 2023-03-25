# holoviews
import holoviews as hv
from holoviews.operation.datashader import regrid
from holoviews import opts, streams
# data
import numpy as np
import pandas as pd
import tables
import re
import os
from smoothedge import smoothedge
# bokeh
from bokeh.embed import json_item
from bokeh.models import Select, ColumnDataSource, Slider, TextInput, CheckboxGroup, CustomJS
from bokeh.plotting import figure
from bokeh.layouts import column, row
# scipy
from scipy.interpolate import interp1d
from scipy.fftpack import fft
# panel
import panel as pn

hv.extension('bokeh')

username = "user01"

def atoi(text):
    return int(text) if text.isdigit() else text

def natural_keys(text):
    return [atoi(c) for c in re.split(r'(\d+)', text)]

# selectinxltim = Select(name='Select Slice', value='INLINE', options=['INLINE', 'XLINE', 'TIME'], max_height=50)
# selectproject = Select(name="Select Project:", max_height=50, value="FNORTH")
# selectseismic = Select(name="Select Volume", max_height=50, value="FNORTH")
# explorerSlice = Slider(name='Explore Slice', value=100, max_height=50, start=100, end=750)
# text_amp = TextInput(name='Amplitudes:', value='3000', max_height=50)
# xlabelinc = TextInput(name='X-label Inc:', value='200', max_height=50)
# xylim = TextInput(name='TWT Limit:', value='0,10', max_height=50)
# colr = Select(name='Select Color Scale',options=['gray', 'bwr', 'RdGy', 'BrBG', 'coolwarm', 'cwr', 'RdBu', 'spectral', 'fire', 'magma', 'seismic','jet'], max_height=50, value="gray")
# horcheckbox = CheckboxGroup(name='Show Horizon', inline=False)

selectinxltim = {"value": "INLINE"}
selectproject = {"value": "FNORTH"}
selectseismic = {"value": "FNORTH"}
explorerSlice = 100
text_amp = {"value": "3000"}
xlabelinc = {"value": "200"}
xylim = {"value": "0,10"}
colr = {"value": "gray"}
horcheckbox = {"value": ['F3-Horizon-FS6', 'F3-Horizon-FS7', 'F3-Horizon-FS8', 'F3-Horizon-MFS4', 'F3-Horizon-Shallow', 'F3-Horizon-Top-Foresets', 'F3-Horizon-Truncation']}

xs = np.random.rand(200)
ys = np.random.rand(200)

def HV():
    # scatter n curve can :)
    # scatter = hv.Scatter((xs, ys))
    # bokeh_plot = hv.render(scatter, backend='bokeh')
    # bokeh_plot_json = json_item(bokeh_plot, "plot")
    # return bokeh_plot_json
    ls = np.linspace(0, 10, 200)
    xx, yy = np.meshgrid(ls, ls)

    bounds=(-1,-1,1,1)   # Coordinate system: (left, bottom, right, top)
    img = hv.Image(np.sin(xx)*np.cos(yy), bounds=bounds)
    fig = hv.render(img)
    return json_item(fig, "plot")


def hook(plt, element):
    plt.handles['glyph_renderer'].level = 'image'
    plt.state.toolbar.logo = None
    plt.state.toolbar.active_drag = None

####DRAW BOX on Seismic , double click and move mouse and double click at end
polys = hv.Polygons([])
box_stream = streams.BoxEdit(source=polys, num_objects=1)

def draw_box(data):
    sourcebox = ColumnDataSource(dict(x=[], y=[]))  # box selection for spectra
    sourcesmoothspec = ColumnDataSource(data=dict(x=[], y=[]))  # smooth spectra

    try:
        kotak = box_stream.data
        X = [kotak.get('x0')[-1], kotak.get('x1')[-1], kotak.get('x1')[-1], kotak.get('x0')[-1],
             kotak.get('x0')[-1]]  # trace-ke
        Y = [kotak.get('y0')[-1], kotak.get('y0')[-1], kotak.get('y1')[-1], kotak.get('y1')[-1],
             kotak.get('y0')[-1]]  # waktu
        xybox01 = pd.DataFrame(np.vstack((X, Y)).T, columns=['x', 'y'])  # X is trace nth Y is TWT
        box01 = hv.Curve(xybox01, 'x', 'y').options(color='#c22e00', line_width=2)

        filenamevolin = './PROJECT/%s/%s/VOL/%s.vol' % (username,selectproject["value"], selectseismic["value"])
        fvolin = tables.open_file(filenamevolin, mode='r')
        sr = int(np.load('./PROJECT/%s/%s/TEMP/%s.samsr' % (username,selectproject["value"], selectseismic["value"]))[1]) / 1000

        if selectinxltim["value"] == 'INLINE':
            INLINE = np.load('./PROJECT/%s/%s/TEMP/il_%s.npy' % (username,selectproject["value"], selectseismic["value"]))
            sliceke = list(INLINE).index(int(explorerSlice))
            values = fvolin.root.data[sliceke, :, :].T

        elif selectinxltim["value"] == 'XLINE':
            XLINE = np.load('./PROJECT/%s/%s/TEMP/xl_%s.npy' % (username,selectproject["value"], selectseismic["value"]))
            sliceke = list(XLINE).index(int(explorerSlice))
            values = fvolin.root.data[:, sliceke, :].T

        traces = values[5:None, :]
        traces = traces[int(min(np.array(Y)) / sr):int(max(np.array(Y)) / sr),
                 int(min(np.array(X))):int(max(np.array(X)))]
        Fs = 1000 / sr
        spec = []
        for i in range(traces.shape[1]):
            trace = traces[:, i]
            window = np.hanning(len(trace))
            trace = trace * window
            yf = fft(trace)
            yA = 2.0 / len(trace) * np.abs(yf[0:int(np.ceil(len(trace) / 2))])
            spec.append(yA)
        spec = np.asarray(spec).T
        spec = np.mean(spec, axis=1)
        xf = np.linspace(0.0, 1.0 / (2.0 * (1 / Fs)), len(spec))
        sourcebox.data = dict(x=xf, y=spec)
        sourcesmoothspec.data = dict(x=xf, y=spec)

        print('test1')
        return box01
    except:

        X = [np.nan, np.nan, np.nan, np.nan, np.nan]
        Y = [np.nan, np.nan, np.nan, np.nan, np.nan]
        xybox01 = pd.DataFrame(np.vstack((X, Y)).T, columns=['x', 'y'])
        box01 = hv.Curve(xybox01, 'x', 'y').options(color='#c22e00', line_width=2)
        print('test2')
        return box01

dmap = hv.DynamicMap(draw_box, streams=[box_stream])


# def updateData(attr, old, new):
#     print("???")
#     global explorerSlice
#     explorerSlice = slider.value
#     print("hey?",explorerSlice)

# slider = Slider(start=100, end=750, value=100, step=0.1, title="slice")
# slider.on_change('value', updateData)

def seismicstackplot(explorer):
    try:
        filenamevolin = './PROJECT/%s/%s/VOL/%s.vol' % (username,selectproject["value"], selectseismic["value"])
        fvolin = tables.open_file(filenamevolin, mode='r')
        sr = int(np.load('./PROJECT/%s/%s/TEMP/%s.samsr' % (username,selectproject["value"], selectseismic["value"]))[1]) / 1000

        if selectinxltim["value"] == 'INLINE':
            INLINE = np.load('./PROJECT/%s/%s/TEMP/il_%s.npy' % (username,selectproject["value"], selectseismic["value"]))
            sliceke = list(INLINE).index(int(explorer))

            values = fvolin.root.data[sliceke, :, :].T
            XLINE = values[1, :]
            traces = values[5:None, :]
            XLABEL = 'XLINE'
            YLABEL = 'TWT [ms]'
            XLIT = np.array(XLINE, dtype=int)
            fvolin.close()

            ########################
            data = np.flipud(traces)
            vmin = -float(text_amp["value"])
            vmax = float(text_amp["value"])

            xtic = np.arange(0, data.shape[1], 1)
            xinc = int(xlabelinc["value"])
            xtic = xtic[::xinc]
            cmplabel = XLIT[::xinc]
            xid = list(zip(map(int, xtic), map(str, cmplabel)))

            bounds = (0, 0, data.shape[1] - 1, data.shape[0] * sr)

            batas = [int(s) for s in re.findall(r'-?\d+\.?\d*', xylim["value"])]

            plot_opts = {
                'colorbar': True,
                'clim': (vmin, vmax),
                'xlabel': '%s' % XLABEL,
                'ylabel': '%s' % YLABEL,
                'xlim': (0, data.shape[1]),
                'ylim': (batas[0], batas[1]),
                'xaxis': 'top',
                'invert_yaxis': True,
                'xticks': xid,

            }

            ####get horizon
            try:
                XLINENO = np.load('./PROJECT/%s/%s/TEMP/xl_%s.npy' % (username,selectproject["value"], selectseismic["value"]))
                horizon = np.loadtxt(
                    './PROJECT/%s/%s/HORIZON/%s_IL%s.txt' % (username,selectproject["value"], horcheckbox["value"][0], INLINE[sliceke]))
                horizon[horizon[:, 2] == 0] = np.nan
                horizon[horizon[:, 3] == 0] = np.nan
                horizon = pd.DataFrame(horizon)
                horizon = horizon.dropna(how='any').values
                fh = interp1d(horizon[:, 1], horizon[:, 5], kind='linear',
                              fill_value='extrapolate')  # option for P or S wave
                xyhor01 = pd.DataFrame(np.vstack((np.arange(0, len(XLINENO), 1), smoothedge(fh(XLINENO), 11))).T,
                                       columns=['x', 'y'])  # in Panel Bokeh  X axis is no of trace, Y axis is TWT
                hor01 = hv.Curve(xyhor01, 'x', 'y').options(color='red', line_width=2)

                horizon = np.loadtxt(
                    './PROJECT/%s/%s/HORIZON/%s_IL%s.txt' % (username,selectproject["value"], horcheckbox["value"][1], INLINE[sliceke]))
                horizon[horizon[:, 2] == 0] = np.nan
                horizon[horizon[:, 3] == 0] = np.nan
                horizon = pd.DataFrame(horizon)
                horizon = horizon.dropna(how='any').values
                fh = interp1d(horizon[:, 1], horizon[:, 5], kind='linear',
                              fill_value='extrapolate')  # option for P or S wave
                xyhor02 = pd.DataFrame(np.vstack((np.arange(0, len(XLINENO), 1), smoothedge(fh(XLINENO), 11))).T,
                                       columns=['x', 'y'])  # in Panel Bokeh  X axis is no of trace, Y axis is TWT
                hor02 = hv.Curve(xyhor02, 'x', 'y').options(color='green', line_width=2)

                horizon = np.loadtxt(
                    './PROJECT/%s/%s/HORIZON/%s_IL%s.txt' % (username,selectproject["value"], horcheckbox["value"][2], INLINE[sliceke]))
                horizon[horizon[:, 2] == 0] = np.nan
                horizon[horizon[:, 3] == 0] = np.nan
                horizon = pd.DataFrame(horizon)
                horizon = horizon.dropna(how='any').values
                fh = interp1d(horizon[:, 1], horizon[:, 5], kind='linear',
                              fill_value='extrapolate')  # option for P or S wave
                xyhor03 = pd.DataFrame(np.vstack((np.arange(0, len(XLINENO), 1), smoothedge(fh(XLINENO), 11))).T,
                                       columns=['x', 'y'])  # in Panel Bokeh  X axis is no of trace, Y axis is TWT
                hor03 = hv.Curve(xyhor03, 'x', 'y').options(color='blue', line_width=2)

                horizon = np.loadtxt(
                    './PROJECT/%s/%s/HORIZON/%s_IL%s.txt' % (username,selectproject["value"], horcheckbox["value"][3], INLINE[sliceke]))
                horizon[horizon[:, 2] == 0] = np.nan
                horizon[horizon[:, 3] == 0] = np.nan
                horizon = pd.DataFrame(horizon)
                horizon = horizon.dropna(how='any').values
                fh = interp1d(horizon[:, 1], horizon[:, 5], kind='linear',
                              fill_value='extrapolate')  # option for P or S wave
                xyhor04 = pd.DataFrame(np.vstack((np.arange(0, len(XLINENO), 1), smoothedge(fh(XLINENO), 11))).T,
                                       columns=['x', 'y'])  # in Panel Bokeh  X axis is no of trace, Y axis is TWT
                hor04 = hv.Curve(xyhor04, 'x', 'y').options(color='magenta', line_width=2)

                horizon = np.loadtxt(
                    './PROJECT/%s/%s/HORIZON/%s_IL%s.txt' % (username,selectproject["value"], horcheckbox["value"][4], INLINE[sliceke]))
                horizon[horizon[:, 2] == 0] = np.nan
                horizon[horizon[:, 3] == 0] = np.nan
                horizon = pd.DataFrame(horizon)
                horizon = horizon.dropna(how='any').values
                fh = interp1d(horizon[:, 1], horizon[:, 5], kind='linear',
                              fill_value='extrapolate')  # option for P or S wave
                xyhor05 = pd.DataFrame(np.vstack((np.arange(0, len(XLINENO), 1), smoothedge(fh(XLINENO), 11))).T,
                                       columns=['x', 'y'])  # in Panel Bokeh  X axis is no of trace, Y axis is TWT
                hor05 = hv.Curve(xyhor05, 'x', 'y').options(color='white', line_width=2)

                horizon = np.loadtxt(
                    './PROJECT/%s/%s/HORIZON/%s_IL%s.txt' % (username,selectproject["value"], horcheckbox["value"][5], INLINE[sliceke]))
                horizon[horizon[:, 2] == 0] = np.nan
                horizon[horizon[:, 3] == 0] = np.nan
                horizon = pd.DataFrame(horizon)
                horizon = horizon.dropna(how='any').values
                fh = interp1d(horizon[:, 1], horizon[:, 5], kind='linear',
                              fill_value='extrapolate')  # option for P or S wave
                xyhor06 = pd.DataFrame(np.vstack((np.arange(0, len(XLINENO), 1), smoothedge(fh(XLINENO), 11))).T,
                                       columns=['x', 'y'])  # in Panel Bokeh  X axis is no of trace, Y axis is TWT
                hor06 = hv.Curve(xyhor06, 'x', 'y').options(color='yellow', line_width=2)


            except:
                pass
        
        img = hv.Image(data, bounds=bounds).options(responsive=True, min_height=int(1200), min_width=200, show_grid=True, 
                                                    cmap=colr["value"], hooks=[hook], gridstyle=dict(grid_line_color='black', grid_line_width=1, xgrid_visible=False),
                                                    clim=(vmin, vmax), invert_yaxis=True, colorbar=True)
        # img = hv.Image(data, bounds=bounds).options(responsive=True, min_height=int(1200), min_width=500, show_grid=True, style=style_opts, plot=plot_opts, hooks=[hook], gridstyle=dict(grid_line_color='black', grid_line_width=1, xgrid_visible=False))
        img = regrid(img, upsample=True, interpolation='bilinear', precompute=True)

        try:
            img = img * hor01
        except:
            pass

        try:
            img = img * hor02
        except:
            pass

        try:
            img = img * hor03
        except:
            pass

        try:
            img = img * hor04
        except:
            pass

        try:
            img = img * hor05
        except:
            pass

        try:
            img = img * hor06
        except:
            pass

        P = (img * polys * dmap).opts(opts.Polygons(fill_alpha=0.2, line_color='white'))

        # fig_container1.object = P

        bokeh_fig = hv.render(P)
        print("P? ")
        # layout = row(column(slider, width=100), bokeh_fig)
        # print(json_item(layout, "plot"))
        return json_item(bokeh_fig, "plot")
    except:
        print("didnt pass thru")
        pass



def callSeismic():
    return seismicstackplot(explorerSlice)

