export function simulateGeneration(entities, environment) {
  return entities.map(e => {
    const survives = Math.random() > 0.1;
    if (!survives) return null;

    const mutated = Math.random() < e.genes.mutationRate;
    if (mutated) {
      e.genes.size += (Math.random() - 0.5) * 0.2;
    }

    const reproduces = Math.random() > 0.8;
    if (reproduces) {
      return [e, { ...e, id: crypto.randomUUID(), genes: { ...e.genes } }];
    }

    return e;
  }).flat().filter(Boolean);
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
