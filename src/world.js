import * as THREE from 'three';
import { initialEntities } from './data.js';
import { simulateGeneration } from './evolution.js';
import { createEntityVisual } from './visuals.js';

let entities = [...initialEntities];
const entityMeshes = [];

export function initWorld(scene) {
  const gridSize = 15;

  // Plateau isométrique stylisé adouci
  const terrainGeo = new THREE.PlaneGeometry(15, 15, 14, 14);
  terrainGeo.rotateX(-Math.PI / 2); // mise à plat
  const pos = terrainGeo.attributes.position;
  const colors = [];
  const vertsPerRow = 15; // 14 + 1

  for (let iy = 0; iy <= 14; iy++) {
    for (let ix = 0; ix <= 14; ix++) {
      const i = iy * vertsPerRow + ix;
      // Relief aléatoire doux sur toute la surface
      const y = Math.random() * 0.2 - 0.1;
      pos.setY(i, y);

      // Palette ocres / verts ternes / gris
      let h, s, l;
      const r = Math.random();
      if (r < 0.4) {
        h = 0.08 + Math.random() * 0.05;
        s = 0.4 + Math.random() * 0.1;
        l = 0.4 + Math.random() * 0.1;
      } else if (r < 0.8) {
        h = 0.28 + Math.random() * 0.05;
        s = 0.2 + Math.random() * 0.1;
        l = 0.35 + Math.random() * 0.1;
      } else {
        h = 0;
        s = 0;
        l = 0.3 + Math.random() * 0.1;
      }
      const c = new THREE.Color().setHSL(h, s, l);
      colors.push(c.r, c.g, c.b);
    }
  }
  pos.needsUpdate = true;
  terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    roughness: 0.8,
    metalness: 0.2,
    emissive: 0x111111,
    emissiveIntensity: 0.15
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  scene.add(terrain);

  // Sol global plus sombre
  const floorGeo = new THREE.PlaneGeometry(gridSize + 2, gridSize + 2);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    side: THREE.DoubleSide,
    flatShading: true
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.05;
  scene.add(floor);

  entities.forEach(e => {
    const mesh = createEntityVisual(e.genes);
    mesh.position.set(e.position.x, 0, e.position.y);
    scene.add(mesh);
    entityMeshes.push(mesh);
  });

  // Éclairage isométrique doux
  const ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(15, 25, 20);
  scene.add(light);
}

export function updateWorld() {
  // Pour le MVP : mise à jour des entités de façon aléatoire (mutation / mort)
  if (Math.random() < 0.01) {
    entities = simulateGeneration(entities, {});
    // Re-render à faire ici (à affiner)
  }
}
