import { Download, Repeat2, Shuffle } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image.js';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Footer from 'components/Layout/Footer';
import Header from 'components/Layout/Header';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';

const ImageCarousel = ({
  images,
  intervalMs = 5000,
  sizes = '(max-width: 1024px) 100vw, 920px',
  index,
  onIndexChange,
}) => {
  const isControlled =
    typeof index === 'number' && typeof onIndexChange === 'function';
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = isControlled ? index : internalIndex;
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      if (isControlled) {
        onIndexChange((p) => (p + 1) % images.length);
      } else {
        setInternalIndex((p) => (p + 1) % images.length);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [paused, images.length, intervalMs, isControlled, onIndexChange]);

  return (
    <div
      className="relative w-full aspect-[1200/630] bg-gradient-to-b from-white to-[#EEF3FA] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Olas community card"
          fill
          sizes={sizes}
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

const IMAGE_PATHS = [
  '/images/community-card/archer-pearl.png',
  '/images/community-card/pearl-fighting-ai-corp.png',
  '/images/community-card/seven-sleep.png',
];

const TWEET_TEXT = [
  `Your AI no longer needs to be owned or controlled by Big Tech. 🙇
Pearl v1 — the “AI agent app store” by @autonolas — is now live for everyone. 🔥
Web3's self-custody meets Web2 simplicity.
Download Pearl → https://olas.network/pearl`,
  `Big Tech shouldn't own your AI. You should. 🦾
Pearl v1 by @autonolas is live — the “AI agent app store” that lets you truly own and control your AI agent. 🫡
Built on Web3 foundations, wrapped in a Web2-smooth experience.
Own your AI 👉 https://olas.network/pearl`,
];

const StepLabel = ({ label }) => {
  return (
    <div
      className="mb-3 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-slate-600"
      style={{ backgroundColor: '#F2F4F9' }}
    >
      {label}
    </div>
  );
};

const CommunityCardClient = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const currentImage = useMemo(
    () => IMAGE_PATHS[carouselIndex],
    [carouselIndex],
  );

  const shuffle = useCallback(() => {
    setCarouselIndex((p) => (p + 1) % IMAGE_PATHS.length);
  }, []);

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
    return TWEET_TEXT[index];
  }, []);

  const shareUrl = useMemo(() => {
    const intent = new URL('https://x.com/intent/tweet');
    intent.searchParams.set('text', shareText);
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
                onIndexChange={setCarouselIndex}
                sizes="(max-width: 1024px) 100vw, 920px"
              />
            </div>
          </div>

          <div className="relative z-10 mt-2 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full max-w-[920px]">
            <Card className="p-4 border-none shadow-none">
              <StepLabel label="Step 1" />
              <div className="text-sm">Generate the card you like.</div>
              <div className="mt-4 md:mt-6">
                <Button onClick={shuffle} variant="outline">
                  <Shuffle className="mr-2 h-4 w-4" />
                  Shuffle Card
                </Button>
              </div>
            </Card>
            <Card className="p-4 border-none shadow-none">
              <StepLabel label="Step 2 — Optional" />
              <div className="text-sm">Download the card.</div>
              <div className="mt-6">
                <Button onClick={download} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Card
                </Button>
              </div>
            </Card>
            <Card className="p-4 border-none shadow-none">
              <StepLabel label="Step 3" />
              <div className="text-sm">Share your excitement on X!</div>
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
              <Image
                src="/images/community-card/operate-logo.png"
                width={48}
                height={48}
                alt="Operate Logo"
                className="mx-4"
              />
              Pearl
              <span
                className="text-xl sm:text-2xl md:text-2xl rounded-xl border flex items-center justify-center mx-4"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(180deg, #FFF 0%, #EAEFF6 100%)',
                }}
              >
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
