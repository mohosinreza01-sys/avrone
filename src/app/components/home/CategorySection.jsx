import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";

export default function CategorySection() {
    return (
        <section className="py-20 md:py-28 bg-[#F8F7F4]">

            <div className="max-w-[1440px] mx-auto px-5 lg:px-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">

                    <div>
                        <span className="text-[10px] tracking-[0.35em] uppercase text-gray-500">
                            Discover AVRONE
                        </span>

                        <h2 className="font-serif text-4xl md:text-5xl mt-4 text-[#111820]">
                            Explore Collections
                        </h2>
                    </div>

                    <Link
                        href="/collections"
                        className="text-xs uppercase tracking-widest flex items-center gap-2 border-b border-black pb-2 w-fit"
                    >
                        View All Collections
                        <ArrowUpRight size={15} />
                    </Link>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">

                    {categories.map((category) => (
                        <Link
                            href={`/collections/${category.slug}`}
                            key={category.id}
                            className="group relative"
                        >

                            <div className="relative aspect-[3/4] overflow-hidden bg-[#E9E6E0]">

                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 20vw"
                                    className="object-cover transition duration-700 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                                <div className="absolute bottom-5 left-4 text-white">

                                    <h3 className="font-serif text-xl md:text-2xl">
                                        {category.name}
                                    </h3>

                                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest mt-2">
                                        Shop Now
                                        <ArrowUpRight size={13} />
                                    </span>

                                </div>

                            </div>
                        </Link>
                    ))}

                </div>
            </div>
        </section>
    );
}