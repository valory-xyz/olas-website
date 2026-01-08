import { useEffect, useState } from 'react';
import useSWR from 'swr';

export const usePersistentSWR = (
  key: string,
  fetcher: () => Promise<any>,
  config?: any,
) =>
  useSWR(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    ...config,
  });

export const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(1280);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
};
