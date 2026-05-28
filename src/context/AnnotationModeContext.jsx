import { createContext, useContext, useMemo, useState } from 'react';

const AnnotationModeContext = createContext(null);

export function AnnotationModeProvider({ children, defaultEnabled = false }) {
  const [enabled, setEnabled] = useState(defaultEnabled);

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      toggle: () => setEnabled((v) => !v),
    }),
    [enabled]
  );

  return (
    <AnnotationModeContext.Provider value={value}>{children}</AnnotationModeContext.Provider>
  );
}

export function useAnnotationMode() {
  const ctx = useContext(AnnotationModeContext);
  if (!ctx) {
    return { enabled: false, setEnabled: () => {}, toggle: () => {} };
  }
  return ctx;
}
