import { useCallback, type ReactNode } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Box, AppBar, IconButton, Toolbar, Tooltip, Typography, Stack } from "@mui/material";
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon } from "@mui/icons-material";
import { Link } from "react-router";
import ThemeSwitcher from "./ThemeSwitcher";
import Logout from "./Logout";
// import { DRAWER_WIDTH } from "../env";

const MuiAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== "open"
})(({ theme }) => ({
    // width: `calc(100% - ${DRAWER_WIDTH}px)`,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: (theme.vars ?? theme).palette.divider,
    boxShadow: "none",
    zIndex: theme.zIndex.drawer + 1,
    position: "fixed",
    color: "inherit",
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    })
}));

const LogoContainer = styled("div")({
    position: "relative",
    height: 40,
    display: "flex",
    alignItems: "center",
    "& img": {
        maxHeight: 40
    }
});

export interface HeaderProps {
    logo?: ReactNode;
    title?: string;
    menuOpen: boolean;
    onToggleMenu: (open: boolean) => void;
}

export default function AppHeader({ logo, title, menuOpen, onToggleMenu }: HeaderProps) {
    const theme = useTheme();
    const handleMenuOpen = useCallback(() => onToggleMenu(!menuOpen), [menuOpen, onToggleMenu]);

    const getMenuIcon = useCallback(
        (isExpanded: boolean) => {
            const expandText = "Expand";
            const collapseText = "Collapse";

            return (
                <Tooltip title={`${isExpanded ? collapseText : expandText} menu`} enterDelay={1000}>
                    <IconButton size="small" aria-label={`${isExpanded ? collapseText : expandText} navigation menu`} onClick={handleMenuOpen}>
                        {isExpanded ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                </Tooltip>
            );
        },
        [handleMenuOpen]
    );

    return (
        <MuiAppBar>
            <Toolbar sx={{ backgroundColor: "inherit", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <Box sx={{ mr: 3 }}>{getMenuIcon(menuOpen)}</Box>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <Stack direction="row" alignItems="center">
                        {logo ? <LogoContainer>{logo}</LogoContainer> : null}
                        {title ? (
                            <Typography
                                variant="h6"
                                sx={{
                                    color: (theme.vars ?? theme).palette.primary.main,
                                    fontWeight: "700",
                                    ml: 1,
                                    whiteSpace: "nowrap",
                                    lineHeight: 1
                                }}
                            >
                                {title}
                            </Typography>
                        ) : null}
                    </Stack>
                </Link>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ marginLeft: "auto" }}>
                    <ThemeSwitcher />
                    <Logout />
                </Stack>
            </Toolbar>
        </MuiAppBar>
    );
}
