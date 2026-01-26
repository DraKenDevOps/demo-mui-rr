import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Alert from "@mui/material/Alert";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";
import type { CloseReason } from "@mui/material/SpeedDial";
import CloseIcon from "@mui/icons-material/Close";
import useSlotProps from "@mui/utils/useSlotProps";

import NotificationContext from "./NotificationContext";
import type {
  CloseNotification,
  ShowNotification,
  ShowNotificationOptions,
} from "./useNotification";

const RootPropsContext = createContext<NotificationOptions | null>(null);

interface NotificationProps {
  notificationKey: string;
  badge: string | null;
  open: boolean;
  message: ReactNode;
  options: ShowNotificationOptions;
}

function Notification({
  notificationKey,
  open,
  message,
  options,
  badge,
}: NotificationProps) {
  const notiContext = useContext(NotificationContext);
  if (!notiContext) {
    throw new Error("Notifications context was used without a provider.");
  }
  const { close } = notiContext;

  const { severity, actionText, onAction, autoHideDuration } = options;

  const handleClose = useCallback(
    (_event: unknown, reason?: CloseReason | SnackbarCloseReason) => {
      if (reason === "clickaway") {
        return;
      }
      close(notificationKey);
    },
    [notificationKey, close],
  );

  const action = (
    <>
      {onAction ? (
        <Button color="inherit" size="small" onClick={onAction}>
          {actionText ?? "Action"}
        </Button>
      ) : null}
      <IconButton
        size="small"
        aria-label="Close"
        title="Close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const props = useContext(RootPropsContext);
  const snackbarSlotProps = useSlotProps({
    elementType: Snackbar,
    ownerState: props,
    externalSlotProps: {},
    additionalProps: {
      open,
      autoHideDuration,
      onClose: handleClose,
      action,
    },
  });

  return (
    <Snackbar key={notificationKey} {...snackbarSlotProps}>
      <Badge badgeContent={badge} color="primary" sx={{ width: "100%" }}>
        {severity ? (
          <Alert severity={severity} sx={{ width: "100%" }} action={action}>
            {message}
          </Alert>
        ) : (
          <SnackbarContent message={message} action={action} />
        )}
      </Badge>
    </Snackbar>
  );
}

interface NotificationQueueEntry {
  notificationKey: string;
  options: ShowNotificationOptions;
  open: boolean;
  message: React.ReactNode;
}

interface NotificationsState {
  queue: NotificationQueueEntry[];
}

interface NotificationsProps {
  state: NotificationsState;
}

function Notifications({ state }: NotificationsProps) {
  const currentNotification = state.queue[0] ?? null;

  return currentNotification ? (
    <Notification
      {...currentNotification}
      badge={state.queue.length > 1 ? String(state.queue.length) : null}
    />
  ) : null;
}

export interface NotificationProviderProps {
  children?: ReactNode;
}

let nextId = 0;
const generateId = () => {
  const id = nextId;
  nextId += 1;
  return id;
};

export default function NotificationProvider(props: NotificationProviderProps) {
  const { children } = props;
  const [state, setState] = useState<NotificationsState>({ queue: [] });
  const show = useCallback<ShowNotification>((message, options = {}) => {
    const notificationKey =
      options.key ?? `::toolpad-internal::notification::${generateId()}`;
    setState((prev) => {
      if (prev.queue.some((n) => n.notificationKey === notificationKey))
        return prev;

      return {
        ...prev,
        queue: [
          ...prev.queue,
          { message, options, notificationKey, open: true },
        ],
      };
    });
    return notificationKey;
  }, []);

  const close = useCallback<CloseNotification>((key) => {
    setState((prev) => ({
      ...prev,
      queue: prev.queue.filter((n) => n.notificationKey !== key),
    }));
  }, []);

  const contextValue = useMemo(() => ({ show, close }), [show, close]);

  return (
    // @ts-ignore
    <RootPropsContext.Provider value={props}>
      <NotificationContext.Provider value={contextValue}>
        {children}
        <Notifications state={state} />
      </NotificationContext.Provider>
    </RootPropsContext.Provider>
  );
}
