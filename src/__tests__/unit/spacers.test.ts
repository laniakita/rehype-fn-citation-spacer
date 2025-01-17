import { expect, test } from 'bun:test';
import type { ElementContent } from 'hast';
import { supCommaSpacer } from '../../spacers';

test('supCommaSpacer satisfies ElementContent', () => {
  const testSpacer: ElementContent = supCommaSpacer;
  expect(testSpacer).not.toBe(undefined);
});
