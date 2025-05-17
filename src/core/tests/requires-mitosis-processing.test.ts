import { describe, expect, test } from 'vitest';
import { mitosisImportPluginCore } from '../mitosisImportPluginCore';

describe('requiresMitosisProcessing', () => {

  test('should return true if mitosis attribute is present', () => {
    const attributes = { mitosis: 'react' };
    const result = mitosisImportPluginCore.requiresMitosisProcessing(attributes);
    expect(result).toBe(true);
  });

  test('should return false if mitosis attribute is absent', () => {
    const attributes = {};
    const result = mitosisImportPluginCore.requiresMitosisProcessing(attributes);
    expect(result).toBe(false);
  });

});
