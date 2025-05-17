import fs from "node:fs";
import type { Plugin } from "esbuild";

import { mitosisImportPluginCore } from "../core/mitosisImportPluginCore";
import type { Target } from "@builder.io/mitosis";

export const mitosisImportPlugin = (): Plugin => ({
	name: "mitosis-import",

	setup(build) {
		build.onResolve({ filter: /.*/ }, (args) => {
			if (!mitosisImportPluginCore.requiresMitosisProcessing(args.with))
				return null;

			const target = mitosisImportPluginCore.getMitosisTarget(args.with);

			return {
				namespace: "mitosis",
				pluginData: { target, kind: args.kind, resolveDir: args.resolveDir },
				path: args.path,
				watchFiles: [args.path],
			};
		});

		build.onLoad({ filter: /.*/, namespace: "mitosis" }, async (args) => {
			const { target, kind, resolveDir } = args.pluginData || {};

			const { path } = await build.resolve(args.path, { kind, resolveDir });
			const componentSource = await fs.promises.readFile(path, "utf8");

			const compiledComponent =
				await mitosisImportPluginCore.compileMitosisComponent(
					componentSource,
					path,
					target,
				);

			return {
				contents: compiledComponent,
				loader: getLoaderFromTarget(target) as never,
				resolveDir,
				watchFiles: [path],
			};
		});
	},
});

function getLoaderFromTarget(target: Target) {
	switch (target) {
		case "lit":
		case "mitosis":
		case "preact":
		case "qwik":
		case "react":
		case "reactNative":
		case "rsc":
		case "solid":
		case "stencil":
			return "tsx";
		default:
			return target;
	}
}
