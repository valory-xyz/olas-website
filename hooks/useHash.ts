import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Listens to the native event (plain anchors, manual URL edits) and the router's:
// a same-page next/link goes through history.pushState and never fires `hashchange`.
export const useHash = () => {
  const { events } = useRouter();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    events.on('hashChangeComplete', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      events.off('hashChangeComplete', handleHashChange);
    };
  }, [events]);

  return hash;
};
