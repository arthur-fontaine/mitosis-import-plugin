import * as esbuild from 'esbuild';
import { esbuildConfig } from "./esbuild.config.ts";

await esbuild.build(esbuildConfig);
