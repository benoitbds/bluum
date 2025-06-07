import assert from 'node:assert/strict';
import test from 'node:test';
import { simulateGeneration } from '../src/evolution.js';

// Verify that offspring is created when probability threshold is met
test('simulateGeneration spawns offspring', () => {
  const values = [0.1];
  let i = 0;
  const originalRandom = Math.random;
  Math.random = () => values[i++] ?? 0.5;

  const originalUUID = crypto.randomUUID;
  crypto.randomUUID = () => 'child-id';

  const parent = { id: 'p1', position: { x: 0, y: 0 }, genes: { size: 1 } };

  const result = simulateGeneration([parent], {});

  Math.random = originalRandom;
  crypto.randomUUID = originalUUID;

  assert.equal(result.length, 2, 'one offspring added');
  assert.ok(result.some(e => e.id === 'child-id'), 'offspring present');
  const parentOut = result.find(e => e.id === 'p1');
  assert.equal(parentOut.age, 1, 'parent age incremented');
});

// Population cap should remove oldest individuals
test('simulateGeneration caps population over 50', () => {
  const originalRandom = Math.random;
  Math.random = () => 0.5; // never spawn

  const entities = Array.from({ length: 51 }, (_, i) => ({
    id: `e${i}`,
    position: { x: 0, y: 0 },
    genes: {},
    age: i
  }));

  const result = simulateGeneration(entities, {});

  Math.random = originalRandom;

  assert.equal(result.length, 46, '10% oldest removed');
  assert.ok(!result.some(e => e.id === 'e50'), 'oldest entity removed');
});
