import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "The fit is exactly what I was looking for—comfortable through the day and still put together.",
    name: "AVRONE customer",
    location: "Dhaka",
    product: "Everyday Heavyweight Tee",
  },
  {
    quote:
      "The fabric and small details feel thoughtful. It has quickly become one of my most-worn pieces.",
    name: "AVRONE customer",
    location: "Chattogram",
    product: "Atelier Wool Overshirt",
  },
  {
    quote:
      "Simple to style, easy to wear, and the delivery experience was smooth from start to finish.",
    name: "AVRONE customer",
    location: "Sylhet",
    product: "Customer experience",
  },
];

export default function HomepageTestimonials() {
  return (
    <section className="bg-[#111820] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:px-12">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="text-[9px] uppercase tracking-[0.38em] text-white/55">Kind words</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight md:text-5xl">Made to wear. Loved in real life.</h2>
          <p className="mt-4 text-xs leading-6 text-white/55">
            Sample testimonials for the storefront design. Replace with verified customer reviews before launch.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <figure key={item.product} className={`flex h-full flex-col rounded-[1.4rem] border border-white/10 p-6 md:p-7 ${index === 1 ? "bg-white/[0.08]" : "bg-white/[0.04]"}`}>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-[#D7C2A0]" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, star) => <Star key={star} size={12} fill="currentColor" strokeWidth={1} />)}
                </div>
                <Quote size={21} className="text-white/35" />
              </div>
              <blockquote className="mt-6 flex-1 font-serif text-xl leading-relaxed text-white/90">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-7 border-t border-white/10 pt-5">
                <p className="text-[10px] uppercase tracking-[0.16em]">{item.name}</p>
                <p className="mt-1 text-[10px] text-white/50">{item.location} · {item.product}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
