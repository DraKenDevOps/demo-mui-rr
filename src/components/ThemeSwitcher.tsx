import { useCallback } from "react";
import { useTheme, useColorScheme } from "@mui/material/styles";
import { useMediaQuery, IconButton, Tooltip } from "@mui/material";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";

export default function ThemeSwitcher() {
  const theme = useTheme();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const preferredMode = prefersDarkMode ? "dark" : "light";

  const { mode, setMode } = useColorScheme();

  const paletteMode = !mode || mode === "system" ? preferredMode : mode;

  const toggleMode = useCallback(() => {
    setMode(paletteMode === "dark" ? "light" : "dark");
  }, [setMode, paletteMode]);

  return (
    <Tooltip
      title={`${paletteMode === "dark" ? "Light" : "Dark"} mode`}
      enterDelay={1000}
    >
        <IconButton
          size="small"
          aria-label={`Switch to ${paletteMode === "dark" ? "light" : "dark"} mode`}
          onClick={toggleMode}
        >
          {theme.getColorSchemeSelector ? (
            <>
              <LightModeIcon
                sx={{
                  display: "inline",
                  [theme.getColorSchemeSelector("dark")]: {
                    display: "none",
                  },
                }}
              />
              <DarkModeIcon
                sx={{
                  display: "none",
                  [theme.getColorSchemeSelector("dark")]: {
                    display: "inline",
                  },
                }}
              />
            </>
          ) : null}
        </IconButton>
    </Tooltip>
  );
}
