import { createContext } from "react";
import type { OpenDialog, CloseDialog } from "./useDialog";

const DialogContext = createContext<{
    open: OpenDialog;
    close: CloseDialog;
} | null>(null);

export default DialogContext;
