import { useEffect, useState } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

export const usePersistentSWR = <Data, ErrorType = Error>(
  key: string,
  fetcher: () => Promise<Data>,
  config?: SWRConfiguration<Data, ErrorType>,
) =>
  useSWR<Data, ErrorType>(key, fetcher, {
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
