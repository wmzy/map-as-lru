import { describe, it, expect } from 'vitest';
import { create, capacity, get, set, peek } from '../src/index';

describe('LRU Cache', () => {
  describe('Creation', () => {
    it('should create empty cache with specified capacity', () => {
      const cache = create<string, number>(3);
      expect(cache.size).toBe(0);
      // Check that the cache has the capacity symbol property
      const symbols = Object.getOwnPropertySymbols(cache);
      expect(symbols.length).toBeGreaterThan(0);
      // The capacity should be accessible through the symbol
      const capacitySymbol = symbols[0];
      expect((cache as any)[capacitySymbol]).toBe(3);
    });

    it('should create cache from array with specified capacity', () => {
      const initialData: [string, number][] = [
        ['a', 1],
        ['b', 2],
      ];
      const cache = create(3, initialData);
      expect(cache.size).toBe(2);
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(true);
    });

    it('should handle empty array initialization', () => {
      const cache = create<string, number>(3, []);
      expect(cache.size).toBe(0);
    });
  });

  describe('Basic Operations', () => {
    it('should return capacity', () => {
      const cache = create<string, number>(3);
      expect(capacity(cache)).toBe(3);
    });

    it('should set and get values', () => {
      const cache = create<string, number>(3);
      set(cache, 'key1', 100);
      expect(get(cache, 'key1')).toBe(100);
      expect(cache.size).toBe(1);
    });

    it('should return undefined for non-existent keys', () => {
      const cache = create<string, number>(3);
      expect(get(cache, 'nonexistent')).toBeUndefined();
      expect(peek(cache, 'nonexistent')).toBeUndefined();
    });

    it('should update existing values', () => {
      const cache = create<string, number>(3);
      set(cache, 'key1', 100);
      set(cache, 'key1', 200);
      expect(get(cache, 'key1')).toBe(200);
      expect(cache.size).toBe(1);
    });
  });

  describe('Peek vs Get', () => {
    it('should peek without affecting order', () => {
      const cache = create<string, number>(3);
      set(cache, 'a', 1);
      set(cache, 'b', 2);
      set(cache, 'c', 3);

      // Peek shouldn't change order
      expect(peek(cache, 'a')).toBe(1);

      // Add one more to trigger eviction
      set(cache, 'd', 4);

      // 'a' should be evicted since peek didn't update its position
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(true);
      expect(cache.has('d')).toBe(true);
    });

    it('should get and update access order', () => {
      const cache = create<string, number>(3);
      set(cache, 'a', 1);
      set(cache, 'b', 2);
      set(cache, 'c', 3);

      // Get should update order
      expect(get(cache, 'a')).toBe(1);

      // Add one more to trigger eviction
      set(cache, 'd', 4);

      // 'b' should be evicted since 'a' was moved to most recent
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('c')).toBe(true);
      expect(cache.has('d')).toBe(true);
    });
  });

  describe('Capacity Management', () => {
    it('should respect capacity limits', () => {
      const cache = create<string, number>(2);
      set(cache, 'a', 1);
      set(cache, 'b', 2);
      expect(cache.size).toBe(2);

      // Adding third item should evict the least recently used
      set(cache, 'c', 3);
      expect(cache.size).toBe(2);
      expect(cache.has('a')).toBe(false); // 'a' should be evicted
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(true);
    });

    it('should handle capacity of 1', () => {
      const cache = create<string, number>(1);
      set(cache, 'a', 1);
      expect(cache.size).toBe(1);
      expect(get(cache, 'a')).toBe(1);

      set(cache, 'b', 2);
      expect(cache.size).toBe(1);
      expect(cache.has('a')).toBe(false);
      expect(get(cache, 'b')).toBe(2);
    });

    it('should handle capacity of 0', () => {
      const cache = create<string, number>(0);
      set(cache, 'a', 1);
      expect(cache.size).toBe(0);
      expect(cache.has('a')).toBe(false);
    });
  });

  describe('LRU Eviction Order', () => {
    it('should evict least recently used items', () => {
      const cache = create<string, number>(3);

      // Fill cache
      set(cache, 'a', 1);
      set(cache, 'b', 2);
      set(cache, 'c', 3);

      // Access 'a' to make it most recently used
      get(cache, 'a');

      // Access 'b' to make it most recently used
      get(cache, 'b');

      // Now order should be: c (LRU), a, b (MRU)
      // Adding 'd' should evict 'c'
      set(cache, 'd', 4);

      expect(cache.has('c')).toBe(false);
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('d')).toBe(true);
    });

    it('should maintain correct order with mixed operations', () => {
      const cache = create<string, number>(3);

      set(cache, 'a', 1);
      set(cache, 'b', 2);
      set(cache, 'c', 3);

      // Update existing key should move it to most recent
      set(cache, 'a', 10);

      // Add new key should evict 'b' (now LRU)
      set(cache, 'd', 4);

      expect(cache.has('b')).toBe(false);
      expect(cache.has('a')).toBe(true);
      expect(cache.has('c')).toBe(true);
      expect(cache.has('d')).toBe(true);
      expect(get(cache, 'a')).toBe(10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle string keys', () => {
      const cache = create<string, string>(2);
      set(cache, 'hello', 'world');
      set(cache, 'foo', 'bar');
      expect(get(cache, 'hello')).toBe('world');
      expect(get(cache, 'foo')).toBe('bar');
    });

    it('should handle number keys', () => {
      const cache = create<number, string>(2);
      set(cache, 1, 'one');
      set(cache, 2, 'two');
      expect(get(cache, 1)).toBe('one');
      expect(get(cache, 2)).toBe('two');
    });

    it('should handle object values', () => {
      const cache = create<string, { value: number }>(2);
      const objA = { value: 1 };
      const objB = { value: 2 };

      set(cache, 'a', objA);
      set(cache, 'b', objB);

      expect(get(cache, 'a')).toBe(objA);
      expect(get(cache, 'b')).toBe(objB);
    });
  });

  describe('Map Interface Compatibility', () => {
    it('should support Map methods', () => {
      const cache = create<string, number>(3);
      set(cache, 'a', 1);
      set(cache, 'b', 2);

      expect(cache.has('a')).toBe(true);
      expect(cache.has('c')).toBe(false);
      expect(cache.size).toBe(2);

      cache.delete('a');
      expect(cache.has('a')).toBe(false);
      expect(cache.size).toBe(1);

      cache.clear();
      expect(cache.size).toBe(0);
    });

    it('should support iteration', () => {
      const cache = create<string, number>(3);
      set(cache, 'a', 1);
      set(cache, 'b', 2);
      set(cache, 'c', 3);

      const keys = Array.from(cache.keys());
      const values = Array.from(cache.values());
      const entries = Array.from(cache.entries());

      expect(keys).toEqual(['a', 'b', 'c']);
      expect(values).toEqual([1, 2, 3]);
      expect(entries).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });
  });
});
