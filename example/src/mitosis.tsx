import { useState } from "@builder.io/mitosis";

interface Props {
	name: string;
}

export default function MyComponent(props: Props) {
	const [name, setName] = useState(props.name);

	return (
		<div>
			<input
				style={{ color: "red" }}
				value={name}
				onChange={(event) => setName(event.target.value)}
			/>
			Hello {name}! I can run natively in React, Vue, Svelte, Qwik, and many
			more frameworks!
		</div>
	);
}
