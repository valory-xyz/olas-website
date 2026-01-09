import PlausibleProvider from 'next-plausible';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import 'styles/globals.css';

function PlausibleTracker() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      (
        window as typeof window & {
          plausible?: (
            event: string,
            options?: { url?: string; props?: Record<string, unknown> },
          ) => void;
        }
      ).plausible?.('pageview', {
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

type AppProps = {
  Component: React.ElementType;
  pageProps: object;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider
      domain="olas.network"
      trackOutboundLinks
      taggedEvents
      enabled
      scriptProps={
        {
          'data-domain': 'olas.network',
          'data-track-outbound-links': true,
          'data-track-file-downloads': true,
          'data-track-utm': true,
          'data-track-referrer': true,
        } as React.HTMLAttributes<HTMLScriptElement>
      }
    >
      <PlausibleTracker />
      <Component {...pageProps} />
    </PlausibleProvider>
  );
}
