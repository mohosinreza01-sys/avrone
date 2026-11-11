import { MessageCircle } from "lucide-react";

const whatsappUrl = `https://wa.me/8801963279566?text=${encodeURIComponent(
  "Assalamu alaikum, I need help with AVRONE.",
)}`;

export default function WhatsAppChat() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AVRONE on WhatsApp"
      className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-3 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-medium text-white shadow-[0_4px_16px_rgba(23,61,56,0.2)] transition hover:bg-[#20bd5a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075b54] sm:right-5 md:bottom-5"
    >
      <MessageCircle size={20} aria-hidden="true" />
      <span>Chat with us</span>
    </a>
  );
}
