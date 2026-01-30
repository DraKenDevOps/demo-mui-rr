import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { matchPath, useLocation } from "react-router";

import { useMediaQuery, Box, Drawer, List, Toolbar } from "@mui/material";
import {
    Person as PersonIcon,
    BarChart as BarChartIcon,
    Description as DescriptionIcon,
    Layers as LayersIcon,
    Home as HomeIcon,
    Download,
    Image as ImageIcon,
    Filter as FilterIcon,
    Settings
} from "@mui/icons-material";

import SidebarContext from "../context/SidebarContext";
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "../env";
import SidebarPageItem from "./SidebarPageItem";
import SidebarHeaderItem from "./SidebarHeaderItem";
import SidebarDividerItem from "./SidebarDividerItem";
import { getDrawerSxTransitionMixin, getDrawerWidthTransitionMixin } from "../mixins";

export interface SidebarProps {
    expanded?: boolean;
    setExpanded: (expanded: boolean) => void;
    disableCollapsibleSidebar?: boolean;
    layouRef?: Element;
}

const mainItems = [
    {
        id: "home",
        title: "Home",
        icon: <HomeIcon />,
        href: "/home",
        pattern: "/home/*"
    },
    {
        id: "images",
        title: "Images",
        icon: <ImageIcon />,
        href: "/images",
        pattern: "/images/*"
    },
    {
        id: "pictures",
        title: "Pictures",
        icon: <FilterIcon />,
        href: "/pictures",
        pattern: "/pictures/*"
    },
    {
        id: "download",
        title: "Download",
        icon: <Download />,
        href: "/download",
        pattern: "/download/*"
    },
    {
        id: "employees",
        title: "Employees",
        icon: <PersonIcon />,
        href: "/employees",
        pattern: "/employees/*"
    }
];

export default function Sidebar({ expanded = true, setExpanded, disableCollapsibleSidebar = false, layouRef }: SidebarProps) {
    const theme = useTheme();
    const { pathname } = useLocation();

    const [expandedItemIds, setExpandedItemIds] = useState<string[]>([]);

    const isOverSmViewport = useMediaQuery(theme.breakpoints.up("sm"));
    const isOverMdViewport = useMediaQuery(theme.breakpoints.up("md"));

    const [isFullyExpanded, setIsFullyExpanded] = useState(expanded);
    const [isFullyCollapsed, setIsFullyCollapsed] = useState(!expanded);

    useEffect(() => {
        if (expanded) {
            const drawerWidthTransitionTimeout = setTimeout(() => {
                setIsFullyExpanded(true);
            }, theme.transitions.duration.enteringScreen);
            return () => clearTimeout(drawerWidthTransitionTimeout);
        }
        setIsFullyExpanded(false);
        return () => {};
    }, [expanded, theme.transitions.duration.enteringScreen]);

    useEffect(() => {
        if (!expanded) {
            const drawerWidthTransitionTimeout = setTimeout(() => {
                setIsFullyCollapsed(true);
            }, theme.transitions.duration.leavingScreen);
            return () => clearTimeout(drawerWidthTransitionTimeout);
        }
        setIsFullyCollapsed(false);
        return () => {};
    }, [expanded, theme.transitions.duration.leavingScreen]);

    const mini = !disableCollapsibleSidebar && !expanded;

    const handleSetSidebarExpanded = useCallback(
        (newExpanded: boolean) => () => {
            setExpanded(newExpanded);
        },
        [setExpanded]
    );

    const handlePageItemClick = useCallback(
        (itemId: string, hasNestedNavigation: boolean) => {
            if (hasNestedNavigation && !mini) {
                setExpandedItemIds((previousValue) =>
                    previousValue.includes(itemId) ? previousValue.filter((previousValueItemId) => previousValueItemId !== itemId) : [...previousValue, itemId]
                );
            } else if (!isOverSmViewport && !hasNestedNavigation) {
                setExpanded(false);
            }
        },
        [mini, setExpanded, isOverSmViewport]
    );

    const hasDrawerTransitions = isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

    const getDrawerContent = useCallback(
        (viewport: "phone" | "tablet" | "desktop") => (
            <>
                <Toolbar />
                <Box
                    component="nav"
                    aria-label={`${viewport.charAt(0).toUpperCase()}${viewport.slice(1)}`}
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "auto",
                        scrollbarGutter: mini ? "stable" : "auto",
                        overflowX: "hidden",
                        pt: !mini ? 0 : 2,
                        ...(hasDrawerTransitions ? getDrawerSxTransitionMixin(isFullyExpanded, "padding") : {})
                    }}
                >
                    <List
                        dense
                        sx={{
                            padding: mini ? 0 : 0.5,
                            mb: 4,
                            width: mini ? MINI_DRAWER_WIDTH : "auto"
                        }}
                    >
                        <SidebarHeaderItem>Main items</SidebarHeaderItem>
                        {mainItems.map((item, index) => (
                            <SidebarPageItem
                                key={index}
                                id={item.id}
                                title={item.title}
                                icon={item.icon}
                                href={item.href}
                                selected={!!matchPath(item.pattern, pathname)}
                            />
                        ))}
                        <SidebarDividerItem />
                        <SidebarHeaderItem>Support items</SidebarHeaderItem>
                        <SidebarPageItem id="settings" title="Settings" icon={<Settings />} href="/settings" selected={!!matchPath("/settings", pathname)} />
                        <SidebarPageItem
                            id="reports"
                            title="Reports"
                            icon={<BarChartIcon />}
                            href="/reports"
                            selected={!!matchPath("/reports", pathname)}
                            defaultExpanded={!!matchPath("/reports", pathname)}
                            expanded={expandedItemIds.includes("reports")}
                            nestedNavigation={
                                <List
                                    dense
                                    sx={{
                                        padding: 0,
                                        my: 1,
                                        pl: mini ? 0 : 1,
                                        minWidth: 240
                                    }}
                                >
                                    <SidebarPageItem
                                        id="sales"
                                        title="Sales"
                                        icon={<DescriptionIcon />}
                                        href="/sales"
                                        selected={!!matchPath("/sales", pathname)}
                                    />
                                    <SidebarPageItem
                                        id="traffic"
                                        title="Traffic"
                                        icon={<DescriptionIcon />}
                                        href="/traffics"
                                        selected={!!matchPath("/traffics", pathname)}
                                    />
                                </List>
                            }
                        />
                        <SidebarPageItem
                            id="integrations"
                            title="Integrations"
                            icon={<LayersIcon />}
                            href="/integrations"
                            selected={!!matchPath("/integrations", pathname)}
                        />
                    </List>
                </Box>
            </>
        ),
        [mini, hasDrawerTransitions, isFullyExpanded, expandedItemIds, pathname]
    );

    const getDrawerSharedSx = useCallback(
        (isTemporary: boolean) => {
            const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;

            return {
                displayPrint: "none",
                width: drawerWidth,
                flexShrink: 0,
                ...getDrawerWidthTransitionMixin(expanded),
                ...(isTemporary ? { position: "absolute" } : {}),
                [`& .MuiDrawer-paper`]: {
                    position: "absolute",
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundImage: "none",
                    ...getDrawerWidthTransitionMixin(expanded)
                }
            };
        },
        [expanded, mini]
    );

    const sidebarContextValue = useMemo(() => {
        return {
            onPageItemClick: handlePageItemClick,
            mini,
            fullyExpanded: isFullyExpanded,
            fullyCollapsed: isFullyCollapsed,
            hasDrawerTransitions
        };
    }, [handlePageItemClick, mini, isFullyExpanded, isFullyCollapsed, hasDrawerTransitions]);

    return (
        <SidebarContext.Provider value={sidebarContextValue}>
            <Drawer
                container={layouRef}
                variant="permanent"
                open={expanded}
                onClose={handleSetSidebarExpanded(false)}
                ModalProps={{
                    keepMounted: true // Better open performance on mobile.
                }}
                sx={{
                    display: {
                        xs: "block",
                        sm: disableCollapsibleSidebar ? "block" : "none",
                        md: "none"
                    },
                    ...getDrawerSharedSx(true)
                }}
            >
                {getDrawerContent("phone")}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: {
                        xs: "none",
                        sm: disableCollapsibleSidebar ? "none" : "block",
                        md: "none"
                    },
                    ...getDrawerSharedSx(false)
                }}
            >
                {getDrawerContent("tablet")}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", md: "block" },
                    ...getDrawerSharedSx(false)
                }}
            >
                {getDrawerContent("desktop")}
            </Drawer>
        </SidebarContext.Provider>
    );
}
