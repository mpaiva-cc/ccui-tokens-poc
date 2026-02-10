/**
 * Circular Reference Detection Tests
 *
 * Validates that token references form a directed acyclic graph (DAG)
 * with no circular dependencies. Circular references would cause
 * infinite resolution loops in Style Dictionary or Tokens Studio.
 *
 * Scans source files (src/) rather than built output to catch issues early.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const SRC_DIR = join(__dirname, '../../src');

/**
 * Recursively find all .tokens.json files under a directory
 */
function findTokenFiles(dir: string): string[] {
  const files: string[] = [];
  if (!existsSync(dir)) return files;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTokenFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.tokens.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Reference pattern: {some.token.path}
 */
const REF_PATTERN = /\{([a-zA-Z][a-zA-Z0-9._-]*)\}/g;

/**
 * Extract all references from a token value (string or object)
 */
function extractReferences(value: unknown): string[] {
  const refs: string[] = [];

  if (typeof value === 'string') {
    let match;
    REF_PATTERN.lastIndex = 0;
    while ((match = REF_PATTERN.exec(value)) !== null) {
      refs.push(match[1]);
    }
  } else if (Array.isArray(value)) {
    for (const item of value) {
      refs.push(...extractReferences(item));
    }
  } else if (typeof value === 'object' && value !== null) {
    for (const val of Object.values(value)) {
      refs.push(...extractReferences(val));
    }
  }

  return refs;
}

interface TokenEntry {
  path: string;
  references: string[];
  file: string;
}

/**
 * Recursively collect all tokens and their references from a structure
 */
function collectTokenRefs(
  obj: Record<string, unknown>,
  path: string,
  file: string,
  results: TokenEntry[]
): void {
  for (const [key, value] of Object.entries(obj)) {
    // Skip metadata keys
    if (key.startsWith('$')) continue;

    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value === 'object' && value !== null && '$value' in value) {
      // This is a token
      const tokenValue = (value as Record<string, unknown>).$value;
      const refs = extractReferences(tokenValue);
      if (refs.length > 0) {
        results.push({ path: currentPath, references: refs, file });
      }
    } else if (typeof value === 'object' && value !== null) {
      // Nested group
      collectTokenRefs(value as Record<string, unknown>, currentPath, file, results);
    }
  }
}

/**
 * Detect circular references using DFS cycle detection
 * Returns an array of cycle descriptions if found
 */
function detectCycles(tokens: TokenEntry[]): string[] {
  // Build adjacency map: tokenPath -> [referenced paths]
  const graph = new Map<string, string[]>();
  for (const token of tokens) {
    graph.set(token.path, token.references);
  }

  const WHITE = 0; // unvisited
  const GRAY = 1;  // in current DFS path
  const BLACK = 2; // fully processed

  const color = new Map<string, number>();
  const parent = new Map<string, string>();
  const cycles: string[] = [];

  function dfs(node: string, path: string[]): void {
    color.set(node, GRAY);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      const neighborColor = color.get(neighbor) ?? WHITE;

      if (neighborColor === GRAY) {
        // Found a cycle - reconstruct it
        const cycleStart = path.indexOf(neighbor);
        const cycle = cycleStart >= 0
          ? [...path.slice(cycleStart), neighbor]
          : [node, neighbor];
        cycles.push(cycle.join(' -> '));
      } else if (neighborColor === WHITE && graph.has(neighbor)) {
        dfs(neighbor, [...path, neighbor]);
      }
    }

    color.set(node, BLACK);
  }

  for (const node of graph.keys()) {
    if ((color.get(node) ?? WHITE) === WHITE) {
      dfs(node, [node]);
    }
  }

  return cycles;
}

describe('Circular Reference Detection', () => {
  const allTokenFiles = findTokenFiles(SRC_DIR);

  it('should find source token files', () => {
    expect(allTokenFiles.length).toBeGreaterThan(0);
  });

  it('should have no circular token references', () => {
    const allTokenRefs: TokenEntry[] = [];

    for (const file of allTokenFiles) {
      const content = JSON.parse(readFileSync(file, 'utf-8'));
      collectTokenRefs(content, '', file, allTokenRefs);
    }

    const cycles = detectCycles(allTokenRefs);

    expect(
      cycles,
      `Circular references detected:\n${cycles.join('\n')}`
    ).toHaveLength(0);
  });

  it('should report reference graph statistics', () => {
    const allTokenRefs: TokenEntry[] = [];

    for (const file of allTokenFiles) {
      const content = JSON.parse(readFileSync(file, 'utf-8'));
      collectTokenRefs(content, '', file, allTokenRefs);
    }

    const totalRefs = allTokenRefs.reduce((sum, t) => sum + t.references.length, 0);
    const maxDepthToken = allTokenRefs.reduce((max, t) =>
      t.references.length > (max?.references.length ?? 0) ? t : max,
      allTokenRefs[0]
    );

    console.log(`Reference graph: ${allTokenRefs.length} tokens with references, ${totalRefs} total references`);
    if (maxDepthToken) {
      console.log(`  Most references: ${maxDepthToken.path} (${maxDepthToken.references.length} refs)`);
    }

    expect(true).toBe(true);
  });
});
