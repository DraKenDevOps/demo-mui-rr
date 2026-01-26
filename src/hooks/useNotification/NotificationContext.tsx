import { createContext } from "react";
import type { ShowNotification, CloseNotification } from "./useNotification";

const NotificationContext = createContext<{
  show: ShowNotification;
  close: CloseNotification;
} | null>(null);

export default NotificationContext;
