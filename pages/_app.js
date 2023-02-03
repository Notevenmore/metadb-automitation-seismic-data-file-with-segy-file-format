import "../styles/globals.css";
import LayoutIcon from "../layout/LayoutIcon";
import LayoutCollapse from "../layout/LayoutCollapse";

function MyApp({ Component, pageProps }) {
    return (
        <LayoutIcon>
          <Component {...pageProps} />
        </LayoutIcon>
        // <LayoutCollapse>
        //     <Component {...pageProps} />
        // </LayoutCollapse>
    );
}

export default MyApp;
