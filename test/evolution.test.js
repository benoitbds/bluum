import assert from 'node:assert/strict';
import test from 'node:test';
import { simulateGeneration } from '../src/evolution.js';

test('simulateGeneration returns entities array without nulls and generates id', () => {
  const values = [0.5, 0, 0.5, 0.9];
  let i = 0;
  const originalRandom = Math.random;
  Math.random = () => values[i++] ?? 0.5;

  let generatedId;
  const originalUUID = crypto.randomUUID;
  crypto.randomUUID = () => {
    generatedId = 'new-id';
    return generatedId;
  };

  const parent = {
    id: 'p1',
    position: { x: 0, y: 0 },
    genes: { size: 1, mutationRate: 0.1 }
  };

  const result = simulateGeneration([parent], {});

  Math.random = originalRandom;
  crypto.randomUUID = originalUUID;

  assert.ok(Array.isArray(result), 'result should be an array');
  assert.ok(result.every(e => e !== null), 'no null entries');
  assert.equal(result.length, 2, 'reproduction adds an offspring');
  const offspring = result.find(e => e.id === generatedId);
  assert.ok(offspring, 'offspring with generated ID exists');
});

