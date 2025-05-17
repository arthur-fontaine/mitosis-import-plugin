# Mitosis Import Plugin

Import your Mitosis components without the need to compile them manually.

## Installation

```bash
npm install --save-dev mitosis-import-plugin
```

## Usage

When you import a Mitosis component, add the `with { mitosis: 'react' }` import attribute to the import statement. This will tell the plugin to compile the Mitosis component on the fly.

```tsx
import AMitosisComponent from './path/to/a/mitosis/component.tsx' with { mitosis: 'react' };

const Component = () => {
  return (
    <div>
      <AMitosisComponent />
    </div>
  );
};
```

### Configuring your build tool

> For the plugin to work, the build tool must support import attributes. This is a new feature in JavaScript and is not yet supported by all build tools (they are making amazing work to support it). The plugin will support more build tools in the future.

#### Esbuild

```js
import { mitosisImportPlugin } from 'mitosis-import-plugin/esbuild';

export default {
  plugins: [
    // Add the plugin to your esbuild config
    mitosisImportPlugin(),

    // You can specify the Mitosis target to compile to
    mitosisImportPlugin({ target: 'react' }),

    // You can also enable the plugin to detect Mitosis components automatically
    // If you enable this option, you don't need to add the `with { mitosis: 'react' }` import attribute
    mitosisImportPlugin({ detectMitosisFilesWithSource: true }),
  ],
};
```
