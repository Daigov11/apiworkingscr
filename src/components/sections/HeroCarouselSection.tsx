'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

type HeroCarouselSlide = {
  id?: string | number;
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  mobileImage?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaHref?: string;
  overlay?: boolean;
  contentPosition?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
  accentColor?: string;
};

export type HeroCarouselSectionData = {
  items: HeroCarouselSlide[];
  autoplay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'lg' | 'xl' | '2xl' | '3xl';
};

type HeroCarouselSectionProps = {
  data: HeroCarouselSectionData;
};

const heightClasses: Record<NonNullable<HeroCarouselSectionData['height']>, string> = {
  sm: 'min-h-[320px] md:min-h-[360px]',
  md: 'min-h-[380px] md:min-h-[430px]',
  lg: 'min-h-[420px] md:min-h-[520px]',
  xl: 'min-h-[480px] md:min-h-[620px]',
};

const roundedClasses: Record<NonNullable<HeroCarouselSectionData['rounded']>, string> = {
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[2rem]',
  '3xl': 'rounded-[2.5rem]',
};

const positionClasses = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function HeroCarouselSection({ data }: HeroCarouselSectionProps) {
  const {
    items = [],
    autoplay = true,
    interval = 5000,
    pauseOnHover = true,
    showDots = true,
    showArrows = true,
    height = 'lg',
    rounded = 'xl',
  } = data;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = items.length;

  const canNavigate = total > 1;

  const resolvedHeightClass = useMemo(() => heightClasses[height] ?? heightClasses.lg, [height]);
  const resolvedRoundedClass = useMemo(
    () => roundedClasses[rounded] ?? roundedClasses.xl,
    [rounded]
  );

  const goTo = (index: number) => {
    if (!total) return;
    const nextIndex = (index + total) % total;
    setActiveIndex(nextIndex);
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  useEffect(() => {
    if (!autoplay || !canNavigate || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, interval);

    return () => window.clearInterval(timer);
  }, [autoplay, canNavigate, interval, isPaused, total]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0]?.clientX ?? null;

    if (touchStartX.current == null || touchEndX.current == null) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) goNext();
    if (distance < -minSwipeDistance) goPrev();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!items.length) return null;

  return (
    <section className="w-full">
      <div
        className={`relative isolate overflow-hidden ${resolvedRoundedClass} ${resolvedHeightClass}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Hero carousel"
        onMouseEnter={pauseOnHover ? () => setIsPaused(true) : undefined}
        onMouseLeave={pauseOnHover ? () => setIsPaused(false) : undefined}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((slide, index) => {
          const isActive = index === activeIndex;
          const contentPosition = slide.contentPosition ?? 'left';
          const theme = slide.theme ?? 'dark';
          const overlayEnabled = slide.overlay !== false;

          const overlayClass =
            theme === 'light'
              ? 'bg-gradient-to-r from-white/90 via-white/75 to-white/10'
              : 'bg-gradient-to-r from-black/70 via-black/45 to-black/10';

          const textClass = theme === 'light' ? 'text-slate-900' : 'text-white';
          const descriptionClass = theme === 'light' ? 'text-slate-700' : 'text-white/85';
          const eyebrowClass = theme === 'light' ? 'text-slate-700' : 'text-white/90';

          return (
            <article
              key={slide.id ?? `${slide.title}-${index}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              <div className="absolute inset-0">
                <picture>
                  {slide.mobileImage ? (
                    <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                  ) : null}
                  <img
                    src={slide.image}
                    alt={slide.imageAlt ?? slide.title}
                    className="h-full w-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </picture>
                {overlayEnabled ? <div className={`absolute inset-0 ${overlayClass}`} /> : null}
              </div>

              <div className="relative z-10 flex h-full px-6 py-8 md:px-10 md:py-10 lg:px-14">
                <div
                  className={`flex w-full max-w-2xl flex-col justify-center gap-4 ${
                    positionClasses[contentPosition]
                  }`}
                >
                  {slide.eyebrow ? (
                    <span className={`text-sm font-semibold md:text-base ${eyebrowClass}`}>
                      {slide.eyebrow}
                    </span>
                  ) : null}

                  <h1
                    className={`max-w-[16ch] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl ${textClass}`}
                  >
                    {slide.title}
                  </h1>

                  {slide.description ? (
                    <p className={`max-w-[52ch] text-sm md:text-base lg:text-lg ${descriptionClass}`}>
                      {slide.description}
                    </p>
                  ) : null}

                  {slide.ctaText && slide.ctaHref ? (
                    <div className="pt-2">
                      <Link
                        href={slide.ctaHref}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
                        style={{
                          backgroundColor: slide.accentColor || '#ec4899',
                        }}
                      >
                        {slide.ctaText}
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}

        {showArrows && canNavigate ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Slide anterior"
              className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-md transition hover:bg-white"
            >
              <ArrowLeftIcon />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Siguiente slide"
              className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-md transition hover:bg-white"
            >
              <ArrowRightIcon />
            </button>
          </>
        ) : null}

        {showDots && canNavigate ? (
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {items.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={slide.id ?? `dot-${index}`}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ir al slide ${index + 1}`}
                  aria-current={isActive}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive ? 'w-8 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/80'
                  }`}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}