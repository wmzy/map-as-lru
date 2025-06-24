# Map as LRU

[![npm version](https://badge.fury.io/js/map-as-lru.svg)](https://badge.fury.io/js/map-as-lru)
[![Build Status](https://github.com/wmzy/map-as-lru/actions/workflows/ci.yml/badge.svg)](https://github.com/wmzy/map-as-lru/actions)
[![Coverage Status](https://coveralls.io/repos/github/wmzy/map-as-lru/badge.svg?branch=main)](https://coveralls.io/github/wmzy/map-as-lru?branch=main)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [create](#create)
  - [capacity](#capacity)
  - [set](#set)
  - [get](#get)
  - [peek](#peek)
  - [Map Methods](#map-methods)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Description

Map as LRU is a lightweight and efficient LRU (Least Recently Used) cache implementation built on top of JavaScript's native Map. It provides a functional API for cache operations while maintaining LRU eviction behavior when the cache reaches its capacity limit.

## Features

- ✅ **Lightweight**: Built on native JavaScript Map
- ✅ **Functional API**: Immutable-style operations
- ✅ **TypeScript Support**: Full type safety with generics
- ✅ **LRU Eviction**: Automatically evicts least recently used items
- ✅ **Map Compatible**: Supports standard Map methods and iteration
- ✅ **Peek Operation**: Access values without affecting LRU order
- ✅ **Flexible Keys**: Supports any type as keys (string, number, object, etc.)

## Installation

To install Map as LRU, use npm or pnpm:

```bash
npm install map-as-lru
```

or

```bash
pnpm add map-as-lru
```

## Usage

Here is a basic example of how to use it:

```typescript
import * as lru from 'map-as-lru';

// Create a cache with capacity of 3
const cache = lru.create<string, number>(3);

// Set values
lru.set(cache, 'a', 1);
lru.set(cache, 'b', 2);
lru.set(cache, 'c', 3);

// Get values (updates LRU order)
const value = lru.get(cache, 'a'); // 1

// Add more items - will evict least recently used
lru.set(cache, 'd', 4); // 'b' gets evicted

console.log(cache.has('b')); // false
console.log(cache.has('a')); // true
```

## API

### create

Creates a new LRU cache with the specified capacity.

```typescript
function create<K, V>(
  capacity: number,
  iterable?: Iterable<readonly [K, V]> | null
): LRUCache<K, V>
```

**Parameters:**
- `capacity` (number): Maximum number of items the cache can hold
- `iterable` (optional): Initial data to populate the cache

**Returns:** A new LRU cache instance

**Example:**
```typescript
// Create empty cache
const cache1 = lru.create<string, number>(10);

// Create cache with initial data
const cache2 = lru.create(5, [
  ['key1', 'value1'],
  ['key2', 'value2']
]);
```

### capacity

Returns the maximum capacity of the cache.

```typescript
function capacity(cache: LRUCache<any, any>): number
```

**Parameters:**
- `cache`: The LRU cache instance

**Returns:** The maximum capacity of the cache

**Example:**
```typescript
const cache = lru.create<string, number>(10);
console.log(lru.capacity(cache)); // 10
```

### set

Sets a key-value pair in the cache. If the cache exceeds capacity, the least recently used item will be evicted.

```typescript
function set<K, V>(cache: LRUCache<K, V>, key: K, value: V): void
```

**Parameters:**
- `cache`: The LRU cache instance
- `key`: The key to set
- `value`: The value to associate with the key

**Example:**
```typescript
const cache = lru.create<string, number>(3);
lru.set(cache, 'user:1', 100);
lru.set(cache, 'user:2', 200);
```

### get

Retrieves a value by key and marks it as recently used (updates LRU order).

```typescript
function get<K, V>(cache: LRUCache<K, V>, key: K): V | undefined
```

**Parameters:**
- `cache`: The LRU cache instance
- `key`: The key to retrieve

**Returns:** The value associated with the key, or `undefined` if not found

**Example:**
```typescript
const cache = lru.create<string, number>(3);
lru.set(cache, 'key', 42);
const value = lru.get(cache, 'key'); // 42
const missing = lru.get(cache, 'nonexistent'); // undefined
```

### peek

Retrieves a value by key without affecting the LRU order.

```typescript
function peek<K, V>(cache: LRUCache<K, V>, key: K): V | undefined
```

**Parameters:**
- `cache`: The LRU cache instance
- `key`: The key to peek at

**Returns:** The value associated with the key, or `undefined` if not found

**Example:**
```typescript
const cache = lru.create<string, number>(2);
lru.set(cache, 'a', 1);
lru.set(cache, 'b', 2);

// Peek doesn't affect order
lru.peek(cache, 'a'); // 1

// Adding a new item will still evict 'a' because peek didn't update order
lru.set(cache, 'c', 3);
console.log(cache.has('a')); // false
```

### Map Methods

The LRU cache supports all standard Map methods and properties for additional functionality:

- `cache.has(key)`: Check if a key exists
- `cache.delete(key)`: Remove a specific key
- `cache.clear()`: Remove all entries
- `cache.size`: Get current number of entries
- `cache.keys()`: Iterator over keys
- `cache.values()`: Iterator over values
- `cache.entries()`: Iterator over key-value pairs
- `cache.forEach(callback)`: Execute a function for each entry

**Example:**
```typescript
const cache = lru.create<string, number>(3);
lru.set(cache, 'a', 1);
lru.set(cache, 'b', 2);

console.log(cache.size); // 2
console.log(cache.has('a')); // true

// Iterate over entries
for (const [key, value] of cache.entries()) {
  console.log(`${key}: ${value}`);
}

// Clear all entries
cache.clear();
console.log(cache.size); // 0
```

## Examples

### Basic Usage

```typescript
import * as lru from 'map-as-lru';

const cache = lru.create<string, string>(3);

// Fill the cache
lru.set(cache, 'first', 'value1');
lru.set(cache, 'second', 'value2');
lru.set(cache, 'third', 'value3');

// Access an item to make it recently used
lru.get(cache, 'first');

// Add a fourth item - 'second' will be evicted (least recently used)
lru.set(cache, 'fourth', 'value4');

console.log(cache.has('second')); // false (evicted)
console.log(cache.has('first'));  // true (recently accessed)
```

### Using Different Key Types

```typescript
// String keys
const stringCache = lru.create<string, any>(5);
lru.set(stringCache, 'user:123', { name: 'John' });

// Number keys
const numberCache = lru.create<number, string>(5);
lru.set(numberCache, 123, 'user data');

// Object keys
const objectCache = lru.create<object, string>(5);
const keyObj = { id: 1 };
lru.set(objectCache, keyObj, 'some value');
```

### Cache with Initial Data

```typescript
const initialData: [string, number][] = [
  ['a', 1],
  ['b', 2],
  ['c', 3]
];

const cache = lru.create(5, initialData);
console.log(lru.get(cache, 'a')); // 1
```

### Peek vs Get

```typescript
const cache = lru.create<string, number>(2);
lru.set(cache, 'a', 1);
lru.set(cache, 'b', 2);

// Using peek - doesn't affect LRU order
lru.peek(cache, 'a'); // 1

// Using get - updates LRU order
lru.get(cache, 'a'); // 1 (now 'a' is most recently used)

lru.set(cache, 'c', 3);
// With peek: 'a' would be evicted
// With get: 'b' would be evicted
```

## Contributing

We welcome contributions to Map as LRU! If you have any ideas, suggestions, or bug reports, please open an issue on our [GitHub repository](https://github.com/wmzy/map-as-lru/issues).

To contribute code, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

Please ensure your code adheres to our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License.
