import '../styles/globals.css';
import {Provider} from 'react-redux';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useState, useEffect} from 'react';
import {store} from '../store';
import ProgressBar from '../components/progress_bar/progress_bar';
import {getLayoutIcon} from '../layout/getLayout';
import Toast from '../components/toast/toast';

function MyApp({Component, pageProps}) {
  const getLayout = Component.getLayout || getLayoutIcon;
  const router = useRouter();
  const [PageTitle, setPageTitle] = useState('');

  const [state, setState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  });

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setState(prevState => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }));
    };

    const handleRouteChangeEnd = () => {
      setState(prevState => ({
        ...prevState,
        isRouteChanging: false,
      }));
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [router.events]);

  return (
    <Provider store={store}>
      <ProgressBar
        isRouteChanging={state.isRouteChanging}
        key={state.loadingKey}
      />
      <Head>
        <title>{PageTitle ? `${PageTitle} - MetaDB` : 'MetaDB'}</title>
        <meta name="description" content="MetaDB" />
        <link rel="icon" href="/metadb.svg" />
      </Head>
      <Toast />
      {getLayout(<Component {...pageProps} setTitle={setPageTitle} />)}
    </Provider>
  );
}

export default MyApp;
