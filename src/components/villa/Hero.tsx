"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

export function Hero({ dict }: { dict: Dictionary }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[560px] overflow-hidden bg-onyx">
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src="/images/villa-elk/pool-rooftop-sunset.jpg"
          alt="Piscine privée sur le toit de Villa Elk, au coucher du soleil"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/20 to-onyx/40" />
      </motion.div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex h-full max-w-6xl flex-col justify-end px-6 pb-16 mx-auto"
      >
        <span className="eyebrow text-brass">{dict.hero.eyebrow}</span>
        <h1 className="heading-display mt-4 text-[clamp(3.5rem,13vw,9rem)] text-stone">
          {dict.hero.title}
        </h1>
        <p className="body-copy mt-6 max-w-xl text-base text-stone/85 sm:text-lg">
          {dict.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#concept" className="btn-primary">
            {dict.hero.cta}
          </a>
          <a href="#contact" className="btn-outline border-stone/30 text-stone hover:border-brass hover:text-brass">
            {dict.hero.bookCta}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
