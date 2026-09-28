import { getAdminUser } from "@/app/admin/guard";
import { db } from "@/lib/db/client";
import { estimate } from "@/lib/booking/replies";

const STATUS: Record<string, string> = {
  NEW: "Nouvelle",
  CONTACTED: "Répondue",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
};

const iso = (date: Date) => date.toISOString().slice(0, 10);

/** One cell; semicolons, quotes and line breaks would otherwise split it. */
function cell(value: string | number | null | undefined): string {
  const text = String(value ?? "");
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Every request as a spreadsheet. Semicolons and a byte-order mark, because
 * that is what French Excel opens correctly with a double-click.
 */
export async function GET() {
  if (!(await getAdminUser())) {
    return new Response("Non autorisé.", { status: 401 });
  }

  const rows = await db.enquiry.findMany({ orderBy: { arrival: "asc" } });
  const header = ["Reçue le", "Statut", "Origine", "Nom", "Email", "Téléphone", "Langue", "Arrivée", "Départ", "Nuits", "Invités", "Estimation séjour (DH)", "Taxe de séjour (DH)", "Message", "Notes"];
  const lines = rows.map((row) => {
    const { nights, stay, tax } = estimate({ arrival: iso(row.arrival), departure: iso(row.departure), guests: row.guests });
    return [
      iso(row.createdAt),
      STATUS[row.status] ?? row.status,
      row.source === "manual" ? "Ajoutée à la main" : "Site",
      row.name,
      row.email,
      row.phone,
      row.locale.toUpperCase(),
      iso(row.arrival),
      iso(row.departure),
      nights,
      row.guests,
      stay,
      tax,
      row.message,
      row.notes,
    ].map(cell).join(";");
  });

  const csv = "﻿" + [header.join(";"), ...lines].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="demandes-villa-elk-${iso(new Date())}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
