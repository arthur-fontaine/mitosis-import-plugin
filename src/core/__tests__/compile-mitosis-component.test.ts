/// <reference types="vite/client" />

import { describe, expect, test } from "vitest";
import { mitosisImportPluginCore } from "../mitosisImportPluginCore";

describe("compileMitosisComponent", async () => {
	for (const fixtureModulePath in import.meta.glob("./fixtures/*.ts")) {
		const fixtureModule = import.meta.glob("./fixtures/*.ts")[
			fixtureModulePath
		];
		const fixture = (await fixtureModule()) as {
			input: string;
			target: string;
			autoPath?: string;
		};
		const { input, target } = fixture;

		test(`should return the compiled component for fixture: ${fixtureModulePath}`, async () => {
			const componentSource = input.trim();

			const result = await mitosisImportPluginCore.compileMitosisComponent(
				{ source: componentSource, path: "path/to/component.ts" },
				{ source: "", path: "" },
				target,
			);

			expect(result).toBeDefined();
			expect(result).toMatchSnapshot();
		});

		if (fixture.autoPath) {
			test(`should return the component compiled to the guessed target for fixture: ${fixtureModulePath}`, async () => {
				const componentSource = input.trim();

				const result = await mitosisImportPluginCore.compileMitosisComponent(
					{ source: componentSource, path: "path/to/component.ts" },
					// biome-ignore lint/style/noNonNullAssertion: we checked that autoPath is defined above
					{ source: "", path: fixture.autoPath! },
					"auto",
				);

				expect(result).toBeDefined();
				expect(result).toMatchSnapshot();
			});
		}
	}
});
