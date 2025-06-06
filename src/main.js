import * as THREE from 'three';
import { initWorld, updateWorld } from './world.js';

console.log("Bluum is alive");
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 0.1, 100);
camera.position.set(10, 10, 10);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('world'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

initWorld(scene);
animate();

function animate() {
  requestAnimationFrame(animate);
  updateWorld();
  renderer.render(scene, camera);
}
