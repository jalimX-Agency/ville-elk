"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { GATE_OUTLINE, GATE_SILHOUETTE } from "@/components/brand/logo-paths";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

// Gate geometry in emblem units: silhouette spans x 28–172, y 12–190.
const GATE_H = 178;
const BASE_Y = 190;
// Zoom origin sits inside the wide lower body of the gate so the opening can cover the screen.
const ORIGIN = { x: 100, y: 135 };
const HALF_BODY = { x: 72, up: 55, down: 55 };
const OPEN_BY = 0.82; // fraction of the pinned scroll at which the gate has fully opened

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Size = { w: number; h: number; rtl: boolean };

function restLayout({ w, h, rtl }: Size) {
  const wide = w >= 900;
  let gateH = wide ? h * 0.72 : h * 0.46;
  gateH = Math.min(gateH, (w * (wide ? 0.42 : 0.74)) * (GATE_H / 144));
  const s0 = gateH / GATE_H;
  // Copy sits on the reading-start side; the gate takes the other side.
  const cx = wide ? w * (rtl ? 0.36 : 0.64) : w * 0.5;
  const baseY = wide ? h * 0.9 : h * 0.6;
  const px = cx;
  const py = baseY - (BASE_Y - ORIGIN.y) * s0;
  const kEnd =
    Math.max(Math.max(px, w - px) / HALF_BODY.x, Math.max(py, h - py) / Math.min(HALF_BODY.up, HALF_BODY.down)) *
    1.12;
  return { s0, px, py, kEnd };
}

function gateTransform(size: Size, progress: number) {
  const { s0, px, py, kEnd } = restLayout(size);
  const t = Math.min(1, Math.max(0, progress / OPEN_BY));
  const eased = t * t * (3 - 2 * t);
  // Interpolate in log space so the zoom reads as a steady walk forward, not a lurch at the end.
  const k = s0 * Math.pow(kEnd / s0, eased);
  return `translate(${px - ORIGIN.x * k} ${py - ORIGIN.y * k}) scale(${k})`;
}

export function Hero({ dict }: { dict: Dictionary }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const maskGateRef = useRef<SVGGElement>(null);
  const lineGateRef = useRef<SVGGElement>(null);
  const [size, setSize] = useState<Size>({ w: 1440, h: 900, rtl: false });
  const maskId = `seuil-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const apply = useCallback(
    (p: number) => {
      const tf = gateTransform(size, reduce ? 0 : p);
      maskGateRef.current?.setAttribute("transform", tf);
      lineGateRef.current?.setAttribute("transform", tf);
    },
    [size, reduce],
  );

  useIsoLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () =>
      setSize({ w: el.clientWidth, h: el.clientHeight, rtl: document.documentElement.dir === "rtl" });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useIsoLayoutEffect(() => apply(scrollYProgress.get()), [apply, scrollYProgress]);
  useMotionValueEvent(scrollYProgress, "change", apply);

  const imageScale = useTransform(scrollYProgress, [0, OPEN_BY], reduce ? [1, 1] : [1.18, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.32], reduce ? [1, 1] : [1, 0]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className={reduce ? "relative h-[100svh]" : "relative h-[240vh]"}
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ scale: imageScale }} className="absolute inset-0">
          <Image
            src="/images/villa-elk/pool-terrace-sunset.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* The wall: the page ground with a gate-shaped opening cut through it */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${size.w} ${size.h}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={size.w} height={size.h}>
              <rect width={size.w} height={size.h} fill="white" />
              <g ref={maskGateRef} transform={gateTransform(size, 0)}>
                <path d={GATE_SILHOUETTE} fill="black" />
              </g>
            </mask>
          </defs>
          <rect width={size.w} height={size.h} mask={`url(#${maskId})`} style={{ fill: "var(--background)" }} />
          <motion.g style={{ opacity: lineOpacity }}>
            <g ref={lineGateRef} transform={gateTransform(size, 0)}>
              <path
                d={GATE_OUTLINE}
                fill="none"
                vectorEffect="non-scaling-stroke"
                style={{ stroke: "var(--accent)", strokeWidth: 1.25 }}
              />
              <path
                d={`M -4000 ${BASE_Y} L 4200 ${BASE_Y}`}
                vectorEffect="non-scaling-stroke"
                style={{ stroke: "var(--accent)", strokeWidth: 1 }}
              />
            </g>
          </motion.g>
        </svg>

        <HeroCopy dict={dict} progress={scrollYProgress} reduce={!!reduce} />
      </div>
    </section>
  );
}

function HeroCopy({
  dict,
  progress,
  reduce,
}: {
  dict: Dictionary;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const opacity = useTransform(progress, [0, 0.26], reduce ? [1, 1] : [1, 0]);
  const y = useTransform(progress, [0, 0.26], reduce ? [0, 0] : [0, -48]);
  const cueOpacity = useTransform(progress, [0, 0.08], reduce ? [0, 0] : [1, 0]);

  return (
    <>
      <motion.div
        style={{ opacity, y }}
        className="absolute inset-x-0 bottom-0 px-6 pb-10 lg:inset-y-0 lg:end-auto lg:flex lg:w-[46%] lg:flex-col lg:justify-end lg:pb-[10vh] lg:ps-[5vw]"
      >
        <h1 id="hero-title" className="max-w-xl">
          <span className="eyebrow block text-primary">
            {dict.hero.title} — {dict.hero.eyebrow}
          </span>
          <span className="heading-display mt-5 block text-[clamp(2.9rem,6.6vw,6.75rem)] text-foreground">
            {dict.hero.threshold}
          </span>
        </h1>
        <p className="body-copy mt-6 max-w-md text-base sm:text-lg">{dict.hero.subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a href="#bientot" className="btn-primary">
            {dict.hero.bookCta}
          </a>
          <a href="#niveaux" className="btn-quiet">
            {dict.hero.cta}
          </a>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: cueOpacity }}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 right-6 hidden items-center gap-3 lg:flex"
      >
        <span className="eyebrow text-muted-foreground">{dict.hero.scroll}</span>
        <span className="block h-px w-14 bg-accent" />
      </motion.div>
    </>
  );
}
