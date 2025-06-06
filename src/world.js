import * as THREE from 'three';
import { initialEntities } from './data.js';
import { simulateGeneration } from './evolution.js';
import { createEntityVisual } from './visuals.js';

let entities = [...initialEntities];
const entityMeshes = [];

export function initWorld(scene) {
  entities.forEach(e => {
    const mesh = createEntityVisual(e.genes);
    mesh.position.set(e.position.x, 0, e.position.y);
    scene.add(mesh);
    entityMeshes.push(mesh);
  });

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);
}

export function updateWorld() {
  // Pour le MVP : toutes les 5s, mise à jour des entités (mutation / mort)
  if (Math.random() < 0.01) {
    entities = simulateGeneration(entities, {});
    // Re-render à faire ici (à affiner)
  }
}
