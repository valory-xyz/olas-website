import { VALORY_GIT_URL } from 'common-util/constants';
import { Popover } from 'components/ui/popover';
import { ExternalLink } from 'components/ui/typography';
import Image from 'next/image';

import { DIAGRAM, FEE_SWITCHES, TOOLTIPS } from './constants';

// Economy tip colors match the strong end of their stroke gradients below.
const COLORS = {
  slate: '#94a3b8',
  purple: '#95A7EF',
  teal: '#69D1CE',
  sky: '#9ACBCB',
};

// Stroke gradients for the economy connectors (from the design): full color at
// the pill end, fading to transparent toward the source. userSpaceOnUse aligns
// each gradient with its own path — from: the pill end, to: the path start.
const ECONOMY_GRADIENTS: Array<{
  id: string;
  from: [number, number];
  to: [number, number];
  stops: Array<[string, string, number]>;
}> = [
  {
    id: 'fw-grad-predict',
    from: [78, 95],
    to: [453, 290],
    stops: [
      ['0%', '#95A7EF', 1],
      ['33%', '#EA8FEF', 1],
      ['56%', '#EA8FEF', 0],
    ],
  },
  {
    id: 'fw-grad-babydegen',
    from: [1242, 95],
    to: [867, 290],
    stops: [
      ['0%', '#95A7EF', 1],
      ['33%', '#EA8FEF', 1],
      ['56%', '#EA8FEF', 0],
    ],
  },
  {
    id: 'fw-grad-mech',
    from: [1242, 879],
    to: [904, 752],
    stops: [
      ['0%', '#69D1CE', 1],
      ['33%', '#6CD0B8', 1],
      ['56%', '#6CD0B8', 0],
    ],
  },
  {
    id: 'fw-grad-agentsfun',
    // Same stop offsets as the predict gradient so the mirrored arcs fade
    // identically; only the colors differ.
    from: [78, 879],
    to: [416, 752],
    stops: [
      ['0%', '#9ACBCB', 1],
      ['33%', '#82A8D6', 1],
      ['56%', '#82A8D6', 0],
    ],
  },
];

// Coordinates live in the same 1214x952 space as the cards in FlywheelDesktop,
// so connectors line up by construction — tune both together.
const PATHS: Array<{
  d: string;
  color: keyof typeof COLORS;
  dashed?: boolean;
  arrow?: boolean;
  gradient?: string;
  width?: number;
}> = [
  // Users → Daily Active Agents ("Stake OLAS to use Pearl agents")
  { d: 'M 840 100 H 1105 Q 1129 100 1129 124 V 326', color: 'slate', arrow: true },
  // Daily Active Agents → txns ("Agents are active")
  { d: 'M 1129 461 V 806 Q 1129 830 1105 830 H 1055', color: 'slate', arrow: true },
  // txns → A2A ("AI Agent Bazaar is used")
  { d: 'M 741 830 H 595', color: 'slate', arrow: true },
  // A2A → OLAS burned ("OLAS is burned", ON switch sits on the vertical)
  { d: 'M 284 830 H 176 Q 152 830 152 806 V 458', color: 'slate', arrow: true },
  // OLAS burned → Users ("Attracts more builders and users")
  { d: 'M 152 330 V 124 Q 152 100 176 100 H 474', color: 'slate', dashed: true, arrow: true },
  // → Predict economy: emerges from under the PoL panel's left edge, dips left,
  // then rises straight up into the pill
  {
    d: 'M 453 290 C 220 315, 78 240, 78 95',
    color: 'purple',
    dashed: true,
    arrow: true,
    gradient: 'fw-grad-predict',
    width: 2,
  },
  // → BabyDegen economy: horizontal mirror of the Predict arc — sweeps right,
  // then rises straight up into the pill's bottom edge
  {
    d: 'M 867 290 C 1100 315, 1242 240, 1242 95',
    color: 'purple',
    dashed: true,
    arrow: true,
    gradient: 'fw-grad-babydegen',
    width: 2,
  },
  // → Mech economy: double mirror of the Predict arc (both axes), scaled to
  // 0.65 height x 0.9 width like the Agents.fun arc
  {
    d: 'M 904 752 C 1114 736, 1242 785, 1242 879',
    color: 'teal',
    dashed: true,
    arrow: true,
    gradient: 'fw-grad-mech',
    width: 2,
  },
  // → Agents.fun economy: vertical mirror of the Predict arc, scaled to 0.65
  // height x 0.9 width (anchored at the tip) so it clears the ON toggle
  {
    d: 'M 416 752 C 206 736, 78 785, 78 879',
    color: 'sky',
    dashed: true,
    arrow: true,
    gradient: 'fw-grad-agentsfun',
    width: 2,
  },
  // PoL panel → fees collected from PoL (plain line, no arrowhead)
  { d: 'M 660 566 V 588', color: 'slate' },
  // Fees from PoL → burn loop: solid up to the OFF switch, then dashed and
  // curving up to merge into the burn vertical
  { d: 'M 516 637 H 334', color: 'slate' },
  { d: 'M 334 637 H 176 Q 152 637 152 613', color: 'slate', dashed: true },
];

const FLOW_LABELS: Array<{ text: string; className: string }> = [
  // The two top labels are centered on their line segment (corner to card).
  {
    text: 'Attracts more builders and users',
    className: 'left-[152px] top-[112px] w-[328px] text-center',
  },
  {
    text: 'Stake OLAS to use Pearl agents',
    className: 'left-[840px] top-[112px] w-[289px] text-center whitespace-nowrap',
  },
  { text: 'Agents are active', className: 'left-[974px] top-[586px] w-[140px] text-right' },
  { text: 'OLAS is burned', className: 'left-[165px] top-[532px] w-[130px] text-left' },
  {
    text: 'AI Agent Bazaar is used',
    className: 'left-[608px] top-[839px] w-[120px] text-center',
  },
];

// Both valve images are 22x45 with the knob center 34px from the image top —
// that point goes on (cx, cy) so the knob sits on the connector line, tail up.
const SwitchToggle = ({ cx, cy, on }: { cx: number; cy: number; on: boolean }) => (
  <Image
    src={`/images/homepage/activity/fee-switch-${on ? 'on' : 'off'}.png`}
    alt={on ? 'Fee switch on' : 'Fee switch off'}
    width={22}
    height={45}
    className="absolute pointer-events-none"
    style={{ left: cx, top: cy, transform: 'translate(-50%, -34px)' }}
  />
);

export const FlywheelConnectors = () => (
  <>
    <svg
      viewBox={`0 0 ${DIAGRAM.width} ${DIAGRAM.height}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    >
      <defs>
        {/* Arrowhead shape from the design file (17x19, pointing right, tip at
            x~16.4). refX = tip x, so the head ends exactly at the line end and
            never slides under the cards. */}
        {Object.entries(COLORS).map(([name, color]) => (
          <marker
            key={name}
            id={`fw-arrow-${name}`}
            viewBox="0 0 17 19"
            refX="16.4"
            refY="9.15"
            markerWidth="6.3"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M2.35766 0.661107L15.7145 7.99964C16.5753 8.47255 16.5795 9.70774 15.7221 10.1866L2.37386 17.6404C1.36048 18.2063 0.190138 17.2057 0.591564 16.1167L3.02183 9.52353C3.12578 9.24153 3.12464 8.93151 3.01862 8.65028L0.586099 2.19757C0.176576 1.11124 1.34016 0.102072 2.35766 0.661107Z"
              fill={color}
              stroke={color}
            />
          </marker>
        ))}
        {ECONOMY_GRADIENTS.map(({ id, from, to, stops }) => (
          <linearGradient
            key={id}
            id={id}
            gradientUnits="userSpaceOnUse"
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
          >
            {stops.map(([offset, color, opacity]) => (
              <stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
            ))}
          </linearGradient>
        ))}
      </defs>
      {PATHS.map(({ d, color, dashed, arrow, gradient, width }) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={gradient ? `url(#${gradient})` : COLORS[color]}
          strokeWidth={width ?? 3}
          strokeDasharray={dashed ? '8 6' : undefined}
          markerEnd={arrow ? `url(#fw-arrow-${color})` : undefined}
        />
      ))}
    </svg>

    <SwitchToggle cx={334} cy={637} on={FEE_SWITCHES.pol === 'ON'} />
    <SwitchToggle cx={152} cy={728} on={FEE_SWITCHES.marketplace === 'ON'} />

    {FLOW_LABELS.map(({ text, className }) => (
      <p key={text} className={`absolute text-sm font-medium text-[#606F85] ${className}`}>
        {text}
      </p>
    ))}

    {/* PoL fee switch — static copy until the on-chain switch has a data source. */}
    <div className="absolute left-[334px] top-[661px] -translate-x-1/2 flex flex-row gap-[2px] text-xs font-bold leading-5 text-black">
      <p>{FEE_SWITCHES.pol}</p>
      <Popover
        align="center"
        side="bottom"
        iconSize={16}
        contentClassName="w-[320px] text-left font-normal"
      >
        {TOOLTIPS.polFeeSwitch}
      </Popover>
    </div>

    {/* Marketplace fee switch on the burn path. */}
    <div className="absolute left-[168px] top-[720px] flex flex-row gap-[2px] text-xs font-bold leading-5 text-black">
      <p>{FEE_SWITCHES.marketplace}</p>
      <Popover
        align="center"
        side="right"
        iconSize={16}
        contentClassName="w-[382px] text-left font-normal"
      >
        <strong>Fees collected</strong> can be turned on or off by the Governors of the Olas
        Protocol. Currently, fees are turned on; they are designed to buy back and burn OLAS as the
        marketplace is used.
        <ExternalLink
          href={`${VALORY_GIT_URL}/autonolas-aip/blob/main/content/aips/aip-5/automate_relayer_marketplace.md`}
          className="mt-2 cursor-pointer"
        >
          More about Mech Marketplace fees in AIP-5
        </ExternalLink>
      </Popover>
    </div>
  </>
);
