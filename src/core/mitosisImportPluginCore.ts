import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";

import type { Target } from "./types/Target";
import path from "node:path";

const execAsync = promisify(exec);

class MitosisImportPluginCore {
	requiresMitosisProcessing(attributes: Record<string, string>): boolean {
		return attributes.mitosis !== undefined;
	}

	getMitosisTarget(attributes: Record<string, string>): Target {
		const target = attributes.mitosis || "auto";
		return target;
	}

	async compileMitosisComponent(
		componentSource: string,
		componentPath: string,
		target: Target,
	): Promise<string> {
		this.#throwIfTargetIsAuto(target);
		const mitosisPath = this.#getMitosisExecutablePath();

		const command = `echo ${JSON.stringify(componentSource)} | ${mitosisPath} compile -t ${target} --path ${componentPath}`;
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
		const mitosisCliPackagePath = require.resolve(
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

	#throwIfTargetIsAuto(target: Target): void {
		if (target === "auto") {
			throw new Error("Auto target is not yet supported");
		}
	}
}

export const mitosisImportPluginCore = new MitosisImportPluginCore();
