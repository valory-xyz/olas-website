import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';

import { Card } from 'components/ui/card';
import models from 'data/models.json';
import { cn } from 'lib/utils';

/** Unannounced models, shown as dimmed neighbours so the carousel reads as a set. */
const PLACEHOLDER_COUNT = 3;

/** Drag distance (px) past which a release advances a slide instead of snapping back. */
const SWIPE_THRESHOLD = 50;

/** Movement (px) that separates a click on the card from the start of a drag. */
const DRAG_THRESHOLD = 5;

type Slide = {
  key: string;
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  gradientColor?: string;
  comingSoon: boolean;
};

const slides: Slide[] = [
  ...models.map((model) => ({ ...model, key: model.link, comingSoon: false })),
  ...Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
    key: `coming-soon-${i}`,
    comingSoon: true,
  })),
];

/**
 * Signed distance from the active slide, wrapped so slide 0 sits next to the
 * last one. Without the wrap the first card would have no left-hand neighbour.
 */
const getOffset = (index: number, activeIndex: number, total: number) => {
  const raw = (index - activeIndex + total) % total;
  return raw > total / 2 ? raw - total : raw;
};

/** Neighbours shrink and fade; anything further out is parked off-stage. */
const getSlideStyle = (offset: number, dragX: number): React.CSSProperties => {
  const distance = Math.abs(offset);
  const scale = distance === 0 ? 1 : 0.84;
  return {
    transform: `translateX(calc(${offset * 72}% + ${dragX}px)) scale(${scale})`,
    opacity: distance > 1 ? 0 : distance === 0 ? 1 : 0.55,
    zIndex: 10 - distance,
  };
};

/**
 * Arrows sit on top of the card's left/right edges, outside the drag surface —
 * inside it, the stage's pointer capture would swallow their click.
 */
const ARROW_CLASS =
  'absolute top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-colors hover:bg-slate-50';

/**
 * Both card faces. `agent-economy-card-opaque` is what stops the dimmed
 * neighbours reading through the centred card, which they do by default
 * because the shared gradient fades to 50% alpha at the bottom.
 */
const CARD_CLASS =
  'agent-economy-card agent-economy-card-opaque p-10 flex flex-col gap-y-8 place-items-center text-center w-full h-full justify-center';

const ModelCard = ({ slide }: { slide: Slide }) => (
  <Card
    className={CARD_CLASS}
    style={{ '--gradient-color': slide.gradientColor } as React.CSSProperties}
  >
    <Image src={slide.image} alt={slide.title} width={64} height={64} draggable={false} />
    <div className="flex flex-col">
      <h5 className="font-semibold text-xl mb-2">{slide.title}</h5>
      <p className="text-slate-600">{slide.description}</p>
    </div>
  </Card>
);

const ComingSoonCard = () => (
  <Card
    className={CARD_CLASS}
    // Neutral fill instead of the brand purple — an unannounced model should not
    // look like a published one.
    style={{ '--gradient-color': 'rgba(148, 163, 184, 0.25)' } as React.CSSProperties}
  >
    <div className="size-16 rounded-full bg-slate-300/50" />
    <p className="font-semibold text-xl text-slate-500">Coming soon</p>
  </Card>
);

export const ModelsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const dragStartX = useRef<number | null>(null);
  // Survives the drag reset so the click that follows a drag can be suppressed.
  const didDrag = useRef(false);

  const step = useCallback((direction: number) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;
    didDrag.current = false;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const delta = event.clientX - dragStartX.current;

    // Capture only once the pointer has actually moved, never on pointerdown:
    // while an element holds pointer capture the browser retargets the click to
    // it, so capturing up front swallowed every click on the card's link.
    // Capturing here still keeps a drag that runs off the card alive.
    if (!didDrag.current && Math.abs(delta) > DRAG_THRESHOLD) {
      didDrag.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    setDragX(delta);
  };

  const onPointerUp = () => {
    if (dragStartX.current === null) return;
    if (Math.abs(dragX) > SWIPE_THRESHOLD) step(dragX < 0 ? 1 : -1);
    dragStartX.current = null;
    setDragX(0);
  };

  const isDragging = dragStartX.current !== null;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Olas models"
      className="flex flex-col items-center"
    >
      {/* `--card-w` drives both the stage width and the arrow offsets, so the two
          stay aligned across breakpoints from a single value. */}
      <div className="relative flex w-full justify-center [--card-w:280px] sm:[--card-w:360px]">
        <button
          type="button"
          aria-label="Previous model"
          onClick={() => step(-1)}
          style={{ left: 'calc(50% - var(--card-w) / 2)' }}
          className={cn(ARROW_CLASS, '-translate-x-1/2')}
        >
          <ChevronLeft size={20} />
        </button>

        <div
          // `touch-action: pan-y` lets a horizontal drag reach these handlers while
          // a vertical one still scrolls the page.
          className="relative h-[340px] w-[var(--card-w)] shrink-0 touch-pan-y select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') step(-1);
            if (event.key === 'ArrowRight') step(1);
          }}
          tabIndex={0}
        >
          {slides.map((slide, index) => {
            const offset = getOffset(index, activeIndex, slides.length);
            const isActive = offset === 0;

            return (
              <div
                key={slide.key}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
                style={getSlideStyle(offset, dragX)}
                className={cn(
                  'absolute inset-0',
                  // Transitions off mid-drag so the card tracks the pointer, then
                  // back on for the release so it eases into place.
                  isDragging
                    ? 'transition-none'
                    : 'transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none',
                  // Only the centred card takes clicks — a half-hidden neighbour
                  // must not be a click target.
                  isActive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                )}
              >
                {slide.comingSoon ? (
                  <ComingSoonCard />
                ) : (
                  <Link
                    href={slide.link}
                    tabIndex={isActive ? 0 : -1}
                    aria-hidden={!isActive}
                    draggable={false}
                    // A drag that ends on the card must not also follow the link.
                    onClick={(event) => {
                      if (didDrag.current) event.preventDefault();
                    }}
                    className="block h-full w-full"
                  >
                    <ModelCard slide={slide} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Next model"
          onClick={() => step(1)}
          style={{ right: 'calc(50% - var(--card-w) / 2)' }}
          className={cn(ARROW_CLASS, 'translate-x-1/2')}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
