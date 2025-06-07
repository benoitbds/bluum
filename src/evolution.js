
import { params } from './params.js';
const stats = {
  tick: 0,
  entities: 0,
  species: 0,
  deaths: [],
  edgeRejects: 0,
  energyTotal: 0,
  energyAvg: 0
};

export function getStats() {
  return stats;
}

export function simulateGeneration(entities, environment) {
  const { energyMap } = environment;
  let next = [];
  const deaths = [];

  for (const entity of entities) {
    entity.age = (entity.age ?? 0) + 1;

    const size = entity.genes.size ?? 0.5;
    const energyCost = params.survivalCost + (size * 0.5);

    const x = Math.round(entity.position.x + 7);
    const z = Math.round(entity.position.y + 7);
    const available = energyMap[x]?.[z] ?? 0;

    if (available >= energyCost) {
      energyMap[x][z] = available - energyCost;
      next.push(entity);

      if (Math.random() < 0.2 && energyMap[x][z] >= energyCost * params.reproMul) {
        energyMap[x][z] -= energyCost * params.reproMul;
        const offspring = spawnOffspring(entity);
        if (offspring) {
          offspring.age = 0;
          next.push(offspring);
        }
      }
    } else {
      deaths.push(entity.id);
    }
  }

  stats.tick++;
  stats.entities = next.length;
  stats.species = new Set(next.map(e => e.speciesId)).size;
  stats.deaths = deaths;

  return next;
}

export function spawnOffspring(parent) {
  // Deep clone the parent entity so we don't mutate it
  const offspring = JSON.parse(JSON.stringify(parent));

  // Assign a new unique ID
  offspring.id = crypto.randomUUID();

  offspring.speciesId = parent.speciesId;

  // Slightly mutate each numeric gene (\u00b1mutationRate)
  for (const key of Object.keys(offspring.genes)) {
    const value = offspring.genes[key];
    if (typeof value === 'number') {
      const range = params.mutationRate;
      const variation = (Math.random() * (range * 2)) - range;
      offspring.genes[key] = value + value * variation;
    }
  }

  // Offset of exactly \u00b11 tile
  const offsetX = Math.random() < 0.5 ? -1 : 1;
  const offsetZ = Math.random() < 0.5 ? -1 : 1;

  const SAFE_MIN = -7;
  const SAFE_MAX = 7;

  let newX = parent.position.x + offsetX;
  let newZ = parent.position.y + offsetZ;

  const clampedX = Math.min(Math.max(newX, SAFE_MIN), SAFE_MAX);
  const clampedZ = Math.min(Math.max(newZ, SAFE_MIN), SAFE_MAX);

  if (Math.abs(clampedX - newX) > 0.2 || Math.abs(clampedZ - newZ) > 0.2) {
    stats.edgeRejects++;
    return null;
  }

  // Position the offspring within the safe zone
  offspring.position = { x: clampedX, y: clampedZ };

  return offspring;
}
