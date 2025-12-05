import { Link } from 'components/ui/typography';
import Head from 'next/head';

const RestrictedPage = () => {
  return (
    <>
      <Head>
        <title>Access Denied - Service Not Available</title>
      </Head>
      <div className="bg-color-white h-screen text-center flex justify-center items-center">
        <div className="flex max-w-[800px] mx-auto">
          <h1 className="next-error-h1 text-right text-gray-800">
            403 Access Restricted
          </h1>
          <div className="my-auto text-left leading-relaxed">
            Due to applicable legal and regulatory requirements, access to this
            site is not available from your current region. <br />
            We use your approximate location data (region-level IP information)
            solely for the purpose of enforcing this restriction and do not
            store this information. For more details, please refer to our{' '}
            <Link href="/disclaimer">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </>
  );
};

export default RestrictedPage;
