import { bookedRanges } from "@/lib/booking/availability-server";

/**
 * The booking calendar asks here which nights are taken. Read at request
 * time, so a stay the owner confirms shows at once without a rebuild; only
 * dates leave the server.
 */
export async function GET() {
  try {
    return Response.json(
      { booked: await bookedRanges() },
      { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } },
    );
  } catch (error) {
    console.error("Availability unavailable", error);
    // The form still works without it: the server checks every request.
    return Response.json({ booked: [] }, { status: 503 });
  }
}
