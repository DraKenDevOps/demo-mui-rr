import { useCallback, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Toolbar, Box } from "@mui/material";
import { Outlet } from "react-router";
import { useDrawerStore } from "../store";
import AppHeader from "../components/Header";
import Sidebar from "../components/Sidebar";
import SiteMarkIcon from "../components/SiteMarkIcon";

export default function MainLayout() {
    const theme = useTheme();
    const { setOpen } = useDrawerStore();
    const [isDesktopNavExpanded, setIsDesktopNavExpanded] = useState(true);
    const [isMobileNavExpanded, setIsMobileNavExpanded] = useState(false);

    const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

    const menuOpen = isOverMdViewport ? isDesktopNavExpanded : isMobileNavExpanded;

    const setIsNavExpanded = useCallback(
        (newExpanded: boolean) => {
            if (isOverMdViewport) {
                setIsDesktopNavExpanded(newExpanded);
            } else {
                setIsMobileNavExpanded(newExpanded);
            }
        },
        [isOverMdViewport, setIsDesktopNavExpanded, setIsMobileNavExpanded]
    );

    const onToggleMenu = useCallback(
        (isExpanded: boolean) => {
            setOpen(isExpanded);
            setIsNavExpanded(isExpanded);
        },
        [setIsNavExpanded]
    );

    const layoutRef = useRef<HTMLDivElement>(null);

    return (
        // <Box
        //     sx={{
        //         position: "relative",
        //         display: "flex",
        //         overflow: "hidden"
        //     }}
        // >
        //     <AppHeader logo={<SiteMarkIcon />} title="" menuOpen={menuOpen} onToggleMenu={onToggleMenu} />
        //     <Sidebar expanded={menuOpen} setExpanded={setIsNavExpanded} layouRef={layoutRef?.current ?? undefined} />
        //     <Box component="main" height="100vh" overflow="auto" flexGrow={1}>
        //         <Toolbar />
        //         <Outlet />
        //     </Box>
        // </Box>
        <Box
            ref={layoutRef}
            sx={{
                position: "relative",
                display: "flex",
                overflow: "hidden",
                height: "100%",
                width: "100%"
            }}
        >
            {/* <AppHeader logo={<SiteMarkIcon />} title="" menuOpen={isNavigationExpanded} onToggleMenu={handleToggleHeaderMenu} /> */}
            <AppHeader logo={<SiteMarkIcon />} title="" menuOpen={menuOpen} onToggleMenu={onToggleMenu} />
            {/* <Sidebar expanded={isNavigationExpanded} setExpanded={setIsNavigationExpanded} container={layoutRef?.current ?? undefined} /> */}
            <Sidebar expanded={menuOpen} setExpanded={setIsNavExpanded} layouRef={layoutRef?.current ?? undefined} />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minWidth: 0
                }}
            >
                <Toolbar sx={{ displayPrint: "none" }} />
                <Box
                    component="main"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        overflow: "auto"
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
