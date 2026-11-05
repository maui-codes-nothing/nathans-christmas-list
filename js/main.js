import { createPanels } from "./panels.js";
import { playDoorSound, startBackgroundAudio } from "./cabin/click-sounds.js";

const cabinet = document.querySelector(".cabinet");
const status = document.querySelector("#scene-status");
const dialog = document.querySelector("#room-panel");
const buttons = Object.fromEntries([...cabinet.querySelectorAll("[data-door]")].map(button => [button.dataset.door, button]));
let cabin;

const openPanel = createPanels(dialog, () => cabin?.setActive(true));
startBackgroundAudio();

function openDoor(id) {
  if (dialog.open) return;
  playDoorSound(id);
  openPanel(id, buttons[id]);
  cabin?.setActive(false);
}

for (const [id, button] of Object.entries(buttons)) {
  button.addEventListener("click", () => openDoor(id));
}

function setSceneState(fallback) {
  cabinet.dataset.scene = fallback ? "fallback" : "ready";
  status.textContent = fallback ? "The 3D cabin is unavailable. The lists and letters are below." : "";
  status.hidden = !fallback;
}

import("./cabin/index.js").then(({ mountCabin }) => {
  cabin = mountCabin(document.querySelector("#scene"), {
    buttons,
    onOpen: openDoor,
    onFallback: setSceneState,
  });
  if (dialog.open) cabin.setActive(false);
  setSceneState(false);
}).catch(error => {
  console.warn("The 3D cabin could not start.", error);
  setSceneState(true);
});
