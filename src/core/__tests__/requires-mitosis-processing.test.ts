import { describe, expect, test } from "vitest";
import { mitosisImportPluginCore } from "../mitosisImportPluginCore";

describe("requiresMitosisProcessing", () => {
	test("should return true if mitosis attribute is present", async () => {
		const attributes = { mitosis: "react" };
		const result =
			await mitosisImportPluginCore.requiresMitosisProcessing(attributes, () => Promise.resolve(""));
		expect(result).toBe(true);
	});

	test("should return false if mitosis attribute is absent", async () => {
		const attributes = {};
		const result =
			await mitosisImportPluginCore.requiresMitosisProcessing(attributes, () => Promise.resolve(""));
		expect(result).toBe(false);
	});

	test("should return true if @builder.io/mitosis import is present", async () => {
		const attributes = {};
		const sourceContent = `import { MyComponent } from '@builder.io/mitosis';`;
		const result = await mitosisImportPluginCore.requiresMitosisProcessing(
			attributes,
			() => Promise.resolve(sourceContent),
		);
		expect(result).toBe(true);
	});
});
