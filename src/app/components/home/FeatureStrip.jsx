
import { Sparkles, Truck, RefreshCw } from "lucide-react";

const features = [
    {
        icon: Sparkles,
        title: "New-season styles",
        subtitle: "Explore the latest collection",
    },
    {
        icon: Truck,
        title: "Free delivery over ৳3,000",
        subtitle: "Complimentary shipping",
    },
    {
        icon: RefreshCw,
        title: "Easy 7-day exchanges",
        subtitle: "A seamless shopping experience",
    },
];

export default function FeatureStrip() {
    return (
        <section className="bg-[#F8F6F0] border-y border-[#075B54]/10">
            <div className="mx-auto grid max-w-[1500px] grid-cols-1 sm:grid-cols-3">

                {features.map(({ icon: Icon, title, subtitle }, index) => (
                    <div
                        key={title}
                        className={`group flex items-center justify-center gap-4 px-5 py-6 transition-all duration-300 hover:bg-[#075B54] sm:py-7 ${index !== 0
                                ? "border-t border-[#075B54]/10 sm:border-l sm:border-t-0"
                                : ""
                            }`}
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#C6A15B]/50 text-[#B58B45] transition-all duration-300 group-hover:border-[#C6A15B] group-hover:bg-[#C6A15B] group-hover:text-[#075B54]">
                            <Icon size={19} strokeWidth={1.5} />
                        </div>

                        <div>
                            <h3 className="text-[12px] font-semibold tracking-[0.10em] text-[#183A35] transition-colors group-hover:text-white sm:text-[13px]">
                                {title}
                            </h3>

                            <p className="mt-1 text-[10px] tracking-wide text-[#777D76] transition-colors group-hover:text-white/65">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                ))}

            </div>
        </section>
    );
}
