import Image from 'next/image';

const initialBubbles = [
  { icon: '0x61726469616e.png', link: 'https://x.com/0x61726469616e' },
  { icon: '8baller11.png', link: 'https://x.com/8baller11' },
  { icon: 'angrybayblade.png', link: 'https://x.com/angrybayblade' },
  { icon: 'anon.png', link: 'https://x.com/keeevin' },
  { icon: 'bradrian_0x.png', link: 'https://x.com/bradrian_0x' },
  { icon: 'brahmafi.png', link: 'https://x.com/BrahmaFi' },
  { icon: 'bubble.png', link: 'https://x.com/MLescrauwaet' },
  { icon: 'contentwillvary.png', link: 'https://x.com/contentwillvary' },
  { icon: 'david_enim.png', link: 'https://x.com/david_enim' },
  { icon: 'dvilelaf.png', link: 'https://x.com/dvilelaf' },
  { icon: 'federiconitidi.png', link: 'https://x.com/federiconitidi' },
  { icon: 'jose.png', link: null },
  { icon: 'kupermind.png', link: 'https://x.com/kupermind' },
  { icon: 'manos.png', link: null },
  { icon: 'mltech.png', link: 'https://x.com/MLTech' },
  { icon: 'mohan_das_.png', link: 'https://x.com/Mohan_Das_' },
  { icon: 'mralbertchen.png', link: 'https://x.com/mralbertchen' },
  { icon: 'nonstopTheo.png', link: 'https://x.com/nonstopTheo' },
  { icon: 'philism_.png', link: 'https://x.com/philism_' },
  { icon: 'postmint_xyz.png', link: 'https://x.com/postmint_xyz' },
  { icon: 'proofgp.png', link: 'https://x.com/proofgp' },
  { icon: 'semanticvc.png', link: 'https://x.com/semanticvc' },
  { icon: 'signature_vc.png', link: 'https://x.com/signature_vc' },
  { icon: 'tannedoaksprout.png', link: 'https://x.com/tannedoaksprout' },
  { icon: 'thomasmaybrier.png', link: 'https://x.com/thomasmaybrier' },
  { icon: 'trueventures.png', link: 'https://x.com/trueventures' },
  { icon: 'twipia6.png', link: 'https://x.com/twiPia6' },
  { icon: 'valorianxyz.png', link: 'https://x.com/valorianxyz' },
  { icon: 'x10xalex.png', link: 'https://x.com/x10xalex' },
];

const layout = {
  top: [6, 8],
  middleLeft: [1, 2],
  middleRight: [2, 1],
  bottom: [8, 5],
};

const bubblesLength = initialBubbles.length;
const layoutLength = Object.values(layout)
  .flat()
  .reduce((sum, total) => sum + total, 0);

// Fill with remaining bubbles with placeholder
// to have the same size as in layout config
const paddedBubbles = [
  ...initialBubbles,
  ...Array(layoutLength - bubblesLength).fill({
    icon: 'placeholder.png',
    link: null,
  }),
];

// Shuffle the final array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const bubbles = shuffleArray(paddedBubbles);

const Bubble = ({ size = 32, rotation = 0, href, icon }) => {
  const Tag = href ? 'a' : 'div';
  const tagProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Tag {...tagProps} title={href}>
      <div
        style={{
          width: size,
          height: size,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <Image
          alt="profile image"
          src={`/images/about/founders/${icon}`}
          className={`rounded-full ${href ? 'hover:scale-110' : ''}`}
          height={size}
          width={size}
        />
      </div>
    </Tag>
  );
};

const BubbleRow = ({ count, bubbles }) => (
  <div className={`flex justify-center gap-2`}>
    {Array.from({ length: count }).map((_, idx) => {
      const bubble = bubbles[idx];
      return bubble ? (
        <Bubble
          key={bubble.id || idx}
          size={20 + Math.floor(Math.random() * 20)}
          rotation={(Math.random() - 0.5) * 60}
          href={bubble.link}
          icon={bubble.icon}
        />
      ) : (
        <div key={`placeholder-${idx}`} className="w-[32px] h-[32px]" />
      );
    })}
  </div>
);

export const BubbleRing = () => {
  let bubbleIndex = 0;

  const nextBubbles = (count) => {
    const slice = bubbles.slice(bubbleIndex, bubbleIndex + count);
    bubbleIndex += count;
    return slice;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Top */}
      {layout.top.map((count, i) => (
        <BubbleRow
          key={`top-${i}`}
          count={count}
          bubbles={nextBubbles(count)}
        />
      ))}

      {/* Middle */}
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-4 items-center">
          {layout.middleLeft.map((count, i) => (
            <BubbleRow
              key={`ml-${i}`}
              count={count}
              bubbles={nextBubbles(count)}
            />
          ))}
        </div>

        <div className="text-center font-semibold text-[#606F85] my-6">
          ~50 founding members
        </div>

        <div className="flex flex-col gap-4 items-center">
          {layout.middleRight.map((count, i) => (
            <BubbleRow
              key={`mr-${i}`}
              count={count}
              bubbles={nextBubbles(count)}
            />
          ))}
        </div>
      </div>

      {/* Bottom */}
      {layout.bottom.map((count, i) => (
        <BubbleRow
          key={`bottom-${i}`}
          count={count}
          bubbles={nextBubbles(count)}
        />
      ))}
    </div>
  );
};
