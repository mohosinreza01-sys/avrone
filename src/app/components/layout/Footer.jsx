import Link from "next/link";

const footerLinks = [
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Journal", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#075b54]/10 bg-[#124d48] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 lg:px-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-gray-400">
              AVRONE
            </p>
            <h2 className="mt-4 max-w-sm font-serif text-3xl leading-tight text-white">
              Considered fashion and accessories for everyday life.
            </h2>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
              Navigate
            </p>
            <ul className="mt-5 space-y-3 text-sm text-gray-300">
              {footerLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
              Contact
            </p>
            <ul className="mt-5 space-y-3 text-sm text-gray-300">
              <li>hello@avrone.com</li>
              <li>+880 1712 345 678</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 AVRONE. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/shipping" className="hover:text-white">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
