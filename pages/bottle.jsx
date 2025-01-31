import { MAIN_TITLE_CLASS } from 'common-util/classes';
import PageWrapper from 'components/Layout/PageWrapper';
import Meta from 'components/Meta';

const Bottle = () => (
  <PageWrapper>
    <Meta pageTitle="Bottle" description="Bottle" />
    <h2 className={`${MAIN_TITLE_CLASS} p-48 text-center`}>Coming soon...</h2>
    <hr />
  </PageWrapper>
);

export default Bottle;
