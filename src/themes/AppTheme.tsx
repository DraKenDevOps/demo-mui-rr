import { ThemeProvider, createTheme } from "@mui/material/styles";
import { type ReactNode, useMemo } from "react";
import type { ThemeOptions } from "@mui/material/styles";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";
import { CustomInput, CustomDataDisplay, CustomFeedback, CustomNavigator, CustomSurface } from "./customs";

interface AppThemeProps {
    children: ReactNode;
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
    const { children, disableCustomTheme, themeComponents } = props;
    const theme = useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                  // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
                  cssVariables: {
                      colorSchemeSelector: "data-mui-color-scheme",
                      cssVarPrefix: "template"
                  },
                  colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
                  typography,
                  shadows,
                  shape,
                  components: {
                      ...CustomInput,
                      ...CustomDataDisplay,
                      ...CustomFeedback,
                      ...CustomNavigator,
                      ...CustomSurface,
                      ...themeComponents
                  }
              });
    }, [disableCustomTheme, themeComponents]);
    if (disableCustomTheme) return <>{children}</>;
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}
