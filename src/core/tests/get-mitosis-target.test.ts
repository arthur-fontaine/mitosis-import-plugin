import { describe, expect, test } from 'vitest';
import { mitosisImportPluginCore } from '../mitosisImportPluginCore';

describe('getMitosisTarget', () => {

  test('should return the target if mitosis attribute is present', () => {
    const attributes = { mitosis: 'react' };
    const result = mitosisImportPluginCore.getMitosisTarget(attributes);
    expect(result).toBe('react');
  });

  test('should return "auto" if mitosis attribute is set to empty string', () => {
    const attributes = { mitosis: '' };
    const result = mitosisImportPluginCore.getMitosisTarget(attributes);
    expect(result).toBe('auto');
  });

});
