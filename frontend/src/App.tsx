import React from "react";
import "./App.css";

import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App: React.FC = () => {

  // iOS keyboard fix
  React.useEffect(() => {
    const handleResize = () => {
      if (document.activeElement?.tagName === 'INPUT') {
        window.setTimeout(() => {
          document.activeElement?.scrollIntoView({ block: 'center' });
        }, 0);
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;
