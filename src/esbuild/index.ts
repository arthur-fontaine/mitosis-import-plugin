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
        pluginData: { target },
      };

    });

    build.onLoad({ filter: /.*/, namespace: 'mitosis' }, async (args) => {

      const target = args.pluginData?.target;
      if (!target) throw new Error('Target not found in plugin data');

      const compiledComponent = await mitosisImportPluginCore.compileMitosisComponent(args.path, args.namespace, target);

      return {
        contents: compiledComponent,
        loader: 'tsx' as const, // TODO: can esbuild be compatible with vue?
      };

    })

  },

});
