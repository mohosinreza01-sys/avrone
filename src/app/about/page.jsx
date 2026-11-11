import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Shirt,
  Sun,
} from "lucide-react";

const principles = [
  {
    icon: Sun,
    title: "Made for our days",
    description:
      "Easy-to-wear choices for warm Dhaka days, busy routines, and plans around town.",
  },
  {
    icon: Shirt,
    title: "Comfort comes first",
    description:
      "Panjabi, shirts, and everyday favourites that feel natural from morning to evening.",
  },
  {
    icon: CalendarDays,
    title: "Ready for the occasion",
    description:
      "Find a look for Eid visits, family dawats, workdays, and weekends.",
  },
];

export const metadata = {
  title: "About AVRONE | Everyday Style, Thoughtfully Considered",
  description:
    "Discover AVRONE: thoughtful menswear and everyday essentials for life in Bangladesh.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#F8F7F4] text-[#173d38]">
      <section className="mx-auto max-w-4xl px-5 pb-8 pt-10 text-center md:px-10 md:pb-10 md:pt-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7944]">
            About AVRONE
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
            Everyday style, made for life in Bangladesh.
          </h1>
        </div>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#68736d] sm:text-base sm:leading-8">
          From warm days in Dhaka to Eid visits and family dawats, discover
          comfortable Panjabi, shirts, and everyday styles made to feel right
          for the occasion.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#173d38] px-5 text-sm font-medium text-white transition hover:bg-[#245b53]"
          >
            Shop the collection
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ded6c8] px-5 text-sm font-medium text-[#173d38] transition hover:border-[#b99458] hover:bg-white"
          >
            Talk to our team
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-10 lg:px-12">
        <Link
          href="/collections/winter-collection"
          aria-label="Explore the AVRONE Winter Collection"
          className="block overflow-hidden bg-[#eaf0f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#075b54]"
        >
          <Image
            src="/images/avrone-winter-campaign.png"
            alt="AVRONE Winter Collection: Dress Better, Live Better. Stay warm, stay stylish."
            width={2048}
            height={768}
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="block h-auto w-full"
          />
        </Link>
      </section>

      <section className="border-y border-[#e7e0d4] bg-[#f3f0e9]">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16 lg:px-12">
          <div className="mx-auto mb-9 max-w-2xl text-center md:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7944]">
              What matters to us
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
              The AVRONE approach
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#68736d]">
              Thoughtful everyday style, shaped around how life is lived here.
            </p>
          </div>
          <div className="grid divide-y divide-[#ded6c8] md:grid-cols-3 md:divide-x md:divide-y-0">
            {principles.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="px-5 py-6 text-center md:px-7 md:py-3 lg:px-10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d6c6a5] bg-white/70 text-[#806b47]">
                  <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <p className="mt-4 text-[11px] font-medium tracking-[0.16em] text-[#a98a52]">
                  0{index + 1}
                </p>
                <h3 className="mt-2 text-lg font-medium">{title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#68736d]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-[#173d38] px-6 py-8 text-white sm:px-9 sm:py-10 md:flex-row md:items-center md:px-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#e2c995]">
              <Heart size={16} aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                Find your AVRONE
              </p>
            </div>
            <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
              Your next everyday favourite is waiting.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Take a look at the styles currently available in our shop.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#d3b77f] px-6 text-sm font-semibold text-[#173d38] transition hover:bg-[#e2c995]"
          >
            Browse styles
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
