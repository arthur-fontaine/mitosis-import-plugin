import {createRoot} from 'react-dom/client';
import Component from './mitosis' with { mitosis: 'react' };

function App() {
  return (
    <Component />
  );
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
