"use client";

import { motion } from "framer-motion";
import { Calendar, MessageCircle, Phone, Video } from "lucide-react";
import { SparkleField } from "./effects/SparkleField";
import { ScrollReveal } from "./effects/ScrollReveal";

const consultationOptions = [
  {
    icon: Video,
    title: "Video Consultation",
    description: "Connect with our jewellery experts via live video call",
    cta: "Schedule Now",
  },
  {
    icon: Calendar,
    title: "Store Appointment",
    description: "Visit our showroom for a personalized experience",
    cta: "Book Visit",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Chat",
    description: "Get instant answers and recommendations",
    cta: "Chat Now",
  },
  {
    icon: Phone,
    title: "Call Back",
    description: "Request a call from our jewellery consultant",
    cta: "Request Call",
  },
];

export function Consultation() {
  return (
    <section id="consultation" className="relative overflow-hidden maroon-gradient py-24">
      <SparkleField count={15} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,98,0.15),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <ScrollReveal className="mb-14 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold-light">
            We&apos;re Here to Help
          </p>
          <h2 className="mt-2 font-serif text-4xl font-light text-white md:text-5xl">
            Connect With Us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/65">
            Our experts are always available to guide you at your convenience.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {consultationOptions.map((option, i) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-gold/20 bg-white/5 p-6 backdrop-blur-md transition-colors hover:border-gold/40 hover:bg-white/10"
            >
              <motion.div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full gold-gradient"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <option.icon className="h-5 w-5 text-maroon-dark" />
              </motion.div>
              <h3 className="font-serif text-xl font-medium text-white">
                {option.title}
              </h3>
              <p className="mt-2 text-sm text-white/55">{option.description}</p>
              <button
                type="button"
                className="mt-4 text-sm font-semibold uppercase tracking-wider text-gold-light transition-colors group-hover:text-white"
              >
                {option.cta} →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
