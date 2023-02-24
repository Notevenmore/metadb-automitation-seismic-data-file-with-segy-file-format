import "../styles/globals.css";
import "highlight.js/styles/github.css";
import { getLayoutIcon } from "../layout/getLayout";
import { store } from "../store";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }) {
	const getLayout = Component.getLayout || getLayoutIcon;

	return <Provider store={store}>{getLayout(<Component {...pageProps} />)}</Provider>;
}

export default MyApp;
