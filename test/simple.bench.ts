import { bench, describe } from 'vitest';
import { create, get, set } from '../src/index';

describe('LRU Cache - Quick Benchmarks', () => {
  const N = 10_000; // Reduced number for quicker tests

  describe('Core Operations', () => {
    bench('set operations', () => {
      const cache = create<number, number>(N);
      for (let i = 0; i < N; i++) {
        set(cache, i, i);
      }
    });

    bench('get operations (cache hit)', () => {
      const cache = create<number, number>(N);
      // Pre-populate cache
      for (let i = 0; i < N; i++) {
        set(cache, i, i);
      }

      // Benchmark get operations
      for (let i = 0; i < N; i++) {
        get(cache, i);
      }
    });

    bench('mixed operations (50% get, 50% set)', () => {
      const cache = create<number, number>(N / 2);

      for (let i = 0; i < N; i++) {
        if (i % 2 === 0) {
          set(cache, i, i);
        } else {
          get(cache, i / 2);
        }
      }
    });

    bench('LRU eviction pattern', () => {
      const cache = create<number, number>(1000); // Small cache for more evictions

      for (let i = 0; i < N; i++) {
        set(cache, i, i);
      }
    });
  });

  describe('Performance Comparison', () => {
    [100, 1000, 5000].forEach((size) => {
      bench(`cache size ${size}`, () => {
        const cache = create<number, number>(size);
        const ops = Math.min(N, size * 2);

        for (let i = 0; i < ops; i++) {
          set(cache, i, i);
          if (i % 3 === 0) {
            get(cache, i / 2);
          }
        }
      });
    });
  });
});
