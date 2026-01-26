import { createContext } from "react";

const SidebarContext = createContext<{
    onPageItemClick: (id: string, hasNestedNavigation: boolean) => void;
    mini: boolean;
    fullyExpanded: boolean;
    fullyCollapsed: boolean;
    hasDrawerTransitions: boolean;
} | null>(null);

export default SidebarContext;
