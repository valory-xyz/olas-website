import { useEffect, useState } from 'react';

export const useHash = () => {
  const [hash, setHash] = useState('');

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hash;
};
