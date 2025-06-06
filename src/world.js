import * as THREE from 'three';
import { initialEntities } from './data.js';
import { simulateGeneration } from './evolution.js';
import { createEntityVisual } from './visuals.js';

let entities = [...initialEntities];
const entityMeshes = [];

export function initWorld(scene) {
  const gridSize = 15;

  // Plateau isométrique stylisé
  const terrain = new THREE.Group();
  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const height = 0.1 + Math.random() * 0.3;
      const geometry = new THREE.BoxGeometry(1, height, 1);

      // Couleurs ocres / verts ternes / argiles
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
      const color = new THREE.Color().setHSL(h, s, l);
      const material = new THREE.MeshStandardMaterial({ color, flatShading: true });
      const cell = new THREE.Mesh(geometry, material);
      cell.position.set(x - gridSize / 2 + 0.5, height / 2, z - gridSize / 2 + 0.5);
      terrain.add(cell);
    }
  }
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
