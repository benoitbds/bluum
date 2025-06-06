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
