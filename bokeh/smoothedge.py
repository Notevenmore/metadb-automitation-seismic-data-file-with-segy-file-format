from scipy.ndimage.filters import gaussian_filter1d
from scipy.ndimage.filters import convolve
import numpy as np
def smoothedge(data, n):
    grad = convolve(data, [1, -1, 0], mode="nearest")[:-1]
    smooth_grad = gaussian_filter1d(grad, n)
    mds = [data[0] + sum(smooth_grad[:x]) for x in range(len(data))]
    return np.array(mds)