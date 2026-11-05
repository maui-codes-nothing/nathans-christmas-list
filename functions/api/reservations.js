import { reservationApi } from "../../scripts/reservation-api.mjs";

export function onRequest({ request, env }) {
  if (!env.RESERVATIONS) {
    return Response.json({ error: "Reservations have not been set up." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const db = env.RESERVATIONS;
  return reservationApi(request, {
    async list() {
      return (await db.prepare("SELECT id, owner FROM gift_reservations").all()).results;
    },
    async reserve(id, owner) {
      const result = await db.prepare("INSERT OR IGNORE INTO gift_reservations (id, owner) VALUES (?, ?)").bind(id, owner).run();
      return result.meta.changes > 0;
    },
    release(id, owner) {
      return db.prepare("DELETE FROM gift_reservations WHERE id = ? AND owner = ?").bind(id, owner).run();
    },
  });
}
