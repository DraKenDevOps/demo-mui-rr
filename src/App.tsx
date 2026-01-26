import { RouterProvider } from "react-router";
import { CssBaseline } from "@mui/material";
import AppTheme from "./themes/AppTheme";
import {
  CustomDatePicker,
  CustomFormInput,
  CustomSidebar,
  CustomDataGrid,
} from "./themes/customs";
import NotificationProvider from "./hooks/useNotification/NotificationProvider";
import DialogProvider from "./hooks/useDialogs/DialogProvider";
import router from "./router";

const themeComponents = {
  ...CustomDatePicker,
  ...CustomSidebar,
  ...CustomFormInput,
  ...CustomDataGrid,
};
function App(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationProvider>
        <DialogProvider>
          <RouterProvider router={router} />
        </DialogProvider>
      </NotificationProvider>
    </AppTheme>
  );
}

export default App;
