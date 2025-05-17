import fs from "node:fs";
import type { ImportKind, Plugin } from "esbuild";

import { mitosisImportPluginCore } from "../core/mitosisImportPluginCore";
import type { Target } from "@builder.io/mitosis";

interface MitosisImportPluginOptions {
	target?: Target;
	detectMitosisFilesWithSource?: boolean;
}

export const mitosisImportPlugin = (
	options: MitosisImportPluginOptions = {},
): Plugin => ({
	name: "mitosis-import",

	setup(build) {
		build.onResolve({ filter: /.*/ }, async (args) => {
			if (args.pluginData?.dontRunMitosisImportPlugin) return null;

			async function getSourceContent() {
				const { path: componentPath } = await build.resolve(args.path, {
					kind: args.kind,
					resolveDir: args.resolveDir,
					pluginData: { dontRunMitosisImportPlugin: true },
				});
				return fs.promises.readFile(componentPath, "utf8").catch(() => "");
			}

			if (
				!(await mitosisImportPluginCore.requiresMitosisProcessing(
					args.with,
					async () =>
						options.detectMitosisFilesWithSource ? getSourceContent() : "",
				))
			)
				return null;

			const target =
				options.target ?? mitosisImportPluginCore.getMitosisTarget(args.with);

			return {
				namespace: "mitosis",
				pluginData: {
					target,
					importKind: args.kind,
					resolveDir: args.resolveDir,
					importerPath: args.importer,
				},
				path: args.path,
				watchFiles: [args.path],
			};
		});

		build.onLoad({ filter: /.*/, namespace: "mitosis" }, async (args) => {
			const { target, importKind, resolveDir, importerPath } =
				args.pluginData as {
					target: Target;
					importKind: ImportKind;
					resolveDir: string;
					importerPath: string;
				};

			const { path: componentPath } = await build.resolve(args.path, {
				kind: importKind,
				resolveDir,
				pluginData: { dontRunMitosisImportPlugin: true },
			});
			const componentSource = await fs.promises.readFile(componentPath, "utf8");

			const importerSource = await fs.promises
				.readFile(importerPath, "utf8")
				.catch(() => "");

			const compiledComponent =
				await mitosisImportPluginCore.compileMitosisComponent(
					{ source: componentSource, path: componentPath },
					{ source: importerSource, path: importerPath },
					target,
				);

			return {
				contents: compiledComponent,
				loader: getLoaderFromTarget(target) as never,
				resolveDir,
				watchFiles: [componentPath],
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
