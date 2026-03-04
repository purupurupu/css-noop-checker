import { test, expect } from 'vitest';
import { DEFAULT_COMPUTED_STYLES } from './make-element.ts';

// Side-effect import to populate the registry (registers all rules)
import '../../engine.ts';

import { getAllRequiredProperties } from '../../registry.ts';

test('DEFAULT_COMPUTED_STYLES covers all required properties', () => {
  const required = getAllRequiredProperties();
  for (const prop of required) {
    expect(DEFAULT_COMPUTED_STYLES).toHaveProperty(prop);
  }
});

test('DEFAULT_COMPUTED_STYLES has no extra properties beyond what rules require', () => {
  const required = getAllRequiredProperties();
  for (const prop of Object.keys(DEFAULT_COMPUTED_STYLES)) {
    expect(required).toContain(prop);
  }
});
