import { BadgePercent, ChartNoAxesCombined, Maximize2 } from 'lucide-react';

import {
  CARD_CSS,
  SCREEN_WIDTH_LG,
  SECTION_BOX_CLASS,
  SUB_HEADER_CLASS,
  TEXT_CLASS,
} from 'common-util/classes';
import SectionWrapper from 'components/Layout/SectionWrapper';

const list = [
  {
    title: 'Get more OLAS',
    desc: 'You get OLAS tokens at a discount.',
    icon: <BadgePercent size={30} />,
  },
  {
    title: 'Grow the network',
    desc: 'Your liquidity helps other network participants use the network more easily.',
    icon: <ChartNoAxesCombined size={30} />,
  },
  {
    title: 'Contribute to growth',
    desc: 'Your support helps expand the network.',
    icon: <Maximize2 size={30} className="rotate-45" />,
  },
];

export const UnlockBenefits = () => (
  <SectionWrapper
    id="about"
    customClasses={`bg-no-repeat ${SECTION_BOX_CLASS}`}
  >
    <div className={`${SCREEN_WIDTH_LG} px-0lg:px-12`}>
      <h2 className={`${SUB_HEADER_CLASS} mb-6`}>
        Unlock benefits as an Olas Bonder
      </h2>

      <p>
        Join as an Olas Bonder to strengthen the network. An Olas Bonder
        provides liquidity to the Olas ecosystem by participating in bonding
        programs. By bonding your assets, you help grow the network and in
        return, receive OLAS at preferential rates. It’s a simple way to support
        and benefit from the growth of the Olas ecosystem.
      </p>

      <div id="why-bond">
        <h2 className={`${SUB_HEADER_CLASS} mt-8 mb-6 lg:mt-36`}>
          Why become an Olas Bonder?
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {list.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-2 bg-gradient-to-r p-2 rounded-xl border lg:p-4 lg:gap-4"
              style={CARD_CSS}
            >
              <div className="flex items-center">{icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{title}</h3>
                <p className={TEXT_CLASS}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionWrapper>
);
