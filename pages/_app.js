import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
          <Component {...pageProps} />
        
        // <LayoutCollapse>
        //     <Component {...pageProps} />
        // </LayoutCollapse>
    );
}

export default MyApp;
