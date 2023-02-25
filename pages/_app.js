import "../styles/globals.css";
import "highlight.js/styles/github.css";
import { getLayoutIcon, getLayoutWidget } from "../layout/getLayout";
import { store } from "../store";
import { Provider } from "react-redux";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
	const getLayout = Component.getLayout || getLayoutIcon;

	return (
		<Provider store={store}>
			<Head>
				<title>Kangean Energy Indonesia Database Converter App</title>
				<meta name="description" content="Kangean Energy Indonesia Database Converter App" />
				<link rel="icon" href="/icons/kangean_logo.svg" />
			</Head>
			{getLayout(<Component {...pageProps} />)}
		</Provider>
	);
}

export default MyApp;
