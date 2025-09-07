import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import type { Task } from "src/types";

interface DashboardContextType {
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: { type: string; message: string } | null;
  setError: (error: { type: string; message: string } | null) => void;
  clearError: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ type: string; message: string } | null>(
    null
  );

  const clearError = () => setError(null);

  const value: DashboardContextType = {
    selectedTask,
    setSelectedTask,
    loading,
    setLoading,
    error,
    setError,
    clearError,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
