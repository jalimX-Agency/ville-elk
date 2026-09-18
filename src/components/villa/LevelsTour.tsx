"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { GATE_OUTLINE, GATE_SILHOUETTE } from "@/components/brand/logo-paths";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";

type Shot = { src: string; alt: string };

// Photos per level, in dictionary order (0, −1, +1).
const SHOTS: { main: Shot; detail: Shot }[] = [
  {
    main: { src: "dining-terrace.jpg", alt: "Salle à manger ouverte sur la terrasse" },
    detail: { src: "tv-lounge-onyx-2.jpg", alt: "Salon avec mur de pierre et cheminée" },
  },
  {
    main: { src: "hammam.jpg", alt: "Hammam en pierre et laiton" },
    detail: { src: "gym.jpg", alt: "Salle de sport ouverte sur le patio de bambous" },
  },
  {
    main: { src: "bedroom-2.jpg", alt: "Chambre avec accès au balcon" },
    detail: { src: "bathroom-gold.jpg", alt: "Salle de bain en marbre et laiton" },
  },
];

const ELEVATION: Record<string, number> = { "+1": 1, "0": 0, "−1": -1 };
const EASE = [0.22, 1, 0.36, 1] as const;

export function LevelsTour({ dict }: { dict: Dictionary }) {
  const reduce = useReducedMotion();
  return (
    <section id="niveaux" aria-labelledby="tour-title" className="relative">
      {reduce ? <StackedTour dict={dict} /> : <PinnedTour dict={dict} />}
    </section>
  );
}

function PinnedTour({ dict }: { dict: Dictionary }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1); // +1 going up the building, -1 going down
  const levels = dict.tour.levels;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(levels.length - 1, Math.max(0, Math.floor(p * levels.length)));
    if (next !== active) {
      setDir(Math.sign(ELEVATION[levels[next].code] - ELEVATION[levels[active].code]) || 1);
      setActive(next);
    }
  });

  const level = levels[active];
  const shots = SHOTS[active];
  // Going up, the new floor rises in from below; going down, it drops in from above.
  const wipeFrom = dir > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)";

  const images = (
    <>
      <div className="absolute inset-y-0 end-0 w-[82%] overflow-hidden bg-muted">
        <AnimatePresence initial={false}>
          <motion.div
            key={shots.main.src}
            initial={{ clipPath: wipeFrom }}
            animate={{ clipPath: "inset(0% 0 0% 0)" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0"
          >
            <Image src={`/images/villa-elk/${shots.main.src}`} alt={shots.main.alt} fill sizes="(max-width: 1024px) 80vw, 45vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-0 start-0 z-10 aspect-[4/5] w-[30%] overflow-hidden border-[5px] border-background bg-muted lg:bottom-[-4vh] lg:w-[34%] lg:border-[6px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={shots.detail.src}
            initial={{ clipPath: wipeFrom }}
            animate={{ clipPath: "inset(0% 0 0% 0)" }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            className="absolute inset-0"
          >
            <Image src={`/images/villa-elk/${shots.detail.src}`} alt={shots.detail.alt} fill sizes="(max-width: 1024px) 30vw, 20vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );

  const copy = (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={level.code}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <p className="eyebrow text-muted-foreground">
          {dict.tour.levelLabel} {level.code} — {level.name}
        </p>
        <h3 className="heading-display mt-2 text-3xl text-foreground sm:text-4xl lg:mt-3 lg:text-5xl">{level.title}</h3>
        <p className="body-copy mt-3 max-w-md text-sm sm:text-base lg:mt-4 lg:text-lg">{level.body}</p>
        <ul className="mt-4 flex max-w-md flex-wrap gap-x-4 gap-y-2 lg:mt-6 lg:gap-x-5">
          {level.spaces.map((s) => (
            <li key={s} className="eyebrow flex items-center gap-2 text-foreground/80">
              <span className="h-1 w-1 rotate-45 bg-accent" aria-hidden="true" />
              {s}
            </li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );

  const numeral = (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={level.code}
        initial={{ opacity: 0, y: dir > 0 ? 40 : -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: dir > 0 ? -40 : 40 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="heading-display absolute bottom-0 start-0 leading-[0.8] text-primary tabular-nums text-[clamp(3.5rem,16vw,12rem)] lg:text-[clamp(7rem,21vh,12rem)]"
        aria-hidden="true"
      >
        {level.code}
      </motion.span>
    </AnimatePresence>
  );

  return (
    <div
      ref={ref}
      style={{ ["--levels" as string]: levels.length }}
      className="h-[calc(var(--levels)*88svh)] lg:h-[calc(var(--levels)*100vh+40vh)]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Phone: stacked column. Desktop: copy left, images right. */}
        <div className="flex h-full flex-col px-6 pb-8 pt-20 lg:mx-auto lg:grid lg:max-w-[1400px] lg:grid-cols-12 lg:gap-x-8 lg:px-[5vw] lg:pb-[8vh] lg:pt-[14vh]">
          <div className="flex min-h-0 flex-1 flex-col lg:col-span-5 lg:flex-none">
            <p className="eyebrow text-primary">{dict.tour.eyebrow}</p>
            <h2 id="tour-title" className="heading-display mt-2 text-2xl text-foreground sm:text-3xl lg:mt-3 lg:text-4xl">
              {dict.tour.title}
            </h2>

            {/* Images sit between the heading and the copy on a phone */}
            <div className="relative mt-5 min-h-0 flex-1 lg:hidden">{images}</div>

            <div className="mt-6 flex items-end gap-5 lg:mt-auto lg:gap-8">
              <div className="relative h-[clamp(3.5rem,16vw,12rem)] w-[clamp(4.5rem,21vw,15rem)] shrink-0 lg:h-[clamp(7rem,21vh,12rem)] lg:w-[clamp(9rem,27vh,15rem)]">
                {numeral}
              </div>
              <LevelDiagram codes={levels.map((l) => l.code)} active={level.code} className="h-16 w-auto sm:h-20 lg:h-[22vh]" />
            </div>

            <div className="relative mt-5 lg:mt-10 lg:min-h-[15.5rem]">{copy}</div>
          </div>

          <div className="relative hidden lg:col-span-7 lg:col-start-6 lg:block">{images}</div>
        </div>
      </div>
    </div>
  );
}

function StackedTour({ dict }: { dict: Dictionary }) {
  const levels = dict.tour.levels;
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="eyebrow text-primary">{dict.tour.eyebrow}</p>
      <h2 id="tour-title" className="heading-display mt-3 text-4xl text-foreground sm:text-5xl">{dict.tour.title}</h2>
      <ol className="mt-14 flex flex-col gap-20">
        {levels.map((level, i) => (
          <li key={level.code}>
            <div className="flex items-end gap-6">
              <span className="heading-display text-7xl leading-[0.8] text-primary" aria-hidden="true">
                {level.code}
              </span>
              <LevelDiagram codes={levels.map((l) => l.code)} active={level.code} className="h-20 w-auto" />
            </div>
            <p className="eyebrow mt-6 text-muted-foreground">
              {dict.tour.levelLabel} {level.code} — {level.name}
            </p>
            <h3 className="heading-display mt-2 text-4xl text-foreground">{level.title}</h3>
            <p className="body-copy mt-3 text-base">{level.body}</p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {level.spaces.map((s) => (
                <li key={s} className="eyebrow flex items-center gap-2 text-foreground/80">
                  <span className="h-1 w-1 rotate-45 bg-accent" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-[1fr_0.55fr] items-end gap-3">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <Image src={`/images/villa-elk/${SHOTS[i].main.src}`} alt={SHOTS[i].main.alt} fill sizes="60vw" className="object-cover" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <Image src={`/images/villa-elk/${SHOTS[i].detail.src}`} alt={SHOTS[i].detail.alt} fill sizes="35vw" className="object-cover" />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Section drawing built from the logo gate: the two floors above ground fill the
 * gate, the lower level sits beneath the threshold line.
 */
function LevelDiagram({ codes, active, className }: { codes: string[]; active: string; className?: string }) {
  const clip = `gate-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const band = (code: string) =>
    code === active
      ? { fill: "var(--primary)", fillOpacity: 0.2 }
      : { fill: "var(--accent)", fillOpacity: 0 };
  const label = (code: string) => (code === active ? "var(--primary)" : "var(--muted-foreground)");

  return (
    <svg viewBox="0 0 220 262" className={className} aria-hidden="true" direction="ltr">
      <defs>
        <clipPath id={clip}>
          <path d={GATE_SILHOUETTE} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="0" width="200" height="104" style={{ ...band("+1"), transition: "fill-opacity .5s" }} />
        <rect x="0" y="104" width="200" height="86" style={{ ...band("0"), transition: "fill-opacity .5s" }} />
      </g>
      <rect x="28" y="198" width="144" height="56" style={{ ...band("−1"), transition: "fill-opacity .5s" }} />

      <g fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1.2" vectorEffect="non-scaling-stroke">
        <path d={GATE_OUTLINE} vectorEffect="non-scaling-stroke" />
        <path d="M 28 104 L 172 104" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        <path d="M 0 190 L 200 190" vectorEffect="non-scaling-stroke" />
        <rect x="28" y="198" width="144" height="56" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      </g>

      {codes.includes("+1") && (
        <text x="184" y="62" style={{ fill: label("+1") }} className="font-mono" fontSize="15">+1</text>
      )}
      {codes.includes("0") && (
        <text x="184" y="152" style={{ fill: label("0") }} className="font-mono" fontSize="15">0</text>
      )}
      {codes.includes("−1") && (
        <text x="184" y="232" style={{ fill: label("−1") }} className="font-mono" fontSize="15">−1</text>
      )}
    </svg>
  );
}
