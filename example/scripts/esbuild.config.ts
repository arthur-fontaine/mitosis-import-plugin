import type * as esbuild from "esbuild";
import { mitosisImportPlugin } from "mitosis-import-plugin/esbuild";

export const esbuildConfig: esbuild.BuildOptions = {
	entryPoints: ["src/index.tsx"],
	bundle: true,
	outfile: "dist/index.js",
	plugins: [
		mitosisImportPlugin({
			detectMitosisFilesWithSource: true,
		}),
	],
	jsx: "automatic",
	jsxDev: true,
};
