"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { closureOverlap, confirmedOverlap } from "@/lib/booking/availability-server";
import { isClosureReason } from "@/lib/booking/closures";
import { requireUser } from "./guard";

export type ClosureState = { error?: string; field?: string; created?: number };

function day(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))) : null;
}

const label = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" });

function refresh() {
  revalidatePath("/admin/disponibilites");
  revalidatePath("/admin/demandes");
}

/**
 * Closes the villa from one day to another, both included. Stored the way
 * stays are — up to the morning it reopens — so every availability check
 * treats the two alike.
 */
export async function createClosure(_state: ClosureState, formData: FormData): Promise<ClosureState> {
  await requireUser();
  const text = (field: string) => String(formData.get(field) ?? "").trim();

  const start = day(text("start"));
  if (!start) return { error: "Choisissez le premier jour fermé.", field: "start" };
  const last = day(text("end"));
  if (!last) return { error: "Choisissez le dernier jour fermé.", field: "end" };
  if (last < start) return { error: "Le dernier jour doit suivre le premier.", field: "end" };
  const end = new Date(last.getTime() + 86_400_000);

  // A confirmed guest is never silently shut out.
  const stay = await confirmedOverlap(start, end);
  if (stay) {
    return {
      error: `Un séjour confirmé tombe dans ces dates : ${stay.name}, du ${label(stay.arrival)} au ${label(stay.departure)}. Annulez-le d'abord dans « Demandes » si la villa doit fermer.`,
      field: "start",
    };
  }
  const closure = await closureOverlap(start, end);
  if (closure) {
    return {
      error: `Ces dates croisent une fermeture déjà prévue (du ${label(closure.startDate)} au ${label(new Date(closure.endDate.getTime() - 86_400_000))}). Supprimez-la ou choisissez d'autres dates.`,
      field: "start",
    };
  }

  const reason = text("reason");
  await db.closure.create({
    data: {
      startDate: start,
      endDate: end,
      reason: isClosureReason(reason) ? reason : "autre",
      note: text("note").slice(0, 500),
    },
  });
  refresh();
  return { created: Date.now() };
}

/** Reopens the dates. */
export async function deleteClosure(id: string) {
  await requireUser();
  await db.closure.deleteMany({ where: { id } });
  refresh();
}
