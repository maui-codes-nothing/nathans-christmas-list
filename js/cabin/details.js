import * as THREE from "three";
import { box, group, mesh } from "./geometry.js";

const rounded = new THREE.IcosahedronGeometry(1, 1);

function oval(parent, color, x, y, z, sx, sy, sz) {
  const shape = mesh(parent, rounded, color, x, y, z);
  shape.scale.set(sx, sy, sz);
  return shape;
}

function curve(parent, points, radius, color) {
  const path = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
  return mesh(parent, new THREE.TubeGeometry(path, 16, radius, 6), color, 0, 0, 0);
}

export function makeBowie(parent) {
  const dog = group(parent, 0, 0.076, 2.11);
  dog.name = "Bowie";
  dog.rotation.y = -0.19;

  const shadow = mesh(dog, new THREE.CircleGeometry(1, 24),
    new THREE.MeshBasicMaterial({ color: 0x42291f, opacity: 0.29, transparent: true, depthWrite: false }),
    -0.05, 0.004, 0.02);
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.set(1.2, 0.51, 1);

  const chocolate = 0x865139;
  const auburn = 0x9c6349;
  const chestnut = 0x72432f;
  const cocoa = 0x583329;
  const body = group(dog, -0.29, 0.11, 0);
  oval(body, chocolate, 0, 0.21, 0, 0.68, 0.35, 0.39);
  oval(body, auburn, -0.27, 0.21, 0.11, 0.43, 0.32, 0.30);
  oval(body, chocolate, 0.30, 0.20, 0.02, 0.40, 0.31, 0.32);
  oval(dog, chestnut, -0.48, 0.16, 0.30, 0.42, 0.16, 0.18);
  curve(dog, [[-0.84, 0.23, -0.08], [-1.03, 0.16, 0.02], [-1.03, 0.12, 0.22], [-0.79, 0.12, 0.36]],
    0.087, chestnut);
  oval(dog, auburn, -0.76, 0.11, 0.36, 0.15, 0.091, 0.101);
  for (const z of [-0.15, 0.25]) {
    oval(dog, chocolate, 0.58, 0.12, z, 0.43, 0.12, 0.12);
    oval(dog, auburn, 0.91, 0.11, z, 0.19, 0.103, 0.133);
  }

  oval(dog, chocolate, 0.33, 0.32, 0.04, 0.36, 0.238, 0.23);
  const collar = mesh(dog, new THREE.TorusGeometry(0.227, 0.035, 8, 20), 0x467d3f, 0.47, 0.326, 0.045);
  collar.rotation.y = Math.PI / 2 - 0.13;
  collar.scale.set(1.12, 0.91, 1);
  mesh(dog, new THREE.CircleGeometry(0.061, 10), 0xd9b164, 0.51, 0.23, 0.297);

  oval(dog, auburn, 0.68, 0.37, 0.075, 0.31, 0.25, 0.247);
  const muzzle = oval(dog, 0xa96f50, 0.89, 0.27, 0.12, 0.264, 0.133, 0.174);
  muzzle.rotation.z = -0.14;
  oval(dog, 0x362822, 1.08, 0.284, 0.133, 0.083, 0.052, 0.092);
  for (const z of [-0.13, 0.268]) {
    const ear = oval(dog, chestnut, 0.56, 0.29, z, 0.149, 0.209, 0.097);
    ear.rotation.z = -0.36;
  }
  for (const [x, y, z, size] of [
    [0.55, 0.55, 0.05, 0.17], [0.71, 0.56, 0.10, 0.14], [0.64, 0.52, 0.224, 0.124],
    [0.58, 0.42, 0.27, 0.096], [0.54, 0.22, 0.31, 0.086],
  ]) {
    oval(dog, x > 0.60 ? auburn : chocolate, x, y, z, size, size * 0.78, size * 0.87);
  }
  curve(dog, [[0.725, 0.399, 0.296], [0.769, 0.382, 0.301], [0.812, 0.391, 0.281]], 0.012, cocoa);

  return (time) => {
    body.scale.y = 1 + 0.035 * Math.sin(time * 2.25);
  };
}

export function makeMantelFrames(hearth) {
  for (const { x, width, height, angle, people } of [
    { x: -1.13, width: 0.61, height: 0.62, angle: 0.15, people: [-0.105, 0.105] },
    { x: 1.42, width: 0.49, height: 0.59, angle: -0.17, people: [0] },
  ]) {
    const frame = group(hearth, x, 2.771, 0.52);
    frame.rotation.set(-0.16, angle, 0);
    box(frame, 0, height * 0.5, 0, width, height, 0.084, 0x5d3a2b);
    box(frame, 0, height * 0.5, 0.044, width - 0.083, height - 0.082, 0.013, 0xb48152);
    box(frame, 0, height * 0.5, 0.054, width - 0.139, height - 0.143, 0.013, 0xd9c59e);
    people.forEach((px, i) => {
      const base = 0.20 + i * 0.023;
      oval(frame, 0x5e5648, px, base + 0.16, 0.064, 0.064, 0.075, 0.009);
      oval(frame, 0x5e5648, px, base, 0.064, 0.105, 0.088, 0.01);
    });
  }
}
