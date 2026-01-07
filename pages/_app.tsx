import PlausibleProvider from 'next-plausible';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'styles/globals.css';

function PlausibleTracker() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // @ts-expect-error TS(2339) FIXME: Property 'plausible' does not exist on type 'Windo... Remove this comment to see the full error message
      window.plausible?.('pageview', {
        url,
        props: {
          utm_source: router.query.utm_source,
          utm_medium: router.query.utm_medium,
          utm_campaign: router.query.utm_campaign,
          utm_term: router.query.utm_term,
          utm_content: router.query.utm_content,
          hash: window.location.hash,
        },
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return null;
}

interface AppProps {
  Component: React.ElementType;
  pageProps: object;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider
      domain="olas.network"
      trackOutboundLinks
      taggedEvents
      enabled
      scriptProps={{
        // @ts-expect-error TS(2322) FIXME: Type '{ 'data-domain': string; 'data-track-outboun... Remove this comment to see the full error message
        'data-domain': 'olas.network',
        'data-track-outbound-links': true,
        'data-track-file-downloads': true,
        'data-track-utm': true,
        'data-track-referrer': true,
      }}
    >
      <PlausibleTracker />
      <Component {...pageProps} />
    </PlausibleProvider>
  );
}
