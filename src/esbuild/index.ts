import fs from 'node:fs';
import type { Plugin } from 'esbuild';

import { mitosisImportPluginCore } from '../core/mitosisImportPluginCore';

export const mitosisImportPlugin = (): Plugin => ({

  name: 'mitosis-import',

  setup(build) {

    build.onResolve({ filter: /.*/ }, (args) => {

      if (!mitosisImportPluginCore.requiresMitosisProcessing(args.with)) return null;

      const target = mitosisImportPluginCore.getMitosisTarget(args.with);

      return {
        namespace: 'mitosis',
        pluginData: { target, kind: args.kind, resolveDir: args.resolveDir },
        path: args.path,
      };

    });

    build.onLoad({ filter: /.*/, namespace: 'mitosis' }, async (args) => {

      const { target, kind, resolveDir } = args.pluginData || {};

      const { path } = await build.resolve(args.path, { kind, resolveDir })
      const componentSource = await fs.promises.readFile(path, 'utf8')

      const compiledComponent = await mitosisImportPluginCore.compileMitosisComponent(componentSource, path, target);

      return {
        contents: compiledComponent,
        loader: 'tsx' as const, // TODO: can esbuild be compatible with vue?
      };

    })

  },

});
