import type { RuleDescriptor } from './types.ts';

const registry: RuleDescriptor[] = [];

let cachedProps: string[] | null = null;
let cachedParentProps: string[] | null = null;
let cachedInlineProps: string[] | null = null;

export function registerRule(rule: RuleDescriptor): void {
  registry.push(rule);
  cachedProps = null;
  cachedParentProps = null;
  cachedInlineProps = null;
}

export function getRules(): readonly RuleDescriptor[] {
  return registry;
}

export function getAllRequiredProperties(): string[] {
  return (cachedProps ??= [...new Set(registry.flatMap((r) => r.requiredProperties))]);
}

export function getAllRequiredParentProperties(): string[] {
  return (cachedParentProps ??= [
    ...new Set(registry.flatMap((r) => r.requiredParentProperties ?? [])),
  ]);
}

export function getAllRequiredInlineProperties(): string[] {
  return (cachedInlineProps ??= [
    ...new Set(registry.flatMap((r) => r.requiredInlineProperties ?? [])),
  ]);
}

export function getRuleLabel(id: string): string {
  return registry.find((r) => r.id === id)?.label ?? id;
}
