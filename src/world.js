import * as THREE from 'three';
import { initialEntities } from './data.js';
import { simulateGeneration, getStats } from './evolution.js';
import { initInstancedMesh, updateInstances } from './instancing.js';

// Générateur de bruit Perlin simplifié pour terrain organique
function noise2D(x, y) {
  const p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
    140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
    247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
    57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
    60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
    65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
    200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
    52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
    207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
    119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
    218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
    81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
    184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
    222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
  
  const perm = [...p, ...p];
  
  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(t, a, b) { return a + t * (b - a); }
  function grad(hash, x, y) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  
  const u = fade(x);
  const v = fade(y);
  
  const A = perm[X] + Y;
  const AA = perm[A];
  const AB = perm[A + 1];
  const B = perm[X + 1] + Y;
  const BA = perm[B];
  const BB = perm[B + 1];
  
  return lerp(v, lerp(u, grad(perm[AA], x, y),
                         grad(perm[BA], x - 1, y)),
                 lerp(u, grad(perm[AB], x, y - 1),
                         grad(perm[BB], x - 1, y - 1)));
}

let entities = [...initialEntities];
let worldScene;
const MAX_INSTANCES = 100000;
const GRID_SIZE = 15;
let energyMap = [];
let tickInterval = 1000;
let tickTimer;
let isPaused = false;
let isEnded = false;
let maxPopulation = entities.length;
let endSummary = null;

// Palette rétro de 32 couleurs (verts ternes, bruns, gris roche)
const RETRO_PALETTE = [
  // Verts ternes (8 couleurs)
  0x3d5a3d, 0x4a6b4a, 0x576857, 0x647564,
  0x718271, 0x7e8f7e, 0x8b9c8b, 0x98a998,
  // Bruns (12 couleurs)  
  0x5d4e37, 0x6b5b42, 0x79684d, 0x877558,
  0x958263, 0xa38f6e, 0xb19c79, 0xbfa984,
  0x8b7355, 0x9d8066, 0xaf8d77, 0xc19a88,
  // Gris roche (12 couleurs)
  0x555555, 0x626262, 0x6f6f6f, 0x7c7c7c,
  0x898989, 0x969696, 0xa3a3a3, 0xb0b0b0,
  0x4a4a4a, 0x575757, 0x646464, 0x717171
];

// Cache pour les hauteurs du terrain  
const terrainHeightCache = new Map();

function initEnergyMap() {
  energyMap = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 5 + Math.random() * 5)
  );
}

function regenEnergy() {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let z = 0; z < GRID_SIZE; z++) {
      energyMap[x][z] = Math.min(10, energyMap[x][z] + 0.2);
    }
  }
}

// Fonction pour créer le diorama épais avec relief
function createTerrain() {
  // BoxGeometry avec subdivisions sur la face supérieure
  const geometry = new THREE.BoxGeometry(15, 2, 15, 14, 1, 14);
  
  const positions = geometry.attributes.position;
  const colors = [];
  
  // Identifier et modifier les vertices de la face supérieure (y = 1)
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    
    // Si c'est un vertex de la face supérieure
    if (Math.abs(y - 1) < 0.001) {
      // Convertir les coordonnées du vertex en indices de grille
      const gridX = Math.round((x + 7.5) / (15/14));
      const gridZ = Math.round((z + 7.5) / (15/14));
      
      // Appliquer du bruit Perlin léger pour le relief
      const noiseScale = 0.2;
      const amplitude = 0.3;
      let height = noise2D(gridX * noiseScale, gridZ * noiseScale) * amplitude;
      
      // Adoucissement des bords
      const edgeX = Math.min(gridX, 14 - gridX) / 7;
      const edgeZ = Math.min(gridZ, 14 - gridZ) / 7;
      const edgeFactor = Math.min(edgeX, edgeZ);
      if (edgeFactor > 0) {
        const smoothEdge = edgeFactor * edgeFactor * (3 - 2 * edgeFactor);
        height *= smoothEdge;
      }
      
      // Appliquer la nouvelle hauteur
      positions.setY(i, 1 + height);
    }
    
    // Couleurs basées sur la hauteur et position (utilise y mis à jour)
    const currentY = positions.getY(i);
    
    let colorIndex;
    if (currentY > 0.5) {
      // Face supérieure : couleur basée sur hauteur et bruit
      const normalizedHeight = (currentY - 1) / 0.3;
      const noiseValue = noise2D(x * 0.3, z * 0.3);
      colorIndex = Math.floor((normalizedHeight + noiseValue + 1) * 15.5) % 32;
    } else {
      // Faces latérales : couleurs plus sombres
      colorIndex = Math.floor(Math.random() * 8) + 24; // Gris plus sombres
    }
    
    const color = new THREE.Color(RETRO_PALETTE[colorIndex]);
    colors.push(color.r, color.g, color.b);
  }
  
  positions.needsUpdate = true;
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  
  return geometry;
}

// Fonction pour obtenir la hauteur du terrain à une position donnée
function getTerrainHeight(x, y) {
  const key = `${Math.floor(x)},${Math.floor(y)}`;
  if (terrainHeightCache.has(key)) {
    return terrainHeightCache.get(key);
  }
  
  // Recalcul simplifié pour le diorama
  const noiseScale = 0.2;
  const amplitude = 0.3;
  let height = 1 + noise2D(x * noiseScale, y * noiseScale) * amplitude;
  
  // Adoucissement des bords
  const edgeX = Math.min(x, 14 - x) / 7;
  const edgeY = Math.min(y, 14 - y) / 7;
  const edgeFactor = Math.min(Math.max(edgeX, 0), Math.max(edgeY, 0));
  if (edgeFactor > 0) {
    const smoothEdge = edgeFactor * edgeFactor * (3 - 2 * edgeFactor);
    height = 1 + (height - 1) * smoothEdge;
  }
  
  terrainHeightCache.set(key, height);
  return height;
}

export function initWorld(scene) {
  worldScene = scene;
  const gridSize = GRID_SIZE;
  initEnergyMap();

  // Créer le diorama épais rétro
  const terrainGeo = createTerrain();
  const terrainMat = new THREE.MeshLambertMaterial({
    vertexColors: true,
    flatShading: true
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
    const terrainHeight = getTerrainHeight(e.position.x + 7, e.position.y + 7);
    e.height = terrainHeight + 0.1;
  });
  initInstancedMesh(scene, MAX_INSTANCES);
  updateInstances(entities.slice(0, MAX_INSTANCES));

  // Éclairage isométrique doux
  const ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(15, 25, 20);
  scene.add(light);
}

export function updateWorld() {

  if (isPaused || isEnded) return;

  regenEnergy();
  entities = simulateGeneration(entities, { energyMap });

  entities.forEach(e => {
    const h = getTerrainHeight(e.position.x + 7, e.position.y + 7);
    e.height = h + 0.1;
  });

  updateInstances(entities.slice(0, MAX_INSTANCES));

  const energyTotal = energyMap.flat().reduce((s, v) => s + v, 0);
  const stats = getStats();
  stats.energyTotal = energyTotal;
  stats.energyAvg = energyTotal / (GRID_SIZE * GRID_SIZE);

  maxPopulation = Math.max(maxPopulation, entities.length);
}

function clearEntities() {
  updateInstances([]);
}

function resetStats() {
  const stats = getStats();
  stats.tick = 0;
  stats.entities = entities.length;
  stats.species = new Set(entities.map(e => e.speciesId)).size;
  stats.deaths = [];
  stats.edgeRejects = 0;
  const total = energyMap.flat().reduce((s, v) => s + v, 0);
  stats.energyTotal = total;
  stats.energyAvg = total / (GRID_SIZE * GRID_SIZE);
}

export function resetWorld() {
  clearEntities();
  entities = [];
  initEnergyMap();
  for (let i = 0; i < 3; i++) {
    const base = JSON.parse(JSON.stringify(initialEntities[0]));
    base.id = crypto.randomUUID();
    base.position = { x: i - 1, y: 0 };
    entities.push(base);
    const h = getTerrainHeight(base.position.x + 7, base.position.y + 7);
    base.height = h + 0.1;
  }
  maxPopulation = entities.length;
  endSummary = null;
  isEnded = false;
  resetStats();
  updateInstances(entities.slice(0, MAX_INSTANCES));
}

export function setTickInterval(ms) {
  tickInterval = ms;
  if (!isPaused && !isEnded) {
    clearInterval(tickTimer);
    tickTimer = setInterval(updateWorld, tickInterval);
  }
}

export function newGame() {
  clearInterval(tickTimer);
  isPaused = false;
  resetWorld();
  tickTimer = setInterval(updateWorld, tickInterval);
}

export function togglePause() {
  if (isPaused) {
    tickTimer = setInterval(updateWorld, tickInterval);
    isPaused = false;
  } else {
    clearInterval(tickTimer);
    isPaused = true;
  }
  return isPaused;
}

export function endGame() {
  if (isEnded) return endSummary;
  clearInterval(tickTimer);
  isPaused = true;
  isEnded = true;
  const stats = getStats();
  endSummary = {
    ticks: stats.tick,
    popMax: maxPopulation,
    species: stats.species
  };
  return endSummary;
}

export function isWorldPaused() {
  return isPaused;
}

export function getEndSummary() {
  return endSummary;
}
