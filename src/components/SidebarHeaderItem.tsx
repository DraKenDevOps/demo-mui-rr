import { useContext, type ReactNode } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import type {} from "@mui/material/themeCssVarsAugmentation";
import SidebarContext from "../context/SidebarContext";
import { DRAWER_WIDTH } from "../env";
import { getDrawerSxTransitionMixin } from "../mixins";

export interface SidebarHeaderItemProps {
  children?: ReactNode;
}

export default function SidebarHeaderItem({
  children,
}: SidebarHeaderItemProps) {
  const sidebarContext = useContext(SidebarContext);
  if (!sidebarContext) {
    throw new Error("Sidebar context was used without a provider.");
  }
  const {
    mini = false,
    fullyExpanded = true,
    hasDrawerTransitions,
  } = sidebarContext;

  return (
    <ListSubheader
      sx={{
        fontSize: 12,
        fontWeight: "600",
        height: mini ? 0 : 36,
        ...(hasDrawerTransitions
          ? getDrawerSxTransitionMixin(fullyExpanded, "height")
          : {}),
        px: 1.5,
        py: 0,
        minWidth: DRAWER_WIDTH,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        zIndex: 2,
      }}
    >
      {children}
    </ListSubheader>
  );
}
