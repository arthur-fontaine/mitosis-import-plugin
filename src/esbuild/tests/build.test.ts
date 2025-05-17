import esbuild from "esbuild";
import { mitosisImportPlugin } from "..";
import { describe, expect, test } from "vitest";

describe("esbuild build", () => {
	test("should build with mitosis import plugin", async () => {
		const result = await esbuild.build({
			stdin: {
				contents: `
          import MyComponent from "./component" with { mitosis: "react" };
          export const comp = () => <MyComponent />;
        `,
				loader: "jsx",
				resolveDir: __dirname,
			},
			write: false,
			plugins: [mitosisImportPlugin()],
			bundle: true,
			external: ["react"],
			format: "esm",
		});

		const [outputFile] = result.outputFiles;

		expect(outputFile.text).toBeTruthy();
		expect(outputFile.text).not.toContain('with { mitosis: "react" }');
		expect(outputFile.text).toMatchSnapshot();
	});
});
