#!/usr/bin/env node

import * as esbuild from 'esbuild'
import liveServer from 'live-server';
import { createRequire } from 'node:module';
import { esbuildConfig } from './esbuild.config.ts';

if (!('require' in globalThis)) {
  globalThis.require = createRequire(import.meta.url);
}

async function compileJs() {
  const context = await esbuild.context(esbuildConfig);
  await context.watch();
}

async function startServer() {
  liveServer.start({
    port: 3000,
    open: false,
    wait: 1000,
  });
}

await compileJs()
await startServer()
