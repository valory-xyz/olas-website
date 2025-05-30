import Link from 'next/link';

export const WantToBuild = () => (
  <div id="accelerator" className="bg-slate-100 py-14">
    <div className="max-w-[650px] max-sm:mx-4 mx-auto flex flex-col">
      <h2 className="tracking-tight text-3xl lg:text-4xl mb-8 text-left font-semibold">
        Want to build an AI Agent for Pearl?
      </h2>
      <p className="mb-4">
        Apply to the Olas Accelerator — a $1,000,000 grant program designed to
        support top builders launching agents on Pearl: The Agent App Store.
      </p>
      <Link href="/accelerator" className="text-purple-600">
        Learn more
      </Link>
    </div>
  </div>
);
