// This fixture comes from the example of the Mitosis homepage: https://mitosis.builder.io/

export const target = "svelte";

export const input = `
import { useState } from "@builder.io/mitosis";

export default function MyComponent(props) {
  const [name, setName] = useState("Steve");

  return (
    <div>
      <input
        css={{
          color: "red",
        }}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      Hello! I can run natively in React, Vue, Svelte, Qwik, and many more frameworks!
    </div>
  );
}`;

export const autoPath = "path/to/importer.svelte";
