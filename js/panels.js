import { familyGifts, familyMemory, parentsGifts, parentsPasscode, personalPages, stockingStuffers } from "./wishlist-data.js";
import { createPrivilegeCards } from "./privilege-cards.js";
import { attachReservations } from "./reservations.js";

const giftLists = {
  family: { label: "01 / Under the tree", heading: "Family List", gifts: familyGifts },
  parents: { label: "02 / From the red stocking", heading: "Parents’ List", gifts: parentsGifts },
  stuffers: { label: "04 / From the green stocking", heading: "Stocking Stuffers", gifts: stockingStuffers },
};

const lockedPanels = {
  parents: {
    label: giftLists.parents.label,
    heading: "For my parents",
    prompt: "Enter the parents’ passcode to open this list.",
    error: "That code doesn’t open the stocking. Try again.",
  },
  personal: {
    label: "03 / From the writing desk",
    heading: "A letter for you",
    prompt: "Enter the passcode Nathan gave you to open your letter.",
    error: "No letter matches that code. Try again.",
  },
  privileges: {
    label: "05 / From the mantel",
    heading: "Privileges",
    prompt: "Enter the parents’ passcode to open the permission cards.",
    error: "That code doesn’t open the permission cards. Try again.",
  },
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function title(label, heading) {
  const eyebrow = element("p", "eyebrow", label);
  const name = element("h2", "", heading);
  name.id = "panel-title";
  name.tabIndex = -1;
  return [eyebrow, name];
}

function webLink(url, text) {
  if (!/^https?:\/\//i.test(url ?? "")) return null;
  const link = element("a", "", text);
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function image(src, alt) {
  const picture = element("img");
  picture.src = src;
  picture.alt = alt;
  picture.loading = "lazy";
  picture.decoding = "async";
  return picture;
}

function giftCard(gift) {
  const card = element("article", "gift");
  const copy = element("div", "gift-copy");
  const meta = element("div", "gift-meta");
  if (gift.placeholder) meta.append(element("span", "badge", "Placeholder"));
  if (gift.category) meta.append(element("span", "", gift.category));
  if (meta.childElementCount) copy.append(meta);
  const heading = element("h3", "", gift.name);
  if (gift.starred) {
    const star = element("span", "gift-star", "★");
    star.setAttribute("aria-hidden", "true");
    heading.append(" ", star, element("span", "sr-only", " (starred gift)"));
  }
  copy.append(heading);
  if (gift.price) copy.append(element("p", "price", gift.price));
  if (gift.description) copy.append(element("p", "", gift.description));
  if (gift.preference) copy.append(element("p", "preference", gift.preference));
  const link = webLink(gift.url, gift.placeholder ? "Example link ↗" : "View gift ↗");
  if (link) {
    link.setAttribute("aria-label", `${link.textContent} for ${gift.name} (opens in a new tab)`);
    copy.append(link);
  }
  // GitHub Pages remains a static fallback; Cloudflare has shared reservations.
  if (gift.id && !location.hostname.endsWith(".github.io")) {
    const reserve = element("button", "reserve-button", "Reserve anonymously");
    reserve.type = "button";
    reserve.dataset.reserve = gift.id;
    reserve.disabled = true;
    copy.append(reserve);
  }
  if (gift.image) card.append(image(gift.image, gift.imageAlt ?? (gift.placeholder ? "Product photo placeholder" : gift.name)));
  card.append(copy);
  return card;
}

export function createPanels(dialog, onClose) {
  const content = dialog.querySelector("#panel-content");
  const cards = createPrivilegeCards();
  let returnFocus;
  dialog.querySelector("#home").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    content.replaceChildren();
    cards.clearPrint();
    onClose();
    returnFocus?.focus({ preventScroll: true });
  });

  function show(nodes, input) {
    content.replaceChildren(...nodes);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    (input ?? content.querySelector("h2")).focus({ preventScroll: true });
  }

  function list(door) {
    const { label, heading, gifts } = giftLists[door];
    const grid = element("div", "gifts");
    grid.append(...gifts.map(giftCard));
    const nodes = title(label, heading);
    if (gifts.some(gift => gift.placeholder)) {
      nodes.push(element("p", "panel-intro", "A few gift ideas are still open-ended."));
    }
    if (door === "family") {
      const memory = element("aside", "memory-note");
      memory.append(element("h3", "", familyMemory.heading), element("p", "", familyMemory.message));
      nodes.push(memory);
    }
    if (location.hostname.endsWith(".github.io")) {
      show([...nodes, grid]);
    } else {
      const status = element("p", "reservation-status");
      status.setAttribute("role", "status");
      show([...nodes, status, grid]);
      attachReservations(grid, status);
    }
  }

  function permissionCards() {
    show([
      ...title(lockedPanels.privileges.label, "Privileges"),
      element("p", "panel-intro", "Pick a card, print it, and sign it for my stocking."),
      cards.render(),
    ]);
  }

  function letter(page) {
    const paper = element("article", "letter");
    paper.append(...title("03 / From the writing desk", page.heading));
    if (page.placeholder) paper.append(element("span", "badge", "Example letter"));
    const body = element("div", "letter-body");
    const copy = element("div");
    copy.append(element("p", "", page.message), element("h3", "", "Something we could do"), element("p", "", page.experience));
    const gift = page.giftLink;
    const link = gift && webLink(gift.url, gift.placeholder ? `Example link: ${gift.label} ↗` : `${gift.label} ↗`);
    if (link) copy.append(link);
    if (page.specialRequest) {
      copy.append(element("h3", "", "One more thing"), element("p", "", page.specialRequest));
    }
    copy.append(element("p", "signoff", "Love,\nNathan"));
    body.append(copy);
    if (page.photo) {
      const photo = element("figure");
      photo.append(image(page.photo, page.photoAlt ?? "Shared memory"));
      if (page.photoCaption) photo.append(element("figcaption", "", page.photoCaption));
      body.append(photo);
    }
    paper.append(body);
    show([paper]);
  }

  function unlock(door) {
    const panel = lockedPanels[door];
    const form = element("form", "code-form");
    const label = element("label", "", "Passcode");
    const row = element("div", "code-row");
    const input = element("input");
    const submit = element("button", "", "Open");
    const error = element("p", "form-error");
    input.id = "passcode";
    input.type = "password";
    input.autocomplete = "off";
    input.setAttribute("autocapitalize", "none");
    input.setAttribute("aria-describedby", "code-error");
    input.spellcheck = false;
    input.required = true;
    label.htmlFor = input.id;
    submit.type = "submit";
    error.id = "code-error";
    error.setAttribute("role", "alert");
    row.append(input, submit);
    form.append(label, row, error);
    input.addEventListener("input", () => {
      error.textContent = "";
      input.removeAttribute("aria-invalid");
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const code = input.value.trim();
      if (door === "personal") {
        const page = personalPages.find(entry => entry.passcodes.includes(code));
        if (page) {
          letter(page);
          return;
        }
      } else if (code === parentsPasscode) {
        if (door === "privileges") permissionCards();
        else list("parents");
        return;
      }
      error.textContent = panel.error;
      input.setAttribute("aria-invalid", "true");
      input.focus();
      input.select();
    });
    show([
      ...title(panel.label, panel.heading),
      element("p", "panel-intro", panel.prompt),
      form,
    ], input);
  }

  return (door, button) => {
    if (dialog.open) return;
    returnFocus = button;
    if (door === "family" || door === "stuffers") list(door);
    else unlock(door);
  };
}
