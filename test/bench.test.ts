import { bench, describe } from 'vitest';
import { create, get, set } from '../src/index';

describe('LRU Cache Benchmarks', () => {
  const N = 200_000; // Number of items for benchmarking
  const cacheSize = N;

  describe('Basic Operations', () => {
    bench('set', () => {
      const cache = create<number, number>(cacheSize);
      for (let i = 0; i < N; i++) {
        set(cache, i, Math.random());
      }
    });

    bench('get (hit)', () => {
      const cache = create<number, number>(cacheSize);
      // Pre-populate cache
      for (let i = 0; i < N; i++) {
        set(cache, i, Math.random());
      }

      // Benchmark get operations
      for (let i = 0; i < N; i++) {
        get(cache, i);
      }
    });

    bench('update existing keys', () => {
      const cache = create<number, number>(cacheSize);
      // Pre-populate cache
      for (let i = 0; i < N; i++) {
        set(cache, i, Math.random());
      }

      // Benchmark update operations
      for (let i = 0; i < N; i++) {
        set(cache, i, Math.random());
      }
    });

    bench('get after update', () => {
      const cache = create<number, number>(cacheSize);
      // Pre-populate cache
      for (let i = 0; i < N; i++) {
        set(cache, i, Math.random());
      }
      // Update all keys
      for (let i = 0; i < N; i++) {
        set(cache, i, Math.random());
      }

      // Benchmark get operations after update
      for (let i = 0; i < N; i++) {
        get(cache, i);
      }
    });

    bench('evict (LRU behavior)', () => {
      const cache = create<number, number>(cacheSize);
      // Pre-populate cache to capacity
      for (let i = 0; i < N; i++) {
        set(cache, i, Math.random());
      }

      // Benchmark eviction by adding new keys beyond capacity
      for (let i = N; i < N * 2; i++) {
        set(cache, i, Math.random());
      }
    });
  });

  describe('Mixed Workload', () => {
    bench('mixed operations (80% get, 20% set)', () => {
      const cache = create<number, number>(Math.floor(N / 2));
      // Pre-populate half the cache
      for (let i = 0; i < N / 2; i++) {
        set(cache, i, Math.random());
      }

      // Mixed workload
      for (let i = 0; i < N; i++) {
        if (Math.random() < 0.8) {
          // 80% get operations
          get(cache, Math.floor(Math.random() * N));
        } else {
          // 20% set operations
          set(cache, Math.floor(Math.random() * N), Math.random());
        }
      }
    });

    bench('sequential access pattern', () => {
      const cache = create<number, number>(1000); // Smaller cache for more evictions

      for (let i = 0; i < N; i++) {
        set(cache, i, i);
        // Occasionally access older items
        if (i > 100 && i % 10 === 0) {
          get(cache, i - 50);
        }
      }
    });

    bench('random access pattern', () => {
      const cache = create<number, number>(10000);

      for (let i = 0; i < N; i++) {
        const key = Math.floor(Math.random() * N);
        if (Math.random() < 0.5) {
          set(cache, key, Math.random());
        } else {
          get(cache, key);
        }
      }
    });
  });

  describe('Different Cache Sizes', () => {
    [100, 1000, 10000, 100000].forEach((size) => {
      bench(`set operations with cache size ${size}`, () => {
        const cache = create<number, number>(size);
        const ops = Math.min(N, size * 2); // Don't exceed reasonable operation count

        for (let i = 0; i < ops; i++) {
          set(cache, i, Math.random());
        }
      });
    });
  });

  describe('Different Key Types', () => {
    bench('string keys', () => {
      const cache = create<string, number>(10000);

      for (let i = 0; i < N / 10; i++) {
        // Reduced for string performance
        const key = `key_${i}`;
        set(cache, key, Math.random());
        if (i % 2 === 0) {
          get(cache, key);
        }
      }
    });

    bench('object keys', () => {
      const cache = create<object, number>(10000);
      const keys = Array.from({ length: N / 10 }, (_, i) => ({ id: i }));

      for (let i = 0; i < keys.length; i++) {
        set(cache, keys[i], Math.random());
        if (i % 2 === 0) {
          get(cache, keys[i]);
        }
      }
    });
  });
});
