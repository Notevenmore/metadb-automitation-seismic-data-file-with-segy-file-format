import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import ProgressBar from '../components/ProgressBar';
import Toast from '../components/toast/toast';
import {getLayoutIcon} from '../layout/getLayout';
import {store} from '../store';
import {PopupProvider} from '@contexts/PopupContext';
import '../styles/globals.css';

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
      <PopupProvider>
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
      </PopupProvider>
    </Provider>
  );
}

export default MyApp;
