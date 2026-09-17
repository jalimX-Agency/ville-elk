"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { GATE_OUTLINE, GATE_SILHOUETTE } from "@/components/brand/logo-paths";
import type { Dictionary } from "@/lib/i18n/dictionaries/types";
import { cn } from "@/lib/utils";

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
      {!reduce && (
        <div className="hidden lg:block">
          <PinnedTour dict={dict} />
        </div>
      )}
      <div className={cn(!reduce && "lg:hidden")}>
        <StackedTour dict={dict} />
      </div>
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

  return (
    <div ref={ref} style={{ height: `${levels.length * 100 + 40}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-12 gap-x-8 px-[5vw] pb-[8vh] pt-[14vh]">
          {/* Copy column */}
          <div className="col-span-5 flex flex-col">
            <p className="eyebrow text-primary">{dict.tour.eyebrow}</p>
            <h2 id="tour-title" className="heading-display mt-3 text-4xl text-foreground">
              {dict.tour.title}
            </h2>

            <div className="mt-auto flex items-end gap-8">
              {/* Sized for the widest code ("−1") so the numeral never runs into the diagram */}
              <div className="relative h-[clamp(7rem,21vh,12rem)] w-[clamp(9rem,27vh,15rem)] shrink-0">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={level.code}
                    initial={{ opacity: 0, y: dir > 0 ? 40 : -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: dir > 0 ? -40 : 40 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="heading-display absolute bottom-0 start-0 text-[clamp(7rem,21vh,12rem)] leading-[0.8] text-primary tabular-nums"
                    aria-hidden="true"
                  >
                    {level.code}
                  </motion.span>
                </AnimatePresence>
              </div>
              <LevelDiagram codes={levels.map((l) => l.code)} active={level.code} className="h-[22vh] w-auto" />
            </div>

            <div className="relative mt-10 min-h-[15.5rem]">
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
                  <h3 className="heading-display mt-3 text-5xl text-foreground">{level.title}</h3>
                  <p className="body-copy mt-4 max-w-md text-lg">{level.body}</p>
                  <ul className="mt-6 flex max-w-md flex-wrap gap-x-5 gap-y-2">
                    {level.spaces.map((s) => (
                      <li key={s} className="eyebrow flex items-center gap-2 text-foreground/80">
                        <span className="h-1 w-1 rotate-45 bg-accent" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Image column: tall frame with an offset detail shot */}
          <div className="relative col-span-7 col-start-6">
            <div className="absolute inset-y-0 end-0 w-[82%] overflow-hidden bg-muted">
              <AnimatePresence initial={false}>
                <motion.div
                  key={shots.main.src}
                  initial={{ clipPath: wipeFrom }}
                  animate={{ clipPath: "inset(0% 0 0% 0)" }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image src={`/images/villa-elk/${shots.main.src}`} alt={shots.main.alt} fill sizes="45vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute bottom-[-4vh] start-0 z-10 aspect-[4/5] w-[34%] overflow-hidden border-[6px] border-background bg-muted">
              <AnimatePresence initial={false}>
                <motion.div
                  key={shots.detail.src}
                  initial={{ clipPath: wipeFrom }}
                  animate={{ clipPath: "inset(0% 0 0% 0)" }}
                  transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image src={`/images/villa-elk/${shots.detail.src}`} alt={shots.detail.alt} fill sizes="20vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
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
      <h2 className="heading-display mt-3 text-4xl text-foreground sm:text-5xl">{dict.tour.title}</h2>
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
