"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    kind: "artwork",
    eyebrow: "AVRONE · WINTER COLLECTION",
    image: "/images/avrone-winter-campaign.png",
    alt: "AVRONE winter collection campaign: Dress Better, Live Better. Stay warm, stay stylish.",
    href: "/collections/winter-collection",
  },
  {
    eyebrow: "AVRONE · Dhaka, Bangladesh",
    title: "Made for the",
    accent: "way you move.",
    description:
      "Thoughtful menswear for Dhaka days and everywhere life takes you. Easy silhouettes, considered details, made to feel like your own.",
    image:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=90",
    alt: "Man wearing a relaxed denim jacket in the city",
    note: "THE EVERYDAY, ELEVATED",
    offerSlide: true,
  },
  {
    eyebrow: "THE NEW SEASON · 2026",
    title: "A little less,",
    accent: "a lot better.",
    description:
      "Build a wardrobe around pieces you will reach for again and again: breathable layers, natural textures, and timeless design.",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=90",
    alt: "Man wearing a tailored navy suit outside a modern building",
    note: "THE NEW SEASON EDIT",
  },
  {
    eyebrow: "EASY DAYS · BETTER DETAILS",
    title: "Find your",
    accent: "everyday uniform.",
    description:
      "From laid-back essentials to the finishing touches, discover versatile style designed for the rhythm of life in Bangladesh.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1600&q=90",
    alt: "Man wearing a dark tailored suit and white shirt",
    note: "DRESS WELL. FEEL YOURSELF.",
  },
];

export default function HomeHeroCarousel({ offerPercent = 0 }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;

    const timer = window.setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [activeSlide, paused]);

  function showSlide(index) {
    setActiveSlide((index + slides.length) % slides.length);
  }

  const artworkActive = slides[activeSlide].kind === "artwork";

  return (
    <section
      className="relative w-full"
      aria-label="AVRONE fashion campaign"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className={artworkActive
        ? "relative isolate aspect-[16/9] overflow-hidden bg-[#eaf0f8] md:aspect-[8/3]"
        : "relative isolate h-[min(68svh,620px)] min-h-[390px] overflow-hidden bg-[#17433c] sm:min-h-[440px] lg:h-[min(48vw,620px)]"
      }>
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            aria-hidden={activeSlide !== index}
            className={`campaign-slide absolute inset-0 transition-opacity duration-1000 ${
              activeSlide === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {slide.kind === "artwork" ? (
              <Link
                href={slide.href}
                aria-label="Explore the AVRONE Winter Collection"
                className="absolute inset-0 focus-visible:outline focus-visible:outline-4 focus-visible:outline-inset focus-visible:outline-[#173d38]"
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-contain"
                />
              </Link>
            ) : (
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                loading={index === activeSlide ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, 96vw"
                className={`campaign-image object-cover object-[center_25%] transition-transform duration-[7000ms] ease-out ${
                  activeSlide === index ? "scale-100" : "scale-105"
                }`}
              />
            )}
          </div>
        ))}
        {!artworkActive && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#092c27]/80 via-[#092c27]/35 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </>
        )}

        {!artworkActive && (
          <div className="absolute inset-x-5 bottom-7 flex flex-col items-start text-white sm:inset-x-10 sm:bottom-10 lg:inset-x-[9%] lg:bottom-14">
          <p className="text-[9px] uppercase tracking-[0.34em] text-white/85 sm:text-[10px]">
            {slides[activeSlide].offerSlide && offerPercent > 0
              ? `Season offer · Save up to ${offerPercent}%`
              : slides[activeSlide].eyebrow}
          </p>
          <div className="campaign-slide mt-4 max-w-2xl">
            <h1 className="font-serif text-5xl leading-[0.96] tracking-tight sm:text-6xl lg:text-[clamp(4rem,7vw,6.5rem)]">
              {slides[activeSlide].title}
              <br />
              <span className="italic">{slides[activeSlide].accent}</span>
            </h1>
            <p className="mt-4 max-w-lg text-xs leading-6 text-white/85 sm:text-sm sm:leading-7">
              {slides[activeSlide].description}
            </p>
          </div>
          <div className="mt-6 flex w-full flex-wrap items-center gap-4 sm:mt-8">
            <Link
              href="/shop"
              className="pointer-events-auto inline-flex min-h-12 items-center gap-3 border border-white/85 bg-white px-7 text-[9px] uppercase tracking-[0.2em] text-[#075b54] transition hover:bg-[#f3ed5b] hover:border-[#f3ed5b]"
            >
              Shop all <ArrowRight size={14} />
            </Link>
            <span className="hidden text-[9px] uppercase tracking-[0.22em] text-white/70 sm:block">
              {slides[activeSlide].note}
            </span>
            <div className="ml-auto flex items-center gap-2" aria-label="Choose campaign slide">
              {slides.map((slide, index) => (
                <button
                  key={slide.eyebrow}
                  type="button"
                  onClick={() => showSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                  aria-current={activeSlide === index ? "true" : undefined}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    activeSlide === index ? "w-8 bg-[#f3ed5b]" : "w-4 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
              <span className="ml-2 text-[9px] tracking-[0.2em] text-white/80">
                0{activeSlide + 1} / 0{slides.length}
              </span>
              <button
                type="button"
                onClick={() => showSlide(activeSlide - 1)}
                aria-label="Previous campaign slide"
                className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 transition hover:bg-white hover:text-[#111820]"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => showSlide(activeSlide + 1)}
                aria-label="Next campaign slide"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 transition hover:bg-white hover:text-[#111820]"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
          </div>
        )}
      </div>
      {artworkActive && (
        <div className="flex h-11 items-center justify-center gap-2 border-b border-[#e1e6ee] bg-[#f5f7fa]">
          <button
            type="button"
            onClick={() => showSlide(activeSlide - 1)}
            aria-label="Previous campaign slide"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d5dce7] bg-white text-[#173d38] transition hover:border-[#173d38]"
          >
            <ArrowLeft size={13} />
          </button>
          {slides.map((slide, index) => (
            <button
              key={slide.eyebrow}
              type="button"
              onClick={() => showSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all ${activeSlide === index ? "w-6 bg-[#173d38]" : "w-1.5 bg-[#aeb8c7] hover:bg-[#657d78]"}`}
            />
          ))}
          <button
            type="button"
            onClick={() => showSlide(activeSlide + 1)}
            aria-label="Next campaign slide"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d5dce7] bg-white text-[#173d38] transition hover:border-[#173d38]"
          >
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </section>
  );
}
