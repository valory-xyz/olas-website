import PlausibleProvider from 'next-plausible';
import PropTypes from 'prop-types';
import 'styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <PlausibleProvider domain="olas.network">
      <Component {...pageProps} />
    </PlausibleProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
