import * as THREE from "three";
import { makeBowie } from "./details.js";
import { makeRoom } from "./room.js";
import { makeDesk, makeFireplace, makeHearthBasket, makePresents, makeTree } from "./props.js";

export function mountCabin(container, { buttons, onOpen, onFallback }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x261d17);

  const camera = new THREE.OrthographicCamera(-8, 8, 4, -4, 0.1, 60);
  camera.position.set(3.05, 5.68, 15.3);
  camera.lookAt(0, 2.66, 0.08);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.13;
  const canvas = renderer.domElement;
  container.append(canvas);

  scene.add(new THREE.HemisphereLight(0xffe6c0, 0x675443, 2.05));
  const key = new THREE.DirectionalLight(0xffdbad, 2.2);
  key.position.set(-3, 7, 5);
  scene.add(key);
  const blue = new THREE.DirectionalLight(0xabcbd1, 0.75);
  blue.position.set(6, 4, -1);
  scene.add(blue);

  const animateSnow = makeRoom(scene);
  makeTree(scene);
  const animateBowie = makeBowie(scene);
  makeHearthBasket(scene);
  const { animateFire, doors: mantelDoors } = makeFireplace(scene);
  const doors = { family: makePresents(scene), ...mantelDoors, personal: makeDesk(scene) };
  const targets = [];
  for (const [id, door] of Object.entries(doors)) {
    door.rest = door.object.position.y;
    door.object.traverse(node => {
      if (node.isMesh) {
        node.userData.door = id;
        targets.push(node);
      }
    });
  }

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerDoor;
  let focusedDoor;
  let enabled = true;
  let contextLost = false;
  let frame = 0;
  let lastTick = 0;
  let elapsed = 0;

  function placeTags() {
    for (const [id, door] of Object.entries(doors)) {
      const screen = door.anchor.clone().project(camera);
      buttons[id].style.setProperty("--tag-x", `${THREE.MathUtils.clamp((screen.x + 1) * 50, 11, 89)}%`);
      buttons[id].style.setProperty("--tag-y", `${THREE.MathUtils.clamp((1 - screen.y) * 50, 14, 86)}%`);
    }
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = container;
    if (!width || !height) return;
    const aspect = width / height;
    const halfHeight = Math.max(3.62, 7.38 / aspect);
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    renderer.setSize(width, height, false);
    placeTags();
    if (!contextLost) draw(0);
  }

  function draw(delta) {
    elapsed += delta;
    const sceneTime = motion.matches ? 0 : elapsed;
    animateSnow(sceneTime);
    animateFire(sceneTime);
    animateBowie(sceneTime);
    const highlighted = pointerDoor ?? focusedDoor;
    for (const [id, door] of Object.entries(doors)) {
      const y = door.rest + (highlighted === id ? door.lift : 0);
      door.object.position.y = delta ? THREE.MathUtils.lerp(door.object.position.y, y, Math.min(1, delta * 14)) : y;
    }
    renderer.render(scene, camera);
  }

  function animate(now) {
    frame = requestAnimationFrame(animate);
    if (now - lastTick < 32) return;
    draw(lastTick ? Math.min(0.08, (now - lastTick) / 1000) : 0);
    lastTick = now;
  }

  function updateLoop() {
    cancelAnimationFrame(frame);
    lastTick = 0;
    if (contextLost || document.hidden || !enabled) return;
    draw(0);
    if (!motion.matches) frame = requestAnimationFrame(animate);
  }

  function highlight() {
    const active = pointerDoor ?? focusedDoor;
    for (const [id, button] of Object.entries(buttons)) button.toggleAttribute("data-hover", id === active);
    if (motion.matches && !contextLost) draw(0);
  }

  function pick(event) {
    const bounds = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    ray.setFromCamera(pointer, camera);
    return ray.intersectObjects(targets, false)[0]?.object.userData.door;
  }

  canvas.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    const id = pick(event);
    if (id === pointerDoor) return;
    canvas.style.cursor = id ? "pointer" : "";
    pointerDoor = id;
    highlight();
  });
  canvas.addEventListener("pointerleave", () => {
    pointerDoor = undefined;
    canvas.style.cursor = "";
    highlight();
  });
  canvas.addEventListener("click", event => {
    const id = pick(event);
    if (id) onOpen(id);
  });
  for (const [id, button] of Object.entries(buttons)) {
    button.addEventListener("pointerenter", event => {
      if (event.pointerType !== "touch") {
        pointerDoor = id;
        highlight();
      }
    });
    button.addEventListener("pointerleave", () => {
      pointerDoor = undefined;
      highlight();
    });
    button.addEventListener("focus", () => {
      focusedDoor = id;
      highlight();
    });
    button.addEventListener("blur", () => {
      focusedDoor = undefined;
      highlight();
    });
  }
  canvas.addEventListener("webglcontextlost", event => {
    event.preventDefault();
    contextLost = true;
    updateLoop();
    onFallback(true);
  });
  canvas.addEventListener("webglcontextrestored", () => {
    contextLost = false;
    resize();
    onFallback(false);
    updateLoop();
  });
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  motion.addEventListener("change", updateLoop);
  document.addEventListener("visibilitychange", updateLoop);

  resize();
  updateLoop();
  return {
    setActive(value) {
      enabled = value;
      updateLoop();
    },
  };
}
