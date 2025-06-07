
export function simulateGeneration(entities, environment) {
  let next = [];
  for (const entity of entities) {
    entity.age = (entity.age ?? 0) + 1;
    next.push(entity);

    if (Math.random() < 0.2) {
      const offspring = spawnOffspring(entity);
      offspring.age = 0;
      next.push(offspring);
    }
  }

  if (next.length > 50) {
    const killCount = Math.floor(next.length * 0.1);
    const sorted = [...next].sort((a, b) => b.age - a.age);
    const toRemove = new Set(sorted.slice(0, killCount).map(e => e.id));
    next = next.filter(e => !toRemove.has(e.id));
  }

  return next;
}

export function spawnOffspring(parent) {
  // Deep clone the parent entity so we don't mutate it
  const offspring = JSON.parse(JSON.stringify(parent));

  // Assign a new unique ID
  offspring.id = crypto.randomUUID();

  // Slightly mutate each numeric gene (\u00b110%)
  for (const key of Object.keys(offspring.genes)) {
    const value = offspring.genes[key];
    if (typeof value === 'number') {
      const variation = (Math.random() * 0.2) - 0.1; // -10% to +10%
      offspring.genes[key] = value + value * variation;
    }
  }

  // Position the offspring near the parent (\u00b11 tile)
  offspring.position = {
    x: parent.position.x + Math.floor(Math.random() * 3) - 1,
    y: parent.position.y + Math.floor(Math.random() * 3) - 1
  };

  return offspring;
}
