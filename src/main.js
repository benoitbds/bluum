import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { initWorld, newGame, togglePause, endGame, setTickInterval, setEnergyMax, applyDelta } from './world.js';
import { updateHUD } from './hud.js';
import { getStats } from './evolution.js';
import { initTempoSlider } from './tempoSlider.js';
import { initControls } from './controls.js';
import { initParamsPanel } from './params.js';

console.log("Bluum is alive");
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 0.1, 100);
camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('world'), antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1);
renderer.domElement.style.imageRendering = 'pixelated';

// OrbitControls pour naviguer avec la souris
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2 - 0.1;
controls.minZoom = 0.5;
controls.maxZoom = 2;

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
});

initWorld(scene);
const useWS = window.location.protocol.startsWith('ws');
if (useWS) {
  const ws = new WebSocket(`${window.location.protocol}//${window.location.host}`);
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.data) applyDelta(msg.data);
  });
  ws.addEventListener('close', () => {
    newGame();
  });
} else {
  newGame();
}

initTempoSlider((newMs) => {
  setTickInterval(newMs);
});

initParamsPanel(setEnergyMax);

initControls(newGame, togglePause, endGame);

animate();

function animate() {
  requestAnimationFrame(animate);
  updateHUD(getStats());
  controls.update();
  renderer.render(scene, camera);
}
