import { initialEntities } from './data.js';
import { simulateGeneration as evolve } from './evolution.js';
import { params } from './params.js';

const GRID_SIZE = 15;
let entities = [];
let energyMap = [];

function initEnergyMap() {
  energyMap = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () =>
      params.energyMax / 2 + Math.random() * (params.energyMax / 2)
    )
  );
}

function regenEnergy() {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let z = 0; z < GRID_SIZE; z++) {
      energyMap[x][z] = Math.min(
        params.energyMax,
        energyMap[x][z] + params.regen
      );
    }
  }
}

export function initWorld(saved) {
  if (saved) {
    ({ entities, energyMap } = saved);
  } else {
    entities = JSON.parse(JSON.stringify(initialEntities));
    initEnergyMap();
  }
}

export function simulateGeneration() {
  regenEnergy();
  entities = evolve(entities, { energyMap });
  return getDelta();
}

export function getDelta() {
  return { entities };
}

export function getWorld() {
  return { entities, energyMap };
}
