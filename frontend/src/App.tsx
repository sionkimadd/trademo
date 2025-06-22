import Router from './router';
import { ErrorProvider } from './contexts/ErrorContext';

function App() {
  return (
    <ErrorProvider>
      <Router />
    </ErrorProvider>
  );
}

export default App;
