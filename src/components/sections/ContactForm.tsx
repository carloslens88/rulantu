"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/data/content";

type Status = "idle" | "sending" | "sent" | "error";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const fieldClasses =
  "w-full bg-transparent border-0 border-b border-paper/25 focus:border-signal py-3 text-lg placeholder:text-stone text-paper outline-none transition-colors duration-300";

type ContactFormProps = {
  dict: Dictionary;
};

/**
 * Zero-backend contact form. When NEXT_PUBLIC_FORMSPREE_ID is configured at
 * build time, submissions post directly to Formspree's free tier (no server
 * of ours involved). Without it, submission falls back to a pre-filled
 * mailto: so the form is always functional with zero infrastructure.
 */
export default function ContactForm({ dict }: ContactFormProps) {
  const { contactForm, brand } = dict;
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!FORMSPREE_ID) {
      e.preventDefault();
      const name = data.get("name");
      const email = data.get("email");
      const message = data.get("message");
      const body = `From: ${name} (${email})\n\n${message}`;
      window.location.href = `mailto:${brand.contactEmail}?subject=${encodeURIComponent(
        contactForm.subjectLine
      )}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      return;
    }

    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="font-display text-2xl md:text-3xl font-medium text-paper">
        {contactForm.sentMessage}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-8">
      <div>
        <label htmlFor="name" className="eyebrow block mb-2">
          {contactForm.nameLabel}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={contactForm.namePlaceholder}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="email" className="eyebrow block mb-2">
          {contactForm.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={contactForm.emailPlaceholder}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="message" className="eyebrow block mb-2">
          {contactForm.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={3}
          placeholder={contactForm.messagePlaceholder}
          className={`${fieldClasses} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        data-cursor="drag"
        className="inline-flex items-center gap-3 bg-signal text-ink font-semibold rounded-full pl-6 pr-2 py-2 text-base disabled:opacity-60"
      >
        <span>{status === "sending" ? contactForm.sending : contactForm.send}</span>
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-ink text-signal">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 13L13 3M13 3H5M13 3V11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {status === "error" && (
        <p className="text-signal text-sm" role="alert">
          {contactForm.errorPrefix}{" "}
          <a href={`mailto:${brand.contactEmail}`} className="underline">
            {brand.contactEmail}
          </a>
          .
        </p>
      )}
    </form>
  );
}
