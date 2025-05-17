import * as esbuild from 'esbuild'
import { esbuildConfig } from './esbuild.config.ts';

const PORT = 8000;

const context = await esbuild.context({
  ...esbuildConfig,
  banner: {
    js: `(() => { new EventSource('http://localhost:${PORT}/esbuild').addEventListener('change', () => location.reload()); })();`,
  },
});

await context.serve({ servedir: '.', port: PORT })

await context.watch()

console.log(`Server running at: http://localhost:${PORT}`)
