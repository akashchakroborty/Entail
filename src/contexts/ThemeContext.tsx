import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getTheme, type ThemeMode, ThemeModes } from "src/utils/themeUtils";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const savedMode = localStorage.getItem("theme-mode");
      return savedMode === ThemeModes.dark ? ThemeModes.dark : ThemeModes.light;
    } catch (e) {
      return ThemeModes.light;
    }
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode =
        prevMode === ThemeModes.light ? ThemeModes.dark : ThemeModes.light;
      localStorage.setItem("theme-mode", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const theme = getTheme(mode);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
