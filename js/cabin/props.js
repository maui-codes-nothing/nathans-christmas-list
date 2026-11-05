import * as THREE from "three";
import { makeMantelFrames } from "./details.js";
import { box, glow, group, mesh, randomGenerator, star } from "./geometry.js";

export function makeTree(parent) {
  const tree = group(parent, -4.4, 0, -0.72);
  const random = randomGenerator(43);
  box(tree, 0, 0.51, 0, 0.39, 1.02, 0.39, 0x744934);
  const needles = [0x254c3b, 0x2e5c46, 0x367152, 0x3a7351];
  const ornaments = [0xc15038, 0xdda84d, 0xdbd5a1, 0x9e3e35];
  const ornamentShape = new THREE.SphereGeometry(0.115, 9, 7);
  const lightShape = new THREE.SphereGeometry(0.04, 7, 5);
  const lightColors = [glow(0xffd27d), glow(0xf08760), glow(0xe5ebaf)];
  for (let level = 0; level < 4; level++) {
    const radius = 1.37 - 0.27 * level;
    const y = 0.62 + level * 0.72;
    const layer = mesh(tree, new THREE.CylinderGeometry(0.1, radius, 1.73, 10), needles[level], 0, y + 0.87, 0);
    layer.rotation.y = level * 0.32;
    for (let i = 0; i < 12; i++) {
      const angle = i * Math.PI / 6 + level * 0.6;
      const h = 0.18 + random() * 0.45;
      const r = THREE.MathUtils.lerp(radius, 0.1, h / 1.73);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      mesh(tree, i % 3 === 0 ? ornamentShape : lightShape, i % 3 === 0 ? ornaments[(i + level) % 4] : lightColors[(i + level) % 3], x, y + h, z);
    }
  }
  star(tree, 0, 4.56, 0, 0.31, 0xf9ce71);
}

function present(parent, x, z, w, h, d, color, ribbon, turn) {
  const gift = group(parent, x, 0, z);
  gift.rotation.y = turn;
  gift.scale.setScalar(0.87);
  box(gift, 0, h * 0.5, 0, w, h, d, color);
  box(gift, 0, h - 0.035, 0, w + 0.07, 0.13, d + 0.07, color);
  box(gift, 0, h * 0.52, 0, w * 0.17, h * 1.04, d + 0.08, ribbon);
  box(gift, 0, h * 0.52, 0, w + 0.08, h * 1.05, d * 0.17, ribbon);
  const loop = new THREE.TorusGeometry(0.11, 0.026, 6, 11);
  for (const side of [-1, 1]) {
    const bow = mesh(gift, loop, ribbon, side * 0.105, h + 0.12, 0);
    bow.scale.x = 1.35;
    bow.rotation.z = side * 0.48;
  }
}

export function makePresents(parent) {
  const gifts = group(parent, -4.1, 0.015, 1.03);
  present(gifts, -0.61, -0.22, 0.87, 0.66, 0.76, 0xaa4837, 0xf0c47d, -0.19);
  present(gifts, 0.47, -0.17, 0.72, 0.5, 0.71, 0xc8994d, 0x973e35, 0.18);
  present(gifts, 0.04, 0.52, 0.8, 0.38, 0.61, 0x416e59, 0xe1cc98, -0.12);
  return { object: gifts, anchor: new THREE.Vector3(-4.07, 0.06, 2.05), lift: 0.12 };
}

function makeStocking(parent, x, y, z, color, rotation) {
  const stocking = group(parent, x, y, z);
  stocking.rotation.z = rotation;
  const shape = new THREE.Shape();
  shape.moveTo(-0.21, 0.03);
  shape.lineTo(0.21, 0.03);
  shape.lineTo(0.21, -0.64);
  shape.bezierCurveTo(0.20, -0.89, -0.17, -0.97, -0.43, -0.87);
  shape.bezierCurveTo(-0.68, -0.74, -0.59, -0.54, -0.22, -0.59);
  shape.closePath();
  mesh(stocking, new THREE.ExtrudeGeometry(shape, { depth: 0.085, bevelSize: 0.045, bevelThickness: 0.04, bevelSegments: 1, steps: 1 }), color, 0, 0, 0);
  box(stocking, 0, -0.015, 0.05, 0.53, 0.235, 0.22, 0xe6d1a5);
  star(stocking, -0.01, -0.37, 0.13, 0.085, 0xf3c279);
  return stocking;
}

function makeFire(parent) {
  const fire = group(parent, 0, 0.31, 0.64);
  for (const angle of [-0.2, 0.38, 1.14]) {
    const log = mesh(fire, new THREE.CylinderGeometry(0.09, 0.11, 1.06, 8), 0x62382b, 0, 0.09, -0.06 + angle * 0.11);
    log.rotation.z = Math.PI / 2;
    log.rotation.y = angle;
  }
  box(fire, 0, 0.035, 0.04, 1.25, 0.06, 0.46, glow(0x973825));
  const flameGeometry = new THREE.IcosahedronGeometry(1, 1);
  const colors = [glow(0xd54a24), glow(0xf78c35), glow(0xffd36b), glow(0xffa443), glow(0xffc05a)];
  const flames = colors.map((color, index) => mesh(fire, flameGeometry, color, (index - 2) * 0.21, 0.42, 0.09));
  const light = new THREE.PointLight(0xffa254, 18, 8, 2);
  light.position.set(0, 0.63, 0.65);
  fire.add(light);
  return (time) => {
    flames.forEach((flame, index) => {
      const pulse = Math.sin(time * (4.2 + index * 0.43) + index * 1.6);
      const height = 0.36 + (2 - Math.abs(index - 2)) * 0.12 + pulse * 0.09;
      flame.position.y = 0.17 + height * 0.71;
      flame.scale.set(0.19 - index * 0.013, height, 0.11);
      flame.rotation.z = 0.17 * pulse;
    });
    light.intensity = 16.5 + Math.sin(time * 5.1) * 2.5 + Math.sin(time * 8.3) * 1.5;
  };
}

export function makeFireplace(parent) {
  const hearth = group(parent, 0, 0, -2.26);
  const stone = [0x816a59, 0x977966, 0x9e7d66, 0x735e50, 0x8d7461];
  box(hearth, 0, 1.3, -0.25, 3.35, 2.48, 0.29, 0x4c4037);
  box(hearth, 0, 0.89, 0.03, 1.86, 1.42, 0.18, 0x211e1c);
  box(hearth, 0, 0.16, 0.5, 3.65, 0.31, 1.59, 0x66574d);
  box(hearth, 0, 0.31, 0.49, 3.54, 0.11, 1.58, 0x947c65);
  for (let row = 0; row < 5; row++) {
    const y = 0.54 + row * 0.385;
    for (const side of [-1, 1]) {
      box(hearth, side * (1.37 - (row === 4 ? 0.05 : 0)), y, 0.32, 0.78 + (row % 2) * 0.085, 0.355, 0.94, stone[(row + side + 5) % 5]);
    }
  }
  for (let i = 0; i < 5; i++) {
    box(hearth, (i - 2) * 0.66, 2.25, 0.32, 0.638, 0.36, 0.95, stone[(i * 2) % 5]);
  }
  box(hearth, 0, 2.56, 0.42, 3.8, 0.26, 1.25, 0x493127);
  box(hearth, 0, 2.71, 0.43, 3.94, 0.11, 1.26, 0x8f603e);
  for (let i = 0; i < 8; i++) {
    const x = (i - 3.5) * 0.48;
    const sprig = box(hearth, x, 2.79, 0.94, 0.57, 0.14, 0.2, i % 2 ? 0x38604a : 0x2e513d);
    sprig.rotation.y = i % 2 ? 0.24 : -0.24;
    mesh(hearth, new THREE.SphereGeometry(0.047, 8, 6), 0xb04233, x, 2.86, 1.02);
  }
  const smallStocking = makeStocking(hearth, -0.51, 2.45, 1.13, 0xa17848, 0.09);
  smallStocking.scale.setScalar(0.7);
  const stuffers = makeStocking(hearth, -1.29, 2.47, 1.13, 0x4b745d, 0.12);
  const stocking = makeStocking(hearth, 1.31, 2.47, 1.13, 0xb54b38, -0.13);
  makeMantelFrames(hearth);
  return {
    animateFire: makeFire(hearth),
    doors: {
      parents: { object: stocking, anchor: new THREE.Vector3(1.42, 1.43, -1.05), lift: 0.085 },
      stuffers: { object: stuffers, anchor: new THREE.Vector3(-1.51, 1.43, -1.05), lift: 0.085 },
      privileges: makeMantelCards(hearth),
    },
  };
}

function makeMantelCards(hearth) {
  const stack = group(hearth, 0.36, 2.77, 0.53);
  stack.rotation.x = -0.19;
  const papers = [
    { x: -0.11, z: 0, turn: 0.15, color: 0xbca37c },
    { x: 0.13, z: 0.07, turn: -0.17, color: 0xd5b185 },
    { x: 0, z: 0.14, turn: 0.02, color: 0xf2d9a4 },
  ];
  for (const paper of papers) {
    box(stack, paper.x, 0.38, paper.z, 0.94, 0.66, 0.053, paper.color).rotation.z = paper.turn;
  }
  star(stack, 0.27, 0.51, 0.167, 0.084, 0xa5523e);
  for (const y of [0.43, 0.35, 0.27]) {
    box(stack, -0.12, y, 0.17, 0.33, 0.014, 0.012, 0x846849);
  }
  return { object: stack, anchor: new THREE.Vector3(0.36, 3.50, -1.67), lift: 0.09 };
}

function envelope(parent, x, y, z, turn, color) {
  const letter = group(parent, x, y, z);
  letter.rotation.y = turn;
  box(letter, 0, 0, 0, 0.82, 0.055, 0.55, color);
  const flap = new THREE.Shape();
  flap.moveTo(-0.4, -0.25);
  flap.lineTo(0.4, -0.25);
  flap.lineTo(0, 0.10);
  flap.closePath();
  mesh(letter, new THREE.ShapeGeometry(flap), 0xcfb287, 0, 0.029, 0).rotation.x = -Math.PI / 2;
  const seal = mesh(letter, new THREE.CylinderGeometry(0.075, 0.081, 0.027, 9), 0xa5382f, 0, 0.048, -0.095);
  seal.rotation.y = 0.3;
}

export function makeHearthBasket(parent) {
  const basket = group(parent, -2.48, 0, -0.59);
  basket.rotation.y = 0.16;
  box(basket, 0, 0.23, 0, 0.89, 0.45, 0.65, 0x664633);
  for (const y of [0.11, 0.24, 0.38]) {
    box(basket, 0, y, 0, 0.92, 0.062, 0.68, 0x9a7247);
  }
  const log = new THREE.CylinderGeometry(0.113, 0.15, 0.61, 6);
  const end = new THREE.CircleGeometry(0.105, 6);
  for (let i = 0; i < 4; i++) {
    const wood = group(basket, -0.26 + i * 0.18, 0.48 + (i % 2) * 0.15, -0.035);
    wood.rotation.x = -0.96 + i * 0.12;
    mesh(wood, log, i % 2 ? 0x835438 : 0x6d4833, 0, 0, 0);
    mesh(wood, end, 0xc6925a, 0, 0.307, 0).rotation.x = -Math.PI / 2;
  }
}

function makeChair(parent) {
  const chair = group(parent, 1.63, 0, 1.07);
  chair.rotation.y = -0.29;
  const frame = 0x6c4835;
  for (const x of [-0.39, 0.39]) {
    box(chair, x, 0.35, 0.34, 0.12, 0.70, 0.12, frame);
    box(chair, x, 0.86, -0.33, 0.12, 1.72, 0.12, frame);
  }
  box(chair, 0, 0.65, 0, 0.91, 0.14, 0.87, frame);
  box(chair, 0, 0.76, 0.01, 0.79, 0.12, 0.73, 0x52634a);
  box(chair, 0, 1.62, -0.34, 0.92, 0.18, 0.14, frame);
  box(chair, 0, 1.23, -0.34, 0.80, 0.19, 0.12, frame);
  box(chair, 0.14, 1.38, -0.24, 0.41, 0.57, 0.11, 0xb26e45);
  box(chair, 0.14, 1.67, -0.34, 0.41, 0.078, 0.30, 0xb26e45);
  for (const x of [0, 0.14, 0.28]) {
    box(chair, x, 1.37, -0.18, 0.035, 0.53, 0.012, 0xd0a470);
  }
}

export function makeDesk(parent) {
  const desk = group(parent, 4.37, 0, 0.17);
  for (const x of [-1.12, 1.12]) {
    for (const z of [-0.55, 0.55]) {
      box(desk, x, 0.74, z, 0.21, 1.48, 0.21, 0x5d3d2d);
    }
  }
  box(desk, 0, 1.35, 0.04, 2.45, 0.28, 1.29, 0x714934);
  box(desk, 0, 1.56, 0.02, 2.72, 0.19, 1.55, 0xa47045);
  box(desk, 0, 1.36, 0.71, 1.43, 0.18, 0.075, 0x90613e);
  box(desk, 0, 1.36, 0.776, 0.21, 0.049, 0.075, 0xbca46a);
  const lamp = group(desk, -0.91, 1.65, -0.27);
  mesh(lamp, new THREE.CylinderGeometry(0.18, 0.22, 0.075, 12), 0x514936, 0, 0.038, 0);
  box(lamp, 0, 0.26, 0, 0.075, 0.47, 0.075, 0x857552);
  mesh(lamp, new THREE.CylinderGeometry(0.14, 0.36, 0.34, 10), glow(0xe0ac58), 0, 0.6, 0);
  const light = new THREE.PointLight(0xffc17a, 3.1, 4);
  light.position.set(0, 0.43, 0.09);
  lamp.add(light);
  makeChair(desk);
  for (const [height, shade] of [[1.69, 0x6c4436], [1.78, 0x526650]]) {
    box(desk, 0.87, height, -0.35, 0.54, 0.09, 0.36, shade).rotation.y = 0.11;
    box(desk, 0.89, height, -0.168, 0.47, 0.052, 0.018, 0xd9c398).rotation.y = 0.11;
  }
  const letters = group(desk, 0.15, 1.694, 0.29);
  envelope(letters, -0.38, 0.001, 0.016, -0.2, 0xe1c998);
  envelope(letters, 0.36, 0.009, 0.025, 0.19, 0xf6d8a5);
  envelope(letters, -0.06, 0.069, -0.07, -0.06, 0xf4e3b9);
  return { object: letters, anchor: new THREE.Vector3(4.52, 1.28, 1.21), lift: 0.1 };
}
