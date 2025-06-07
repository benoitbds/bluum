import * as THREE from 'three';

let instancedMesh = null;
let MAX_INSTANCES = 0;
const dummy = new THREE.Object3D();

export function initInstancedMesh(scene, max = 2000) {
  MAX_INSTANCES = max;
  const geometry = new THREE.SphereGeometry(0.4, 8, 8);
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true });
  instancedMesh = new THREE.InstancedMesh(geometry, material, MAX_INSTANCES);
  instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES * 3), 3);
  scene.add(instancedMesh);
  return instancedMesh;
}

export function updateInstances(entities) {
  if (!instancedMesh) return;
  const count = Math.min(entities.length, MAX_INSTANCES);
  instancedMesh.count = count;
  for (let i = 0; i < count; i++) {
    const e = entities[i];
    dummy.position.set(e.position.x, e.height ?? 0, e.position.y);
    const size = e.genes.size || 0.5;
    dummy.scale.set(size, size, size);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);

    const hue = e.genes.hue ?? 0;
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
    instancedMesh.setColorAt(i, color);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;
  if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
}
