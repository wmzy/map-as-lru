const capacitySymbol = Symbol('capacity');

export type LRUCache<K, V> = {
  [capacitySymbol]: number;
} & Omit<Map<K, V>, 'get' | 'set'>;

export function create<K, V>(
  capacity: number,
  iterable?: Iterable<readonly [K, V]> | null
): LRUCache<K, V> {
  return Object.assign(new Map(iterable), {
    [capacitySymbol]: capacity,
  }) as LRUCache<K, V>;
}

export function capacity(cache: { [capacitySymbol]: number }): number {
  return cache[capacitySymbol];
}

function reset<K, V>(cache: LRUCache<K, V>, key: K, value: V) {
  cache.delete(key);
  (cache as any).set(key, value);
}

export function get<K, V>(cache: LRUCache<K, V>, key: K): V | undefined {
  const value = (cache as any).get(key);
  if (cache.has(key)) {
    reset(cache, key, value);
  }
  return value;
}

export function peek<K, V>(cache: LRUCache<K, V>, key: K): V | undefined {
  return (cache as any).get(key);
}

export function set<K, V>(cache: LRUCache<K, V>, key: K, value: V) {
  reset(cache, key, value);
  if (cache.size > cache[capacitySymbol]) {
    cache.delete(cache.keys().next().value!);
  }
}
