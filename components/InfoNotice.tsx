import Link from 'next/link';

export const InfoNotice = () => (
  <div className="max-w-[1000px] mx-auto px-6 pt-8 pb-4 text-center text-sm text-gray-500">
    Marketing communication. This page has not been reviewed or approved by any competent authority
    in any Member State of the European Union. The operator of this site is solely responsible for
    its content. OLAS is a crypto-asset: its value can go down as well as up and you may lose the
    entire amount invested. See the{' '}
    <Link href="/disclaimer" className="underline">
      Disclaimer
    </Link>
    .
  </div>
);

export default InfoNotice;
