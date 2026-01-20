// pages/404.tsx
import Head from 'next/head';
import { useEffect } from 'react';

const Error404Page = () => {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <>
      <Head>
        <title>404: This page could not be found.</title>
      </Head>
      <div className="bg-color-white h-screen text-center flex justify-center items-center">
        <div>
          <h1 className="next-error-h1">404</h1>
          <div className="next-error-desc">This page could not be found.</div>
        </div>
      </div>
    </>
  );
};

export default Error404Page;
