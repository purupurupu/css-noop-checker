import type { RuleDescriptor } from './types.ts';

const registry: RuleDescriptor[] = [];

export function registerRule(rule: RuleDescriptor): void {
  registry.push(rule);
}

export function getRules(): readonly RuleDescriptor[] {
  return registry;
}

export function getAllRequiredProperties(): string[] {
  return [...new Set(registry.flatMap((r) => r.requiredProperties))];
}

export function getRuleLabel(id: string): string {
  return registry.find((r) => r.id === id)?.label ?? id;
}
