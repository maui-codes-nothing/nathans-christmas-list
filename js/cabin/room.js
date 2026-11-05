import * as THREE from "three";
import { box, glow, group, mesh, randomGenerator } from "./geometry.js";

const wallColors = [0x684130, 0x704635, 0x744a38, 0x7e503a, 0x794937];
const floorColors = [0x68412f, 0x724a34, 0x7a4e35, 0x825539, 0x765039];

function makeWindow(parent, x, seed) {
  const frame = group(parent, x, 3.35, -2.67);
  box(frame, 0, 0, 0, 2.55, 2.82, 0.23, 0x382b24);
  box(frame, 0, 0, 0.13, 2.22, 2.48, 0.025, glow(0x244454));
  const moon = mesh(frame, new THREE.CircleGeometry(0.24, 24), glow(0xd4e2dc), 0.52, 0.75, 0.16);
  moon.scale.x = 0.94;
  const pine = new THREE.Shape();
  pine.moveTo(-0.36, 0);
  pine.lineTo(-0.2, 0.3);
  pine.lineTo(-0.27, 0.3);
  pine.lineTo(0, 0.88);
  pine.lineTo(0.27, 0.3);
  pine.lineTo(0.2, 0.3);
  pine.lineTo(0.36, 0);
  pine.closePath();
  const silhouette = new THREE.ShapeGeometry(pine);
  for (let i = 0; i < 4; i++) {
    const tree = mesh(frame, silhouette, glow(i % 2 ? 0x547075 : 0x3d5c63), -0.73 + i * 0.48, -1.18, 0.17);
    tree.scale.set(1.04, 0.78 + (i % 3) * 0.27, 1);
  }
  box(frame, 0, -1.09, 0.18, 2.21, 0.24, 0.025, glow(0x8aa5a6));
  for (const side of [-1, 1]) {
    box(frame, side * 1.17, 0, 0.25, 0.16, 2.68, 0.15, 0x92623c);
    box(frame, 0, side * 1.29, 0.25, 2.48, 0.17, 0.15, 0x92623c);
  }
  box(frame, 0, -1.4, 0.32, 2.74, 0.15, 0.41, 0xa77749);
  box(frame, 0, 0, 0.25, 0.11, 2.49, 0.14, 0x8e623e);
  box(frame, 0, 0, 0.25, 2.22, 0.1, 0.14, 0x8e623e);

  const random = randomGenerator(seed);
  const flakes = Array.from({ length: 28 }, () => ({
    x: (random() - 0.5) * 2.12, y: (random() - 0.5) * 2.39, speed: 0.16 + random() * 0.32,
  }));
  const positions = new Float32Array(flakes.length * 3);
  const points = new THREE.BufferGeometry();
  points.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  const snowfall = new THREE.Points(points, new THREE.PointsMaterial({ color: 0xd0e7df, size: 0.056, transparent: true, opacity: 0.79 }));
  snowfall.frustumCulled = false;
  frame.add(snowfall);

  return (time) => {
    flakes.forEach((flake, i) => {
      const drift = 0.09 * Math.sin(time * 0.7 + i);
      const fall = ((flake.y + 1.2 - time * flake.speed) % 2.4 + 2.4) % 2.4;
      positions.set([THREE.MathUtils.clamp(flake.x + drift, -1.085, 1.085), fall - 1.2, 0.21], i * 3);
    });
    points.attributes.position.needsUpdate = true;
  };
}

function makeCurtains(parent, x) {
  const curtain = group(parent, x, 3.35, -2.20);
  const pole = mesh(curtain, new THREE.CylinderGeometry(0.043, 0.043, 2.91, 8), 0x775337, 0, 1.45, 0);
  pole.rotation.z = Math.PI / 2;
  const pleats = [0x793d35, 0x93483a, 0x874139, 0x9b5341];
  for (const side of [-1, 1]) {
    mesh(curtain, new THREE.SphereGeometry(0.075, 8, 6), 0xb07e48, side * 1.47, 1.45, 0);
    for (let i = 0; i < pleats.length; i++) {
      const fold = box(curtain, side * (1.09 + i * 0.096), 0.29 + i * 0.035, 0.01 + (i % 2) * 0.028,
        0.13, 2.20 - i * 0.07, 0.08, pleats[i]);
      fold.rotation.z = side * 0.058;
    }
    box(curtain, side * 1.23, -0.23, 0.077, 0.36, 0.08, 0.055, 0xc29761).rotation.z = side * 0.15;
  }
}

function makeSign(parent) {
  const sign = group(parent, 0, 4.67, -2.57);
  box(sign, 0, 0, 0, 4.37, 1.25, 0.21, 0x3f2d23);
  box(sign, 0, 0, 0.12, 4.23, 1.11, 0.09, 0xad7b4d);
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 275;
  const paint = canvas.getContext("2d");
  paint.fillStyle = "#533a2b";
  paint.fillRect(0, 0, canvas.width, canvas.height);
  paint.strokeStyle = "#896846";
  paint.lineWidth = 3;
  paint.strokeRect(19, 17, 986, 241);
  paint.strokeStyle = "#79543a";
  for (const y of [68, 146, 208]) {
    paint.beginPath();
    paint.moveTo(20, y);
    paint.bezierCurveTo(340, y - 7, 680, y + 10, 1004, y);
    paint.stroke();
  }
  paint.textAlign = "center";
  paint.fillStyle = "#fcdf9e";
  paint.font = "bold 111px Georgia, serif";
  paint.fillText("NATHAN’S LIST", 512, 138, 925);
  paint.font = "bold 38px monospace";
  paint.fillStyle = "#e7be81";
  paint.fillText("✦  CHRISTMAS 2026  ✦", 512, 205);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  mesh(sign, new THREE.PlaneGeometry(4.06, 1.04), new THREE.MeshBasicMaterial({ map: texture }), 0, 0, 0.174);
}

function makeStringLights(parent) {
  const cable = [];
  const bulbs = new THREE.SphereGeometry(0.068, 8, 6);
  const colors = [glow(0xffcf79), glow(0xf08758), glow(0xf9e2a7), glow(0x9cc09c)];
  for (let i = 0; i <= 30; i++) {
    const x = -6.6 + 13.2 * i / 30;
    const y = 5.64 - Math.abs(Math.cos(x * 0.7)) * 0.27;
    cable.push(new THREE.Vector3(x, y, -2.43));
    box(parent, x, y - 0.065, -2.42, 0.057, 0.1, 0.065, 0x3b4531);
    const bulb = mesh(parent, bulbs, colors[i % colors.length], x, y - 0.135, -2.42);
    bulb.scale.y = 1.25;
  }
  const line = new THREE.BufferGeometry().setFromPoints(cable);
  parent.add(new THREE.Line(line, new THREE.LineBasicMaterial({ color: 0x312c22 })));
}

export function makeRoom(scene) {
  const shell = group(scene);
  for (let row = 0; row < 14; row++) {
    const y = 0.23 + row * 0.421;
    box(shell, 0, y, -2.94, 14.2, 0.41, 0.29, wallColors[(row * 3) % 5]);
    for (const side of [-1, 1]) {
      box(shell, side * 7.03, y, 0.13, 0.24, 0.41, 6.05, wallColors[(row + side + 6) % 5]);
    }
    for (const x of [-6.15, -2.45, 2.47, 6.1]) {
      box(shell, x + (row % 2) * 0.26, y + 0.07, -2.79, 0.77, 0.013, 0.012, 0x5e3c2e);
    }
  }
  for (let i = 0; i < 23; i++) {
    const x = (i - 11) * 0.61;
    const seam = -0.92 + (i % 4) * 0.84;
    const rear = -3.04;
    const front = 4.48;
    box(shell, x, -0.08, (rear + seam) / 2, 0.598, 0.17, seam - rear - 0.016, floorColors[i % 5]);
    box(shell, x, -0.08, (front + seam) / 2, 0.598, 0.17, front - seam - 0.016, floorColors[(i + 2) % 5]);
  }
  box(shell, 0, -0.19, 0.77, 14.21, 0.11, 7.61, 0x4b2c21);
  for (const x of [-6.88, 6.88]) {
    box(shell, x, 2.92, -2.67, 0.23, 5.83, 0.29, 0x4a3024);
  }
  box(shell, 0, 5.83, -2.64, 14.17, 0.22, 0.38, 0x523526);
  box(shell, 0, 0.19, -2.73, 14.1, 0.28, 0.23, 0x523526);
  // A flat woven rug, layered from the border inward.
  box(shell, 0, 0.022, 2.0, 5.1, 0.04, 2.73, 0x6e3833);
  box(shell, 0, 0.043, 2.0, 4.77, 0.013, 2.43, 0xa5754b);
  box(shell, 0, 0.054, 2.0, 4.59, 0.012, 2.25, 0x843e37);
  for (const x of [-1.5, 0, 1.5]) {
    const diamond = box(shell, x, 0.065, 2.0, 0.49, 0.01, 0.49, 0xb37c54);
    diamond.rotation.y = Math.PI / 4;
  }
  makeSign(shell);
  makeStringLights(shell);
  const leftSnow = makeWindow(shell, -4.6, 21);
  const rightSnow = makeWindow(shell, 4.6, 82);
  makeCurtains(shell, -4.6);
  makeCurtains(shell, 4.6);
  return (time) => {
    leftSnow(time);
    rightSnow(time);
  };
}
