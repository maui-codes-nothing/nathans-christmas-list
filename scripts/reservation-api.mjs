import { familyGifts, parentsGifts, stockingStuffers } from "../js/wishlist-data.js";

const giftIds = new Set([...familyGifts, ...parentsGifts, ...stockingStuffers].map(gift => gift.id).filter(Boolean));
const tokenPattern = /^[a-f0-9]{32}$/;

function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

async function ownerHash(token) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, "0")).join("");
}

export async function reservationApi(request, store) {
  try {
    const token = request.headers.get("X-Reservation-Key") ?? "";
    const owner = tokenPattern.test(token) ? await ownerHash(token) : null;
    if (request.method === "GET") {
      const rows = await store.list();
      const active = rows.filter(row => giftIds.has(row.id));
      return json({
        reserved: active.map(row => row.id),
        mine: active.filter(row => row.owner === owner).map(row => row.id),
      });
    }
    if (request.method !== "POST" && request.method !== "DELETE") return json({ error: "Method not supported." }, 405);
    if (!owner || !request.headers.get("Content-Type")?.startsWith("application/json")) {
      return json({ error: "Invalid reservation request." }, 400);
    }
    const body = await request.json().catch(() => null);
    const id = body?.id;
    if (!giftIds.has(id)) return json({ error: "Gift not found." }, 404);
    if (request.method === "DELETE") {
      await store.release(id, owner);
    } else if (!await store.reserve(id, owner)) {
      return json({ error: "Someone already reserved this." }, 409);
    }
    return json({ ok: true });
  } catch (error) {
    console.error("Reservation service:", error.message);
    return json({ error: "Reservations are temporarily unavailable." }, 503);
  }
}
