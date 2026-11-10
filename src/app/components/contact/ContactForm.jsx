"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = String(formData.get("subject"));
    const body = [
      `Name: ${formData.get("name")}`,
      `Email: ${formData.get("email")}`,
      "",
      String(formData.get("message")),
    ].join("\n");
    const mailto = `mailto:hello@avrone.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm text-gray-700">
          Full name
          <input name="name" required autoComplete="name" placeholder="Your name" className="mt-2 w-full rounded-full border border-black/10 bg-[#F8F7F4] px-4 py-3 text-sm outline-none transition focus:border-[#111820]" />
        </label>
        <label className="block text-sm text-gray-700">
          Email address
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="mt-2 w-full rounded-full border border-black/10 bg-[#F8F7F4] px-4 py-3 text-sm outline-none transition focus:border-[#111820]" />
        </label>
      </div>
      <label className="block text-sm text-gray-700">
        Subject
        <input name="subject" required placeholder="How can we help?" className="mt-2 w-full rounded-full border border-black/10 bg-[#F8F7F4] px-4 py-3 text-sm outline-none transition focus:border-[#111820]" />
      </label>
      <label className="block text-sm text-gray-700">
        Message
        <textarea name="message" rows={6} required placeholder="Tell us a little more about your request..." className="mt-2 w-full rounded-[1.5rem] border border-black/10 bg-[#F8F7F4] px-4 py-3 text-sm outline-none transition focus:border-[#111820]" />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111820] px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#2a2a2a]">
          Send message <ArrowRight size={16} />
        </button>
        <p role="status" className="text-xs text-gray-500">
          {submitted ? "Your email app should open with your message ready to send." : "Response time: within 1 business day"}
        </p>
      </div>
    </form>
  );
}
