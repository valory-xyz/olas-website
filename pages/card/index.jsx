import { Download, Repeat2, Shuffle } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image.js';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';

import Footer from 'components/Layout/Footer';
import Header from 'components/Layout/Header';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#F9FAFB" offset="20%" />
      <stop stop-color="#F3F4F6" offset="50%" />
      <stop stop-color="#F9FAFB" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#FAFBFC" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

const ImageCarousel = ({
  images,
  sizes = '(max-width: 1024px) 100vw, 920px',
  index,
}) => {
  const activeIndex = index ?? 0;
  const placeholder = `data:image/svg+xml;base64,${toBase64(shimmer(920, 518))}`;

  return (
    <div className="relative w-full aspect-[16/9] bg-gradient-to-b from-white to-[#EEF3FA] overflow-hidden">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Olas community card"
          fill
          sizes={sizes}
          placeholder={placeholder}
          className={
            'object-cover absolute inset-0 will-change-opacity transition-opacity duration-1000 ease-out ' +
            (i === activeIndex ? 'opacity-100' : 'opacity-0')
          }
          priority={i === 0}
        />
      ))}
    </div>
  );
};

function generateShuffledIndices(length, excludeFirstIndex) {
  const indices = Array.from({ length }, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;
  }
  if (
    length > 1 &&
    typeof excludeFirstIndex === 'number' &&
    indices[0] === excludeFirstIndex
  ) {
    // Ensure first pick is not the excluded one to avoid immediate repeat
    const swapWith = 1;
    const tmp = indices[0];
    indices[0] = indices[swapWith];
    indices[swapWith] = tmp;
  }
  return indices;
}

const IMAGE_TO_TWITTER_URL = {
  '/images/community-card/David vs Goliath - I Own My AI with Pearl v1.webp':
    'pic.twitter.com/KThCetoKuM',
  '/images/community-card/David vs Goliath - Own Your AI with Pearl v1.webp':
    'pic.twitter.com/n9baRwwC1d',
  '/images/community-card/Gladiator - I Own My AI with Pearl v1.webp':
    'pic.twitter.com/uZZgeeOLA7',
  '/images/community-card/Gladiator - Own Your AI with Pearl v1.webp':
    'pic.twitter.com/y3oynJjLaB',
  '/images/community-card/Gladiator - Pearl v1_ the Dawn of AI Ownership.webp':
    'pic.twitter.com/7hDSabYoXY',
  '/images/community-card/Renaissance - I Own My AI with Pearl v1.webp':
    'pic.twitter.com/GfOqd5Fyck',
  '/images/community-card/Renaissance - Own Your AI with Pearl v1.webp':
    'pic.twitter.com/43tUCBOoED',
  '/images/community-card/Robin Hood - I Own My AI with Pearl v1.webp':
    'pic.twitter.com/yADMBf1Ew3',
  '/images/community-card/Robin Hood - Own Your AI with Pearl v1.webp':
    'pic.twitter.com/4sNauCqOKw',
  '/images/community-card/Seven Sleep - I Own My AI with Pearl v1.webp':
    'pic.twitter.com/YZmhPpfjmc',
  '/images/community-card/Seven Sleep - Own Your AI with Pearl v1.webp':
    'pic.twitter.com/NHQXfgKrLI',
  '/images/community-card/Superman - I Own My AI with Pearl v1.webp':
    'pic.twitter.com/hOp8SSZgjS',
  '/images/community-card/Superman - Own Your AI with Pearl v1.webp':
    'pic.twitter.com/CGL8JG1EXu',
};

const IMAGE_PATHS = Object.keys(IMAGE_TO_TWITTER_URL);

const TWEET_TEXT = [
  `Your AI no longer needs to be owned or controlled by Big Tech.

Pearl v1 — the "AI agent app store" by @autonolas — is now live for everyone.

Web3's self-custody meets Web2 simplicity.

Download Pearl → https://olas.network/pearl`,
  `Big Tech had its turn owning your AI. Now it's yours.

Pearl v1: the “AI agent app store” by @autonolas lets you truly own your AI.

Own your agents. Live your life.

Download Pearl → https://olas.network/pearl`,
];

const StepLabel = ({ label }) => {
  return (
    <div
      className="mb-3 inline-flex items-center rounded px-2 py-0.5 text-sm font-medium text-slate-600"
      style={{ backgroundColor: '#F2F4F9' }}
    >
      {label}
    </div>
  );
};

const CommunityCardClient = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [order, setOrder] = useState(() =>
    generateShuffledIndices(IMAGE_PATHS.length, 0),
  );
  const [orderPos, setOrderPos] = useState(0);

  const currentImage = useMemo(
    () => IMAGE_PATHS[carouselIndex],
    [carouselIndex],
  );

  const shuffle = useCallback(() => {
    const needsNewOrder = orderPos >= order.length;
    const activeIndex = carouselIndex;

    if (needsNewOrder) {
      const nextOrder = generateShuffledIndices(
        IMAGE_PATHS.length,
        activeIndex,
      );
      setOrder(nextOrder);
      setOrderPos(1);
      setCarouselIndex(nextOrder[0] ?? activeIndex);
    } else {
      setOrderPos((prevPos) => prevPos + 1);
      setCarouselIndex(order[orderPos] ?? activeIndex);
    }
  }, [carouselIndex, order, orderPos]);

  const download = useCallback(() => {
    const link = document.createElement('a');
    link.href = currentImage;
    const filename = currentImage.split('/').pop() || 'olas-community-card.png';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentImage]);

  const shareText = useMemo(() => {
    const index = Math.floor(Math.random() * TWEET_TEXT.length);
    const baseText = TWEET_TEXT[index];
    const twitterImageUrl = IMAGE_TO_TWITTER_URL[currentImage] || '';
    const olasUrlRegex = /(https:\/\/olas\.network\/pearl)/;
    return baseText.replace(olasUrlRegex, `$1\n\n${twitterImageUrl}`);
  }, [currentImage]);

  const shareUrl = useMemo(() => {
    const intent = new URL('https://x.com/intent/tweet');
    intent.searchParams.set('text', shareText);

    const quoteTweetUrl = process.env.NEXT_PUBLIC_QUOTE_TWEET_URL;
    if (quoteTweetUrl) {
      intent.searchParams.set('url', quoteTweetUrl);
    }

    return intent.toString();
  }, [shareText]);

  return (
    <section className="relative isolate px-4 lg:px-6 top-0 top-[-120px] md:top-[-200px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 z-0" />
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center">
          <div className="mt-6 md:mt-8 w-full max-w-[920px]">
            <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-black/5 bg-white relative z-10">
              <ImageCarousel
                images={IMAGE_PATHS}
                index={carouselIndex}
                sizes="(max-width: 1024px) 100vw, 920px"
              />
            </div>
          </div>

          <div className="relative z-10 mt-2 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full max-w-[920px]">
            <Card className="p-4 border-none shadow-none">
              <StepLabel label="Step 1" />
              <div className="text-base">Generate the card you like.</div>
              <div className="mt-4 md:mt-6">
                <Button onClick={shuffle} variant="outline">
                  <Shuffle className="mr-2 h-4 w-4" />
                  Shuffle Card
                </Button>
              </div>
            </Card>
            <Card className="p-4 border-none shadow-none">
              <StepLabel label="Step 2 — Optional" />
              <div className="text-base">Download the card.</div>
              <div className="mt-6">
                <Button onClick={download} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Card
                </Button>
              </div>
            </Card>
            <Card className="p-4 border-none shadow-none">
              <StepLabel label="Step 3" />
              <div className="text-base">Share your excitement on X!</div>
              <div className="mt-6">
                <Button asChild>
                  <Link
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Repeat2 className="mr-2 h-4 w-4" />
                    Share on X
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function CommunityCardPage() {
  return (
    <>
      <Head>
        <title>Olas Community Card • Share on X</title>
        <meta
          name="description"
          content="Generate an Olas community card and share your excitement about Pearl v1 on X."
        />
      </Head>
      <Header />
      <main>
        <section
          className="px-4 lg:px-6 pt-16 md:pt-40 h-[460px] md:h-[524px] border-b border-gray-200"
          style={{
            background: 'linear-gradient(180deg, #FFF 0%, #E9EFF7 100%)',
          }}
        >
          <div className="mx-auto max-w-screen-xl text-center flex flex-col items-center">
            <h1 className="text-4xl sm:text-3xl md:text-5xl leading-[160%] md:leading-[120%] font-semibold tracking-tight flex flex-wrap items-center justify-center">
              Olas Community Celebrates{' '}
              <div className="w-[48px] h-[48px] mx-4 bg-white rounded-xl border flex items-center justify-center">
                <Image
                  src="/images/pearl-page/operate-logo.svg"
                  width={36}
                  height={36}
                  alt="Pearl Logo"
                  className="mx-4"
                />
              </div>
              Pearl
              <span className="bg-white w-[48px] h-[48px] text-xl sm:text-2xl md:text-2xl rounded-xl border flex items-center justify-center mx-4">
                v1
              </span>
            </h1>
            <p className="mt-6 text-slate-600 text-base md:text-lg w-3/4 md:w-full">
              Generate a special community card and share your excitement about
              Pearl v1 on X!
            </p>
          </div>
        </section>
      </main>

      <CommunityCardClient />

      <Footer />
    </>
  );
}
