/// <reference types="vite/client" />

import { describe, expect, test } from 'vitest';
import { mitosisImportPluginCore } from '../mitosisImportPluginCore';

describe('compileMitosisComponent', async () => {

  for (const fixtureModulePath in import.meta.glob('./fixtures/*.ts')) {
    const fixtureModule = import.meta.glob('./fixtures/*.ts')[fixtureModulePath];
    const fixture = await fixtureModule() as { input: string; target: string };
    const { input, target } = fixture;

    test(`should return the compiled component for fixture: ${fixtureModulePath}`, async () => {
      const componentSource = input.trim();

      const result = await mitosisImportPluginCore.compileMitosisComponent(
        componentSource,
        'path/to/component.svelte',
        target,
      );

      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });
  }

});
