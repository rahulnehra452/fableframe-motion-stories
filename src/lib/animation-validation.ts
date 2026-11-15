import { parse } from 'acorn';
// AST validation is defense in depth, NOT an execution sandbox.
const bannedNames = new Set(['window', 'document', 'globalThis', 'self', 'parent', 'top', 'fetch', 'XMLHttpRequest', 'WebSocket', 'Worker', 'importScripts', 'eval', 'Function', 'setTimeout', 'setInterval', 'requestAnimationFrame', 'navigator', 'location', 'localStorage', 'sessionStorage', 'process', 'require', 'crypto', 'Atomics', 'SharedArrayBuffer', 'performance', 'Date', 'Proxy', 'Reflect']);
const bannedMembers = new Set(['constructor', '__proto__', 'prototype', 'random']);
type Node = { type: string; [key: string]: unknown };
export function validateAnimation(source: string) {
  if (source.length > 80000) throw new Error('Animation exceeds code limit');
  const ast = parse(source, { ecmaVersion: 2022, sourceType: 'script' }) as unknown as Node;
  let nodes = 0, hasRender = false;
  const walk = (node: Node) => {
    if (++nodes > 16000) throw new Error('Animation exceeds complexity limit');
    if (['ImportDeclaration', 'ImportExpression', 'ExportNamedDeclaration', 'ExportDefaultDeclaration', 'AwaitExpression', 'WithStatement', 'ThisExpression', 'NewExpression', 'WhileStatement', 'DoWhileStatement'].includes(node.type)) throw new Error(`Forbidden construct: ${node.type}`);
    if (node.async || node.generator) throw new Error('Only synchronous functions are permitted');
    if (node.type === 'Identifier' && bannedNames.has(String(node.name))) throw new Error(`Forbidden identifier: ${String(node.name)}`);
    if (node.type === 'MemberExpression') {
      const property = node.property as Node;
      if (node.computed && property.type !== 'Literal') throw new Error('Dynamic member access is not permitted');
      const name = String(property.name ?? property.value);
      if (bannedMembers.has(name)) throw new Error(`Forbidden property: ${name}`);
    }
    if (node.type === 'FunctionDeclaration' && (node.id as Node | undefined)?.name === 'renderFrame') {
      const params = node.params as Node[];
      hasRender = params.map(p => p.name).join(',') === 'ctx,t,W,H';
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'start' || key === 'end') continue;
      if (Array.isArray(value)) value.forEach(item => { if (item && typeof item === 'object' && 'type' in item) walk(item as Node); });
      else if (value && typeof value === 'object' && 'type' in value) walk(value as Node);
    }
  };
  walk(ast);
  if (!hasRender) throw new Error('Expected renderFrame(ctx, t, W, H)');
  return { nodes, valid: true };
}