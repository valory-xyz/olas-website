import PlausibleProvider from 'next-plausible';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'styles/globals.css';

function PlausibleTracker() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.plausible?.('pageview', {
        url,
        props: {
          utm_source: router.query.utm_source,
          utm_medium: router.query.utm_medium,
          utm_campaign: router.query.utm_campaign,
          utm_term: router.query.utm_term,
          utm_content: router.query.utm_content,
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

export default function App({ Component, pageProps }) {
  return (
    <PlausibleProvider
      domain="olas.network"
      trackOutboundLinks={true}
      enabled={true}
      scriptProps={{
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
