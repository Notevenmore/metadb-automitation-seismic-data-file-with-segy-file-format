import "../styles/globals.css";
import "highlight.js/styles/github.css";
import { getLayoutIcon, getLayoutWidget } from "../layout/getLayout";
import { store } from "../store";
import { Provider } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ProgressBar from "../components/progress_bar/progress_bar"

function MyApp({ Component, pageProps }) {
	const getLayout = Component.getLayout || getLayoutIcon;
	const router = useRouter();

	const [state, setState] = useState({
		isRouteChanging: false,
		loadingKey: 0,
	  })
	
	  useEffect(() => {
		const handleRouteChangeStart = () => {
		  setState((prevState) => ({
			...prevState,
			isRouteChanging: true,
			loadingKey: prevState.loadingKey ^ 1,
		  }))
		}
	
		const handleRouteChangeEnd = () => {
		  setState((prevState) => ({
			...prevState,
			isRouteChanging: false,
		  }))
		}
	
		router.events.on('routeChangeStart', handleRouteChangeStart)
		router.events.on('routeChangeComplete', handleRouteChangeEnd)
		router.events.on('routeChangeError', handleRouteChangeEnd)
	
		return () => {
		  router.events.off('routeChangeStart', handleRouteChangeStart)
		  router.events.off('routeChangeComplete', handleRouteChangeEnd)
		  router.events.off('routeChangeError', handleRouteChangeEnd)
		}
	  }, [router.events])

	return (
		<Provider store={store}>
			<ProgressBar isRouteChanging={state.isRouteChanging} key={state.loadingKey} />
			<Head>
				<title>Geodwipa Teknika Nusantara Database Converter App</title>
				<meta name="description" content="Geodwipa Teknika Nusantara Database Converter App" />
				{/* <link rel="icon" href="/icons/Geodwipa_logo.svg" /> */}
				<link rel="icon" href="/images/gtn_logo_fire.png" />
			</Head>
			{getLayout(<Component {...pageProps} />)}
		</Provider>
	);
}

export default MyApp;
