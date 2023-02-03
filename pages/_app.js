import "../styles/globals.css";
import LayoutIcon from "../layout/LayoutIcon";

function MyApp({ Component, pageProps }) {
  return (
    <LayoutIcon>
      <Component {...pageProps} />
    </LayoutIcon>
  );
}

export default MyApp;
