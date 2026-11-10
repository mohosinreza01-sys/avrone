import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative bg-[#EAE8E2] overflow-hidden">

            <div className="relative min-h-[570px] lg:min-h-[650px] grid lg:grid-cols-2">

                {/* Left Content */}
                <div className="relative z-10 flex flex-col justify-center px-7 md:px-14 lg:px-20 py-16">

                    <span className="text-[10px] tracking-[0.35em] uppercase mb-7">
                        AVRONE LIFESTYLE — EST. 2026
                    </span>

                    <h1 className="font-serif text-[48px] md:text-[65px] lg:text-[76px] leading-[0.98] tracking-tight text-[#111820]">
                        Elevate Your
                        <br />
                        <span className="italic">Everyday Style.</span>
                    </h1>

                    <p className="text-sm md:text-base text-gray-600 mt-7 max-w-sm leading-7">
                        Discover timeless essentials designed for
                        confidence, comfort and a modern lifestyle.
                    </p>

                    <div className="mt-9">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-4 bg-[#111820] text-white px-7 py-4 text-xs tracking-wider uppercase hover:bg-[#333] transition"
                        >
                            Explore Collection
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="mt-16 flex items-center gap-5 text-xs text-gray-500 tracking-widest">
                        <span>01</span>
                        <span className="w-10 h-px bg-gray-400" />
                        <span>PREMIUM MENSWEAR</span>
                    </div>

                </div>

                {/* Right Image */}
                <div className="relative min-h-[420px] lg:min-h-full">

                    <Image
                        src="/images/banners/hero-desktop.webp"
                        alt="Avrone premium men's fashion collection"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    <div className="absolute bottom-10 right-10 text-white text-right">
                        <p className="text-xs tracking-[0.4em]">AVRONE</p>
                        <p className="text-[10px] tracking-[0.25em] mt-2">
                            DRESS BETTER. LIVE BETTER.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}