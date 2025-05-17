import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { Target } from "./types/Target";

const execAsync = promisify(exec);

class MitosisImportPluginCore {
	requiresMitosisProcessing(attributes: Dict<string>): boolean {
		return attributes.mitosis !== undefined;
	}

	getMitosisTarget(attributes: Dict<string>): Target {
		const target = attributes.mitosis || "auto";
		return target;
	}

	async compileMitosisComponent(
		componentSource: string,
		componentPath: string,
		target: Target,
	): Promise<string> {
		this.#throwIfTargetIsAuto(target);

		const command = `echo ${JSON.stringify(componentSource)} | mitosis compile -t ${target} --path ${componentPath}`;
		try {
			const output = await execAsync(command, { encoding: "utf-8" });
			if (output.stderr) throw new Error(output.stderr);
			return output.stdout;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			throw new Error(`Error compiling Mitosis component: ${message}`);
		}
	}

	#throwIfTargetIsAuto(target: Target): void {
		if (target === "auto") {
			throw new Error("Auto target is not yet supported");
		}
	}
}

export const mitosisImportPluginCore = new MitosisImportPluginCore();
