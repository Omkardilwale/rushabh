"use client";

import { motion } from "framer-motion";
import { Calendar, MessageCircle, Phone, Video } from "lucide-react";
import { useSiteContent } from "@/context/ContentContext";
import {
  buildMailtoUrl,
  buildTelUrl,
  buildWhatsAppUrl,
} from "@/lib/contact-links";
import { getSiteConfig } from "@/lib/site-config";
import type { ConsultationOption } from "@/lib/content/types";
import { SparkleField } from "./effects/SparkleField";
import { ScrollReveal } from "./effects/ScrollReveal";

const iconMap = {
  video: Video,
  appointment: Calendar,
  whatsapp: MessageCircle,
  callback: Phone,
} as const;

function getConsultationHref(option: ConsultationOption) {
  const siteName = getSiteConfig().name;
  switch (option.type) {
    case "whatsapp":
      return buildWhatsAppUrl(
        `Hello ${siteName}, I'd like jewellery recommendations and pricing.`,
      );
    case "callback":
      return (
        buildTelUrl() ??
        buildMailtoUrl(
          "Call back request",
          `Hello ${siteName},\n\nPlease call me back regarding jewellery.\n\nThank you!`,
        )
      );
    case "appointment":
      return buildMailtoUrl(
        "Store appointment request",
        `Hello ${siteName},\n\nI'd like to book a store visit.\n\nThank you!`,
      );
    default:
      return buildMailtoUrl(
        "Video consultation request",
        `Hello ${siteName},\n\nI'd like to schedule a video consultation.\n\nThank you!`,
      );
  }
}

export function Consultation() {
  const { content } = useSiteContent();
  const { sections, consultation } = content;
  const copy = sections.consultation;

  return (
    <section id="consultation" className="relative overflow-hidden maroon-gradient py-24">
      <SparkleField count={15} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,98,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal className="mb-14 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold-light">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-4xl font-light text-white md:text-5xl">
            {copy.heading}
          </h2>
          {copy.subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-white/65">{copy.subtitle}</p>
          )}
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {consultation.options.map((option, i) => {
            const Icon = iconMap[option.type];
            const href = getConsultationHref(option);
            const external = option.type === "whatsapp";
            return (
              <motion.a
                key={option.title}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group block rounded-2xl border border-gold/20 bg-white/5 p-6 backdrop-blur-md transition-colors hover:border-gold/40 hover:bg-white/10"
              >
                <motion.div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-full gold-gradient"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="h-5 w-5 text-maroon-dark" />
                </motion.div>
                <h3 className="font-serif text-xl font-medium text-white">
                  {option.title}
                </h3>
                <p className="mt-2 text-sm text-white/55">{option.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-gold-light transition-colors group-hover:text-white">
                  {option.cta} →
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
