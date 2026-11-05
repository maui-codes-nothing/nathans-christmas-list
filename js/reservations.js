const endpoint = new URL("../api/reservations", import.meta.url);
const keyName = "nathans-list-reservation-key";
let key;
try {
  key = localStorage.getItem(keyName);
} catch {
  // The list still works if browser storage is unavailable.
}

function browserKey() {
  if (key) return key;
  key = Array.from(crypto.getRandomValues(new Uint8Array(16)), value => value.toString(16).padStart(2, "0")).join("");
  try {
    localStorage.setItem(keyName, key);
  } catch {
    // The claim can still be released until this page is closed.
  }
  return key;
}

async function request(method = "GET", id) {
  const headers = { Accept: "application/json" };
  if (method !== "GET") {
    headers["Content-Type"] = "application/json";
    headers["X-Reservation-Key"] = browserKey();
  } else if (key) {
    headers["X-Reservation-Key"] = key;
  }
  return fetch(endpoint, {
    method, headers, cache: "no-store", body: id ? JSON.stringify({ id }) : undefined,
  });
}

export function attachReservations(grid, status) {
  const buttons = Array.from(grid.querySelectorAll("[data-reserve]"));
  let state = new Map();

  function draw(available) {
    for (const button of buttons) {
      const value = state.get(button.dataset.reserve);
      button.textContent = value === "mine" ? "Release my reservation" : value === "reserved" ? "Reserved" : "Reserve anonymously";
      button.disabled = !available || value === "reserved";
    }
  }

  async function refresh() {
    try {
      const response = await request();
      if (!response.ok) throw new Error();
      const { reserved, mine } = await response.json();
      state = new Map(reserved.map(id => [id, "reserved"]));
      for (const id of mine) state.set(id, "mine");
      draw(true);
      return true;
    } catch {
      draw(false);
      status.textContent = "Shared reservations are unavailable right now.";
      return false;
    }
  }

  grid.addEventListener("click", async event => {
    const button = event.target.closest("[data-reserve]");
    if (!button || button.disabled) return;
    const id = button.dataset.reserve;
    const release = state.get(id) === "mine";
    draw(false);
    status.textContent = "";
    try {
      const result = await request(release ? "DELETE" : "POST", id);
      if (result.status === 409) status.textContent = "Someone already reserved that gift.";
      else if (!result.ok) throw new Error();
      else status.textContent = release ? "Reservation released." : "Gift reserved anonymously.";
    } catch {
      status.textContent = "Couldn't update the reservation. Try again.";
    }
    await refresh();
  });

  refresh();
}
