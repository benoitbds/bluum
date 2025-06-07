import assert from 'node:assert/strict';
import test from 'node:test';
import { simulateGeneration } from '../src/evolution.js';

function makeMap(value) {
  return Array.from({ length: 15 }, () => Array.from({ length: 15 }, () => value));
}

test('simulateGeneration spawns offspring with enough energy', () => {
  const values = [0.1];
  let i = 0;
  const originalRandom = Math.random;
  Math.random = () => values[i++] ?? 0.5;

  const originalUUID = crypto.randomUUID;
  crypto.randomUUID = () => 'child-id';

  const parent = { id: 'p1', position: { x: 0, y: 0 }, genes: { size: 1 } };

  const energyMap = makeMap(10);
  const result = simulateGeneration([parent], { energyMap });

  Math.random = originalRandom;
  crypto.randomUUID = originalUUID;

  assert.equal(result.length, 2, 'one offspring added');
  assert.ok(result.some(e => e.id === 'child-id'), 'offspring present');
  const parentOut = result.find(e => e.id === 'p1');
  assert.equal(parentOut.age, 1, 'parent age incremented');
  assert.equal(energyMap[7][7], 4, 'energy deducted');
});

test('simulateGeneration removes entity without energy', () => {
  const originalRandom = Math.random;
  Math.random = () => 0.5;

  const parent = { id: 'p1', position: { x: 0, y: 0 }, genes: { size: 1 } };
  const energyMap = makeMap(0);

  const result = simulateGeneration([parent], { energyMap });

  Math.random = originalRandom;

  assert.equal(result.length, 0, 'entity dies');
  assert.equal(energyMap[7][7], 0, 'energy unchanged');
});
