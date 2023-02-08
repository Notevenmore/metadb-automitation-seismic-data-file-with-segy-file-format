import "../styles/globals.css";
import LayoutIcon from "../layout/LayoutIcon";
import LayoutCollapse from "../layout/LayoutCollapse";
import LayoutWidget from "../layout/LayoutWidget";
import "highlight.js/styles/github.css";


function MyApp({ Component, pageProps }) {
    return (
        <LayoutIcon>
          <Component {...pageProps} />
        </LayoutIcon>
        // <LayoutCollapse>
        //     <Component {...pageProps} />
        // </LayoutCollapse>
        // <LayoutWidget>
        //     <Component {...pageProps} />
        // </LayoutWidget>
    );
}

export default MyApp;
