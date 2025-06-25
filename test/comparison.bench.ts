import { bench, describe } from 'vitest';
import {
  create as mapAsLruCreate,
  get as mapAsLruGet,
  set as mapAsLruSet,
} from '../src/index';

// Import comparison libraries
import hashlru from 'hashlru';
import QuickLRU from 'quick-lru';
import { LRUCache } from 'lru-cache';
import { LRUCache as MnemonistLRU } from 'mnemonist';

describe('LRU Cache Libraries Comparison', () => {
  const N = 10_000;
  const cacheSize = 1000;

  describe('Basic Set Operations', () => {
    bench('map-as-lru', () => {
      const cache = mapAsLruCreate<number, number>(cacheSize);
      for (let i = 0; i < N; i++) {
        mapAsLruSet(cache, i, i);
      }
    });

    bench('hashlru', () => {
      const cache = hashlru(cacheSize);
      for (let i = 0; i < N; i++) {
        cache.set(i, i);
      }
    });

    bench('quick-lru', () => {
      const cache = new QuickLRU<number, number>({ maxSize: cacheSize });
      for (let i = 0; i < N; i++) {
        cache.set(i, i);
      }
    });

    bench('lru-cache', () => {
      const cache = new LRUCache<number, number>({ max: cacheSize });
      for (let i = 0; i < N; i++) {
        cache.set(i, i);
      }
    });

    bench('mnemonist', () => {
      const cache = new MnemonistLRU<number, number>(cacheSize);
      for (let i = 0; i < N; i++) {
        cache.set(i, i);
      }
    });
  });

  describe('Basic Get Operations (Cache Hit)', () => {
    bench('map-as-lru', () => {
      const cache = mapAsLruCreate<number, number>(cacheSize);
      // Pre-populate
      for (let i = 0; i < cacheSize; i++) {
        mapAsLruSet(cache, i, i);
      }
      // Test get operations
      for (let i = 0; i < cacheSize; i++) {
        mapAsLruGet(cache, i);
      }
    });

    bench('hashlru', () => {
      const cache = hashlru(cacheSize);
      // Pre-populate
      for (let i = 0; i < cacheSize; i++) {
        cache.set(i, i);
      }
      // Test get operations
      for (let i = 0; i < cacheSize; i++) {
        cache.get(i);
      }
    });

    bench('quick-lru', () => {
      const cache = new QuickLRU<number, number>({ maxSize: cacheSize });
      // Pre-populate
      for (let i = 0; i < cacheSize; i++) {
        cache.set(i, i);
      }
      // Test get operations
      for (let i = 0; i < cacheSize; i++) {
        cache.get(i);
      }
    });

    bench('lru-cache', () => {
      const cache = new LRUCache<number, number>({ max: cacheSize });
      // Pre-populate
      for (let i = 0; i < cacheSize; i++) {
        cache.set(i, i);
      }
      // Test get operations
      for (let i = 0; i < cacheSize; i++) {
        cache.get(i);
      }
    });

    bench('mnemonist', () => {
      const cache = new MnemonistLRU<number, number>(cacheSize);
      // Pre-populate
      for (let i = 0; i < cacheSize; i++) {
        cache.set(i, i);
      }
      // Test get operations
      for (let i = 0; i < cacheSize; i++) {
        cache.get(i);
      }
    });
  });

  describe('Mixed Operations (50% get, 50% set)', () => {
    bench('map-as-lru', () => {
      const cache = mapAsLruCreate<number, number>(cacheSize);
      for (let i = 0; i < N; i++) {
        if (i % 2 === 0) {
          mapAsLruSet(cache, i, i);
        } else {
          mapAsLruGet(cache, Math.floor(i / 2));
        }
      }
    });

    bench('hashlru', () => {
      const cache = hashlru(cacheSize);
      for (let i = 0; i < N; i++) {
        if (i % 2 === 0) {
          cache.set(i, i);
        } else {
          cache.get(Math.floor(i / 2));
        }
      }
    });

    bench('quick-lru', () => {
      const cache = new QuickLRU<number, number>({ maxSize: cacheSize });
      for (let i = 0; i < N; i++) {
        if (i % 2 === 0) {
          cache.set(i, i);
        } else {
          cache.get(Math.floor(i / 2));
        }
      }
    });

    bench('lru-cache', () => {
      const cache = new LRUCache<number, number>({ max: cacheSize });
      for (let i = 0; i < N; i++) {
        if (i % 2 === 0) {
          cache.set(i, i);
        } else {
          cache.get(Math.floor(i / 2));
        }
      }
    });

    bench('mnemonist', () => {
      const cache = new MnemonistLRU<number, number>(cacheSize);
      for (let i = 0; i < N; i++) {
        if (i % 2 === 0) {
          cache.set(i, i);
        } else {
          cache.get(Math.floor(i / 2));
        }
      }
    });
  });

  describe('LRU Eviction Pattern', () => {
    const evictionOps = 5000;
    const smallCache = 100;

    bench('map-as-lru', () => {
      const cache = mapAsLruCreate<number, number>(smallCache);
      for (let i = 0; i < evictionOps; i++) {
        mapAsLruSet(cache, i, i);
      }
    });

    bench('hashlru', () => {
      const cache = hashlru(smallCache);
      for (let i = 0; i < evictionOps; i++) {
        cache.set(i, i);
      }
    });

    bench('quick-lru', () => {
      const cache = new QuickLRU<number, number>({ maxSize: smallCache });
      for (let i = 0; i < evictionOps; i++) {
        cache.set(i, i);
      }
    });

    bench('lru-cache', () => {
      const cache = new LRUCache<number, number>({ max: smallCache });
      for (let i = 0; i < evictionOps; i++) {
        cache.set(i, i);
      }
    });

    bench('mnemonist', () => {
      const cache = new MnemonistLRU<number, number>(smallCache);
      for (let i = 0; i < evictionOps; i++) {
        cache.set(i, i);
      }
    });
  });

  describe('String Keys Performance', () => {
    const stringOps = 5000;

    bench('map-as-lru', () => {
      const cache = mapAsLruCreate<string, number>(cacheSize);
      for (let i = 0; i < stringOps; i++) {
        const key = `key_${i}`;
        mapAsLruSet(cache, key, i);
        if (i % 2 === 0) {
          mapAsLruGet(cache, key);
        }
      }
    });

    bench('hashlru', () => {
      const cache = hashlru(cacheSize);
      for (let i = 0; i < stringOps; i++) {
        const key = `key_${i}`;
        cache.set(key, i);
        if (i % 2 === 0) {
          cache.get(key);
        }
      }
    });

    bench('quick-lru', () => {
      const cache = new QuickLRU<string, number>({ maxSize: cacheSize });
      for (let i = 0; i < stringOps; i++) {
        const key = `key_${i}`;
        cache.set(key, i);
        if (i % 2 === 0) {
          cache.get(key);
        }
      }
    });

    bench('lru-cache', () => {
      const cache = new LRUCache<string, number>({ max: cacheSize });
      for (let i = 0; i < stringOps; i++) {
        const key = `key_${i}`;
        cache.set(key, i);
        if (i % 2 === 0) {
          cache.get(key);
        }
      }
    });

    bench('mnemonist', () => {
      const cache = new MnemonistLRU<string, number>(cacheSize);
      for (let i = 0; i < stringOps; i++) {
        const key = `key_${i}`;
        cache.set(key, i);
        if (i % 2 === 0) {
          cache.get(key);
        }
      }
    });
  });
});
