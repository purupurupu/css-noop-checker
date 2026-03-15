import { describe, it, expect } from 'vitest';
import { checkPerspectiveNoOrigin } from '../perspective-no-origin.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('perspective-no-origin', () => {
  it('warns when perspective-origin is set inline without perspective', () => {
    const warnings = checkPerspectiveNoOrigin(
      createRuleContext(makeElement({}, null, { perspectiveOrigin: 'top left' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('perspective-no-origin');
    expect(warnings[0].property).toBe('perspective-origin');
    expect(warnings[0].details).toContain('top left');
  });

  it('warns when perspective-origin is "0px 0px" inline', () => {
    const warnings = checkPerspectiveNoOrigin(
      createRuleContext(makeElement({}, null, { perspectiveOrigin: '0px 0px' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns when perspective-origin is "center top" inline', () => {
    const warnings = checkPerspectiveNoOrigin(
      createRuleContext(makeElement({}, null, { perspectiveOrigin: 'center top' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('center top');
  });

  it('does not warn when perspective is active', () => {
    const warnings = checkPerspectiveNoOrigin(
      createRuleContext(
        makeElement({ perspective: '500px' }, null, { perspectiveOrigin: 'top left' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when will-change includes perspective', () => {
    const warnings = checkPerspectiveNoOrigin(
      createRuleContext(
        makeElement({ willChange: 'perspective' }, null, { perspectiveOrigin: 'top left' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when will-change includes perspective in a list', () => {
    const warnings = checkPerspectiveNoOrigin(
      createRuleContext(
        makeElement({ willChange: 'opacity, perspective' }, null, {
          perspectiveOrigin: 'top left',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns when will-change is perspective-origin (not perspective)', () => {
    const warnings = checkPerspectiveNoOrigin(
      createRuleContext(
        makeElement({ willChange: 'perspective-origin' }, null, {
          perspectiveOrigin: 'top left',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('does not warn when no inline perspective-origin is set', () => {
    const warnings = checkPerspectiveNoOrigin(createRuleContext(makeElement()));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when inline perspective-origin is empty string', () => {
    const warnings = checkPerspectiveNoOrigin(
      createRuleContext(makeElement({}, null, { perspectiveOrigin: '' })),
    );
    expect(warnings).toHaveLength(0);
  });
});
