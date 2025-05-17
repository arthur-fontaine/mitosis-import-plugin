import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

class MitosisImportPluginCore {
  constructor() {}

  requiresMitosisProcessing(attributes: Dict<string>): boolean {
    return attributes['mitosis'] !== undefined; 
  }

  getMitosisTarget(attributes: Dict<string>): string {
    const target = attributes['mitosis'] || 'auto';

    if (target === 'auto') {
      throw new Error('Auto target is not yet supported');
    }

    return target;
  }

  async compileMitosisComponent(
    componentSource: string,
    componentPath: string,
    target: string,
  ): Promise<string> {
    const command = `mitosis compile -t ${target} < (echo ${JSON.stringify(componentSource)})`;
    try {
      const output = await execAsync(command, { encoding: 'utf-8' });
      if (output.stderr) throw new Error(output.stderr);
      return output.stdout;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Error compiling Mitosis component: ${message}`);
    }
  }
}

export const mitosisImportPluginCore = new MitosisImportPluginCore();
