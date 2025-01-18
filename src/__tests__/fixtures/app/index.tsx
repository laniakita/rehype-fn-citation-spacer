import * as ReactDOM from 'react-dom/client';
import App from './App';

// biome-ignore lint/style/noNonNullAssertion: It's in the docs...
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
