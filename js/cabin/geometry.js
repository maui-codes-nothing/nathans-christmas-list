import * as THREE from "three";

const unitBox = new THREE.BoxGeometry();
const materials = new Map();

export function matte(color) {
  if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.91 }));
  return materials.get(color);
}

export function mesh(parent, geometry, material, x, y, z) {
  const item = new THREE.Mesh(geometry, material.isMaterial ? material : matte(material));
  item.position.set(x, y, z);
  parent.add(item);
  return item;
}

export function box(parent, x, y, z, width, height, depth, material) {
  const item = mesh(parent, unitBox, material, x, y, z);
  item.scale.set(width, height, depth);
  return item;
}

export function group(parent, x = 0, y = 0, z = 0) {
  const item = new THREE.Group();
  item.position.set(x, y, z);
  parent.add(item);
  return item;
}

export function glow(color) {
  return new THREE.MeshBasicMaterial({ color });
}

export function star(parent, x, y, z, radius, color) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const angle = Math.PI / 2 + i * Math.PI / 5;
    const length = i % 2 ? radius * 0.45 : radius;
    const px = Math.cos(angle) * length;
    const py = Math.sin(angle) * length;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  }
  shape.closePath();
  return mesh(parent, new THREE.ExtrudeGeometry(shape, { depth: 0.07, bevelEnabled: false }), glow(color), x, y, z);
}

export function randomGenerator(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
