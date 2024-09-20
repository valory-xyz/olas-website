/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

import PageWrapper from 'components/Layout/PageWrapper';
import SectionWrapper from 'components/Layout/SectionWrapper';
import SectionHeading from 'components/SectionHeading';
import Meta from 'components/Meta';

const linkClass = 'text-purple-600 hover:text-purple-800';

const PearlTerms = () => (
  <PageWrapper>
    <Meta pageTitle="Disclaimer" />
    <SectionWrapper backgroundType="SUBTLE_GRADIENT">
      <article className="max-w-[800px] mx-auto">
        <SectionHeading size="text-4xl lg:text-2xl" color="text-purple-950">
          Pearl Terms
        </SectionHeading>
        <div className="text-xl text-gray-600">
          <ol className="list-disc">
            <li>
              The Pearl Application (“Application”) is the desktop application
              available for download on the{' '}
              <Link href="https://olas.network/" className={linkClass}>
                Olas Site
              </Link>
              , therefore is subject to the “
              <Link
                href="https://olas.network/disclaimer"
                className={linkClass}
              >
                Olas Disclaimer
              </Link>
              ”.
            </li>
            <li>
              Both the Application and brand “Pearl” or “Olas Pearl” and
              associated Marks are part of Valory AG’s “Offerings”, thus are
              subject to the “
              <Link href="https://valory.xyz/terms" className={linkClass}>
                Valory Terms
              </Link>
              ” and related definitions therein.
            </li>

            <li>
              Together, the Valory Terms and the Olas Disclaimer are known as
              the “Conditions”, and where there is doubt between the two texts,
              the Valory Terms shall control.
            </li>

            <li>
              The information on this page is simply for convenience and shall
              never override the Conditions.
            </li>

            <li>
              Please note that, per the Conditions, your use of this Site and
              these Offerings triggers your acceptance of the Conditions,
              including but not limited to the risks involved in the Offerings
              including but not limited to such emerging technologies as
              blockchain.
            </li>
          </ol>

          <h4 className="text-xl mt-16 flex items-center">
            <AlertTriangle size={18} className="inline-block mr-2" />
            Warning
          </h4>
          <p className="mt-2">
            The code within this Application is provided without any warranties.
            It is important to note that the code has not been audited for
            potential security vulnerabilities.
          </p>
        </div>
      </article>
    </SectionWrapper>
  </PageWrapper>
);

export default PearlTerms;
