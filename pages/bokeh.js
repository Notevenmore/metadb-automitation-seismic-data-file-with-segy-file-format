import React, { useEffect, useRef, useState } from "react";
import Container from "../components/container/container";
import axios from "axios";

// export async function getServerSideProps() {
// 	try {
// 		const response = await axios.get("http://127.0.0.1:8000/test");
// 		console.log(response)
// 		return {
// 			props: {
// 				bokeh: response,
// 			},
// 		};
// 	} catch (err) {
// 		return {
// 			props: {
// 				error: err,
// 			},
// 		};
// 	}
// }

export default function BokehPage({}) {
	const plotRef = useRef(null);
	const data = [1, 2, 3, 4, 5];
	const datay = [5, 4, 3, 2, 1];

	async function test() {
		plotRef.current.innerHTML = ""
		if (typeof window !== "undefined") {
			const Bokeh = await import("@bokeh/bokehjs");

			axios.get("http://127.0.0.1:8000/test")
				.then((res) => {
					console.log("test1");
					Bokeh.embed.embed_item(res.data, plotRef.current);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}
	async function test2() {
		plotRef.current.innerHTML = ""
		if (typeof window !== "undefined") {
			const Bokeh = await import("@bokeh/bokehjs");

			axios.get("http://127.0.0.1:8000/test2")
				.then((res) => {
					console.log("test2");
					Bokeh.embed.embed_item(res.data, plotRef.current);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	let source, plot;
	async function bokehCall() {
		console.log("hey?");
		if (typeof window !== "undefined") {
			const Bokeh = await import("@bokeh/bokehjs");

			const x = Bokeh.LinAlg.linspace(-0.5, 20.5, 10);
			const y = x.map(function (v) {
				return v * 0.5 + 3.0;
			});
			source = new Bokeh.ColumnDataSource({ data: { x: data, y: datay } });

			// create some ranges for the plot
			const xdr = new Bokeh.Range1d({ start: -0.5, end: 20.5 });
			const ydr = new Bokeh.Range1d({ start: -0.5, end: 20.5 });

			plot = new Bokeh.Plot({
				title: "BokehJS Plot",
				x_range: xdr,
				y_range: ydr,
				width: 400,
				height: 400,
				background_fill_color: "#F2F2F7",
			});

			// add axes to the plot
			const xaxis = new Bokeh.LinearAxis({ axis_line_color: null });
			const yaxis = new Bokeh.LinearAxis({ axis_line_color: null });
			plot.add_layout(xaxis, "below");
			plot.add_layout(yaxis, "left");

			// add grids to the plot
			const xgrid = new Bokeh.Grid({ ticker: xaxis.ticker, dimension: 0 });
			const ygrid = new Bokeh.Grid({ ticker: yaxis.ticker, dimension: 1 });
			plot.add_layout(xgrid);
			plot.add_layout(ygrid);

			// add a Line glyph
			const line = new Bokeh.Circle({
				x: { field: "x" },
				y: { field: "y" },
				line_color: "#666699",
				line_width: 2,
			});
			plot.add_glyph(line, source);

			Bokeh.Plotting.show(plot, plotRef.current);
		}
	}
	useEffect(() => {
		console.log("aa?");
		// bokehCall();
		// test();

		return () => {};
	}, []);

	const handleClick = () => {
		source.data.x.push(Math.floor(Math.random() * 20));
		source.data.y.push(Math.floor(Math.random() * 20));
		source.change.emit();
		console.log("aaa", source.data);
	};

	return (
		<Container>
			<div ref={plotRef} className="bk-root"></div>
			{/* <button className="border border-black p-3 w-[150px]" onClick={handleClick}>
				add data
			</button> */}
			<button onClick={test} className="border border-black p-3 w-[150px]">test 1</button>
			<button onClick={test2} className="border border-black p-3 w-[150px]">test 2</button>
		</Container>
	);
}
