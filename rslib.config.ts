import { defineConfig } from "@rslib/core";

export default defineConfig({
	lib: [
		{ format: "cjs", bundle: true, dts: { bundle: true } },
		{ format: "esm", bundle: true, dts: { bundle: true } },
	],
	source: {
		entry: {
			esbuild: "./src/esbuild/index.ts",
		},
		exclude: ["**/__tests__/**", "**/example/**", "**/examples/**", "example"],
	},
	output: {
		cleanDistPath: true,
	},
});
