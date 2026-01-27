import { useCallback, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SiteMarkIcon from "../components/SiteMarkIcon";

export default function MainLayout() {
    const theme = useTheme();

    const [isDesktopNavigationExpanded, setIsDesktopNavigationExpanded] = useState(true);
    const [isMobileNavigationExpanded, setIsMobileNavigationExpanded] = useState(false);

    const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

    const isNavigationExpanded = isOverMdViewport ? isDesktopNavigationExpanded : isMobileNavigationExpanded;

    const setIsNavigationExpanded = useCallback(
        (newExpanded: boolean) => {
            if (isOverMdViewport) {
                setIsDesktopNavigationExpanded(newExpanded);
            } else {
                setIsMobileNavigationExpanded(newExpanded);
            }
        },
        [isOverMdViewport, setIsDesktopNavigationExpanded, setIsMobileNavigationExpanded]
    );

    const handleToggleHeaderMenu = useCallback(
        (isExpanded: boolean) => {
            setIsNavigationExpanded(isExpanded);
        },
        [setIsNavigationExpanded]
    );

    const layoutRef = useRef<HTMLDivElement>(null);

    return (
        <Box
            ref={layoutRef}
            sx={{
                position: "relative",
                display: "flex",
                overflow: "hidden"
            }}
        >
            <Header logo={<SiteMarkIcon />} title="" menuOpen={isNavigationExpanded} onToggleMenu={handleToggleHeaderMenu} />
            <Sidebar expanded={isNavigationExpanded} setExpanded={setIsNavigationExpanded} container={layoutRef?.current ?? undefined} />
            <Box component="main" height="100vh" width="100%">
                <Toolbar sx={{ displayPrint: "none" }} />
                <Box overflow="auto">
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
