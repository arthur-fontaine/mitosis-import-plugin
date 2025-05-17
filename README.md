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

### Automatic target detection

The plugin can also detect the target automatically. You can use `with { mitosis: '' }`, `with { mitosis: 'auto' }` or just do not add the attribute at all and set the `detectMitosisFilesWithSource` option to `true` in the plugin configuration.

```tsx
import AMitosisComponent from './path/to/a/mitosis/component.tsx' with { mitosis: 'auto' };
// or
import AMitosisComponent from './path/to/a/mitosis/component.tsx' with { mitosis: '' };
// or
import AMitosisComponent from './path/to/a/mitosis/component.tsx';
```

The detection will be done based on the file extension or source code of the importer. For example, if you are importing a Mitosis component from a `.jsx` file where the source code has a React import, the plugin will detect that the target is React. If you are importing a Mitosis component from a `.vue` file, the plugin will detect that the target is Vue.

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
