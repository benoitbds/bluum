import * as THREE from 'three';

export function createEntityVisual(genes) {
  const geometry = new THREE.SphereGeometry(genes.size || 0.5, 8, 8);
  const color = new THREE.Color(genes.r || 0.4, genes.g || 0.8, genes.b || 0.4);
  const material = new THREE.MeshStandardMaterial({ color });
  return new THREE.Mesh(geometry, material);
}
