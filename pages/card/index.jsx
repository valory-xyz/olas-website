import {
  CheckCircle2,
  Download,
  LucideCopy,
  Repeat2,
  Shuffle,
  X,
  XCircle,
} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Footer from 'components/Layout/Footer';
import Header from 'components/Layout/Header';
import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';

const TOAST_MESSAGES = {
  SUCCESS: 'Image copied to clipboard!',
  ERROR: 'Copying to the clipboard failed, please download the card.',
};

const IMAGE_SIZES =
  '(max-width: 1024px) 100vw, (max-width: 1480px) 720px, 920px';
const IMAGE_CONTAINER_CLASSES =
  'mt-6 md:mt-8 w-full max-w-[920px] xl:max-w-[720px] min-[1480px]:max-w-[920px] 2xl:max-w-[920px]';
const STEPS_CONTAINER_CLASSES =
  'relative z-10 mt-2 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full max-w-[920px] xl:max-w-[720px] min-[1480px]:max-w-[920px]';

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

const IMAGE_PATHS = [
  '/images/community-card/David vs Goliath - I Own My AI with Pearl v1.webp',
  '/images/community-card/David vs Goliath - Own Your AI with Pearl v1.webp',
  '/images/community-card/Gladiator - I Own My AI with Pearl v1.webp',
  '/images/community-card/Gladiator - Own Your AI with Pearl v1.webp',
  '/images/community-card/Gladiator - Pearl v1_ the Dawn of AI Ownership.webp',
  '/images/community-card/Renaissance - I Own My AI with Pearl v1.webp',
  '/images/community-card/Renaissance - Own Your AI with Pearl v1.webp',
  '/images/community-card/Robin Hood - I Own My AI with Pearl v1.webp',
  '/images/community-card/Robin Hood - Own Your AI with Pearl v1.webp',
  '/images/community-card/Seven Sleep - I Own My AI with Pearl v1.webp',
  '/images/community-card/Seven Sleep - Own Your AI with Pearl v1.webp',
  '/images/community-card/Superman - I Own My AI with Pearl v1.webp',
  '/images/community-card/Superman - Own Your AI with Pearl v1.webp',
];

const TWEET_TEXT = [
  `Big Tech had its turn owning your AI. Now it's yours.

Pearl v1: the "AI agent app store" by @autonolas lets you truly own your AI.

Own your agents. Live your life.

Download Pearl → https://olas.network/pearl
`,
  `Big Tech shouldn't own your AI. You should.

Pearl v1 by @autonolas is the "AI agent app store" that lets you truly own your AI agent.

Own your agents. Live your life.

Download Pearl 👉 https://olas.network/pearl
`,
];

const StepLabel = ({ label }) => {
  return (
    <div
      className="mb-3 inline-flex items-center rounded px-2 py-0.5 text-sm font-medium text-slate-600 w-fit"
      style={{ backgroundColor: '#F2F4F9' }}
    >
      {label}
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-300' : 'border-red-300';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} ${borderColor} ${textColor} border rounded-lg shadow-lg px-4 py-3 flex items-center gap-2 min-w-[280px] max-w-[90vw] animate-in slide-in-from-bottom-5`}
      role="alert"
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const CommunityCardClient = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [order, setOrder] = useState(() =>
    generateShuffledIndices(IMAGE_PATHS.length, 0),
  );
  const [orderPos, setOrderPos] = useState(0);
  const [toast, setToast] = useState(null);
  const [canCopy, setCanCopy] = useState(false);

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

  const [shareText, setShareText] = useState('');

  useEffect(() => {
    const index = Math.floor(Math.random() * TWEET_TEXT.length);
    setShareText(TWEET_TEXT[index] ?? '');
  }, []);

  const shareUrl = useMemo(() => {
    const intent = new URL('https://x.com/intent/tweet');
    intent.searchParams.set('text', shareText);

    const quoteTweetUrl = process.env.NEXT_PUBLIC_QUOTE_TWEET_URL;
    if (quoteTweetUrl) {
      intent.searchParams.set('url', quoteTweetUrl);
    }

    return intent.toString();
  }, [shareText]);

  useEffect(() => {
    try {
      const supported =
        typeof navigator !== 'undefined' &&
        !!navigator.clipboard &&
        typeof window !== 'undefined' &&
        'ClipboardItem' in window;
      setCanCopy(Boolean(supported));
    } catch (error) {
      console.error(error);
      setCanCopy(false);
    }
  }, []);

  const copyImageToClipboard = useCallback(async () => {
    try {
      if (
        typeof navigator === 'undefined' ||
        !navigator.clipboard ||
        typeof window === 'undefined' ||
        !('ClipboardItem' in window)
      ) {
        setToast({
          message: TOAST_MESSAGES.ERROR,
          type: 'error',
        });
        return;
      }

      // Load the image
      const img = await new Promise((resolve, reject) => {
        const image = new window.Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = currentImage;
      });

      // Draw to canvas and convert to PNG (more compatible than WEBP)
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setToast({
          message: TOAST_MESSAGES.ERROR,
          type: 'error',
        });
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Convert to PNG blob
      const pngBlob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          },
          'image/png',
          1.0,
        );
      });

      // Copy PNG to clipboard (PNG is more widely supported)
      const item = new window.ClipboardItem({ 'image/png': pngBlob });
      await navigator.clipboard.write([item]);
      setToast({
        message: TOAST_MESSAGES.SUCCESS,
        type: 'success',
      });
    } catch (e) {
      console.error('Failed to copy image to clipboard:', e);
      setToast({
        message: TOAST_MESSAGES.ERROR,
        type: 'error',
      });
    }
  }, [currentImage]);

  return (
    <section className="relative isolate px-4 lg:px-6 top-0 top-[-120px] md:top-[-200px]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 z-0" />
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center">
          <div className={IMAGE_CONTAINER_CLASSES}>
            <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-black/5 bg-white relative z-10">
              <ImageCarousel
                images={IMAGE_PATHS}
                index={carouselIndex}
                sizes={IMAGE_SIZES}
              />
            </div>
          </div>

          <div className={STEPS_CONTAINER_CLASSES}>
            <Card className="p-4 border-none shadow-none h-full flex flex-col">
              <StepLabel label="Step 1" />
              <div className="text-base">Generate the card you like.</div>
              <div className="mt-auto pt-4 md:pt-6">
                <Button onClick={shuffle} variant="outline">
                  <Shuffle className="mr-2 h-4 w-4" />
                  Shuffle Card
                </Button>
              </div>
            </Card>
            <Card className="p-4 border-none shadow-none h-full flex flex-col">
              <StepLabel label="Step 2" />
              <div className="text-base">
                {canCopy
                  ? 'Copy to clipboard or download your card.'
                  : 'Download your card.'}
              </div>
              <div className="mt-auto pt-6">
                <div className="flex flex-row gap-2">
                  {canCopy && (
                    <Button onClick={copyImageToClipboard} variant="outline">
                      <LucideCopy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  )}
                  <Button onClick={download} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-none shadow-none h-full flex flex-col">
              <StepLabel label="Step 3" />
              <div className="text-base w-1/2 md:w-full">
                Share on X and attach your card.
              </div>
              <div className="mt-auto pt-6">
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
