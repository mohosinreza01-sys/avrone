import Link from "next/link";

const posts = [
  {
    title: "How to build a refined capsule wardrobe",
    excerpt: "A practical guide to layering staples and everyday polish.",
  },
  {
    title: "The best winter layers for comfort and style",
    excerpt: "Focus on elevated textures, warmth, and relaxed tailoring.",
  },
  {
    title: "Why premium essentials keep their value",
    excerpt: "Thoughtful craftsmanship makes quality pieces last longer.",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-[#F8F7F4] px-5 py-16 md:px-10 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="sr-only">AVRONE Journal</h1>

        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Journal</p>
              <h2 className="mt-5 font-serif text-3xl text-[#111820]">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>
              <Link href="/contact" className="mt-6 inline-flex text-xs uppercase tracking-[0.2em] text-[#111820]">
                Read more
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
