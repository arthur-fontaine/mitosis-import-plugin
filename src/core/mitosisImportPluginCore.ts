import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";

import type { Target } from "./types/Target";
import path from "node:path";
import { createRequire } from "node:module";

const execAsync = promisify(exec);

class MitosisImportPluginCore {
	async requiresMitosisProcessing(
		attributes: Record<string, string>,
		getSourceContent: () => Promise<string>,
	): Promise<boolean> {
		if (attributes.mitosis !== undefined) return true;

		const sourceContent = await getSourceContent();
		if (/from ['"]@builder.io\/mitosis['"]/.test(sourceContent)) return true;

		return false;
	}

	getMitosisTarget(attributes: Record<string, string>): Target {
		const target = attributes.mitosis || "auto";
		return target;
	}

	async compileMitosisComponent(
		component: { source: string; path: string },
		importer: { source: string; path: string },
		target: Target,
	): Promise<string> {
		const realTarget = this.#getRealTarget(
			target,
			importer.path,
			importer.source,
		);
		const mitosisPath = this.#getMitosisExecutablePath();

		const command = `echo ${JSON.stringify(component.source)} | ${mitosisPath} compile -t ${realTarget} --path ${component.path} --state useState`;
		try {
			const output = await execAsync(command, { encoding: "utf-8" });
			if (output.stderr) throw new Error(output.stderr);
			return output.stdout;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			throw new Error(`Error compiling Mitosis component: ${message}`);
		}
	}

	#getMitosisExecutablePath(): string {
		const _require = globalThis.require || createRequire(import.meta.url);
		const mitosisCliPackagePath = _require.resolve(
			"@builder.io/mitosis-cli/package.json",
		);
		const mitosisCliPackage = JSON.parse(
			fs.readFileSync(mitosisCliPackagePath, "utf-8"),
		);

		const mitosisCliPath = path.join(
			path.dirname(mitosisCliPackagePath),
			mitosisCliPackage.bin.mitosis,
		);

		return mitosisCliPath;
	}

	#getRealTarget(
		target: Target,
		importerPath: string,
		importerSource: string,
	): Target {
		if (target === "auto") {
			return this.#inferTargetFromSource(importerSource, importerPath);
		}
		return target;
	}

	#inferTargetFromSource(importerSource: string, importerPath: string): Target {
		const ext = path.extname(importerPath);
		const lowerPath = importerPath.toLowerCase();

		if (ext === ".vue") return "vue";
		if (ext === ".svelte") return "svelte";
		if (ext === ".liquid") return "liquid";
		if (ext === ".html") return "html";
		if (ext === ".ts" || ext === ".tsx" || ext === ".js" || ext === ".jsx") {
			if (/from ['"]react-native['"]/.test(importerSource))
				return "reactNative";
			if (/from ['"]react['"]/.test(importerSource)) return "react";
			if (/from ['"]angular|@angular\//.test(importerSource)) return "angular";
			if (/from ['"]lit['"]/.test(importerSource)) return "lit";
			if (/from ['"]marko['"]/.test(importerSource)) return "marko";
			if (/from ['"]solid-js['"]/.test(importerSource)) return "solid";
			if (/from ['"]@stencil\/core['"]/.test(importerSource)) return "stencil";
			if (/from ['"]preact['"]/.test(importerSource)) return "preact";
			if (/from ['"]@builder.io\/qwik['"]/.test(importerSource)) return "qwik";
			if (/from ['"]@builder.io\/mitosis['"]/.test(importerSource))
				return "mitosis";
			if (/alpinejs|x-data=/.test(importerSource)) return "alpine";
		}
		if (ext === ".swift") return "swift";

		if (lowerPath.includes("react-native")) return "reactNative";

		throw new Error("Cannot guess target. Please specify a target.");
	}
}

export const mitosisImportPluginCore = new MitosisImportPluginCore();
