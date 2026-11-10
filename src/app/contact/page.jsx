import Link from "next/link";
import { ArrowRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

const contactDetails = [
  {
    icon: Mail,
    title: "Email us",
    value: "hello@avrone.com",
    description: "For product support, styling advice, and general questions.",
  },
  {
    icon: Phone,
    title: "Call us",
    value: "+880 1712 345 678",
    description: "Monday to Friday, 9:00 AM – 6:00 PM (GMT+6).",
  },
  {
    icon: MapPin,
    title: "Visit us",
    value: "House 14, Gulshan Avenue, Dhaka 1212",
    description: "Appointments available for showroom consultations.",
  },
  {
    icon: Clock3,
    title: "Store hours",
    value: "Mon – Sat: 10:00 AM – 8:00 PM",
    description: "Sunday: 11:00 AM – 6:00 PM.",
  },
];

const faqs = [
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes. We ship internationally and provide tracked delivery on all standard orders.",
  },
  {
    question: "Can I schedule a styling consultation?",
    answer:
      "Absolutely. Our team can help with wardrobe guidance and product recommendations.",
  },
  {
    question: "How quickly do you respond to customer enquiries?",
    answer:
      "Most messages are answered within one business day, often much sooner.",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-[#F8F7F4] text-[#111820]">
      <h1 className="sr-only">Contact AVRONE</h1>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1.35fr]">
          <div className="space-y-5">
            {contactDetails.map(({ icon: Icon, title, value, description }) => (
              <div
                key={title}
                className="flex gap-4 rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,32,0.03)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#111820] text-white">
                  <Icon size={18} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                    {title}
                  </p>
                  <p className="mt-2 text-lg font-medium text-[#111820]">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,32,0.04)] md:p-8">
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
                Send a message
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[#111820] md:text-4xl">
                Start a conversation
              </h2>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-[#EFEAE2]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
                FAQ
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[#111820] md:text-4xl">
                Helpful answers
              </h2>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#111820]"
            >
              Explore collection
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {faqs.map((item) => (
              <div key={item.question} className="rounded-[1.5rem] border border-black/5 bg-white p-6">
                <p className="text-base font-medium text-[#111820]">{item.question}</p>
                <p className="mt-3 text-sm leading-6 text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
