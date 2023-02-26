import React, { useEffect, useRef, useState } from "react";
import Container from "../components/container/container";
import axios from "axios";

export default function BokehPage({}) {
	const plotRef = useRef(null);
	const frameRef = useRef(null);
	const data = [1, 2, 3, 4, 5];
	const datay = [5, 4, 3, 2, 1];

	async function test() {
		plotRef.current.innerHTML = ""
		if (typeof window !== "undefined") {
			const Bokeh = await import("@bokeh/bokehjs");

			axios.get("http://127.0.0.1:8000/test")
				.then((res) => {
					console.log("test1");
					Bokeh.embed.embed_item(res.data, 'plot');
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
					Bokeh.embed.embed_item(res.data, 'plot');
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	const [sourceFrame, setSourceFrame] = useState("")
	async function widgetTest() {
		plotRef.current.innerHTML = ""
		if (typeof window !== "undefined") {
			axios.get("http://127.0.0.1:8000/widgets")
				.then((res) => {
					console.log(res.data);
					// Bokeh.embed.embed_item(res.data, 'plot');
					setSourceFrame(res.data)
					// console.log(plotRef.current)
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	async function vtkTest() {
		plotRef.current.innerHTML = ""
		if (typeof window !== "undefined") {
			axios.get("http://127.0.0.1:8000/try-vtk")
				.then((res) => {
					console.log(res.data);
					// Bokeh.embed.embed_item(res.data, 'plot');
					// console.log(plotRef.current)
					setSourceFrame(res.data)
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	const [panel, setPanel] = useState(null)
	async function buttonTest() {
		plotRef.current.innerHTML = ""
		if (typeof window !== "undefined") {
			axios.get("http://127.0.0.1:8000/try-button")
				.then((res) => {
					console.log(res.data);
					// Bokeh.embed.embed_item(res.data, 'plot');
					// console.log(plotRef.current)
					const panel = createReactPanel(res.data)
					setPanel(panel)
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}


	return (
		<Container>
			<div ref={plotRef} id="plot" className="bk-root"></div>
			<div>{panel}</div>
			<iframe ref={frameRef} srcDoc={sourceFrame}></iframe>
			<button onClick={test} className="border border-black p-3 w-[150px]">test 1</button>
			<button onClick={test2} className="border border-black p-3 w-[150px]">test 2</button>
			<button onClick={widgetTest} className="border border-black p-3 w-[150px]">test widget</button>
			{/* <button onClick={vtkTest} className="border border-black p-3 w-[150px]">test vtk iframe</button>
			<button onClick={buttonTest} className="border border-black p-3 w-[150px]">test button</button> */}
		</Container>
	);
}
