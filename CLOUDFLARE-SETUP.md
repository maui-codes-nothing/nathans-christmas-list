# Cloudflare Pages setup

This repository supports Cloudflare Pages with a D1 database for anonymous gift reservations. The old GitHub Pages site remains a static backup.

## Publish

1. Open https://dash.cloudflare.com and navigate to Workers & Pages.
2. Create application > Pages > Connect to Git. Connect GitHub and select `maui-codes-nothing/nathans-christmas-list`.
3. Name the Pages project `nathans-list-christmas-2026` if available. Select production branch `main`.
4. Framework preset: None. Build command: blank (or `exit 0`). Build output directory: `.` (repository root). Root directory: default (repository root).
5. Deploy and verify the `*.pages.dev` website.

## Create the D1 database

1. In Cloudflare's dashboard, open Storage & databases > D1 SQL Database.
2. Create database `nathans-list-reservations`.
3. Open its Console and execute this SQL:

```sql
CREATE TABLE IF NOT EXISTS gift_reservations (
  id TEXT PRIMARY KEY NOT NULL,
  owner TEXT NOT NULL
);
```

4. Open Workers & Pages > your Pages project > Settings > Bindings.
5. Add a **D1 database** binding with the variable name **RESERVATIONS** and choose database `nathans-list-reservations`.
6. Save and redeploy production for the binding to take effect.

## Test

- Open `https://YOUR-PROJECT.pages.dev/api/reservations`. Before any gifts are reserved, a healthy response is `{"reserved":[],"mine":[]}`.
- Visit the site using two different browsers. Reserve a gift in one. Refresh the other and confirm it shows **Reserved**. Release the gift from the original browser.
- The same browser profile can undo its reservations. Clearing its local storage or switching devices loses the ability to release them.
- Existing gift IDs in `js/wishlist-data.js` must stay stable so reservations remain associated with the gifts.
- The website's client-side family passcodes are visible to people inspecting the public source, so don't put sensitive information there.

Files: `functions/api/reservations.js`, `scripts/reservation-api.mjs`, `scripts/reservation-schema.sql`, `js/reservations.js`, `js/panels.js`.
