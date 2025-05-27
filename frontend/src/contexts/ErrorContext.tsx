import { createContext, useState, useContext, ReactNode } from 'react';

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
  clearError: () => {},
});

export const useErrorContext = () => useContext(ErrorContext);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}; 