import { describe, expect, test } from "vitest";
import { mitosisImportPluginCore } from "../mitosisImportPluginCore";

describe("getMitosisTarget", () => {
	test("should return the target if mitosis attribute is present", () => {
		const attributes = { mitosis: "react" };
		const result = mitosisImportPluginCore.getMitosisTarget(attributes, {
			source: "",
			path: "",
		});
		expect(result).toBe("react");
	});

	test("should detect the target from the import path", () => {
		const attributes = { mitosis: "" };
		const result = mitosisImportPluginCore.getMitosisTarget(attributes, {
			source: "",
			path: "example.vue",
		});
		expect(result).toBe("vue");
	});
});
