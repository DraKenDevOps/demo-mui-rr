import { createBrowserRouter } from "react-router";
import MainLayout from "./layouts/Main";
import Home from "./pages/Home";
import Login from "./pages/Login";

// const userContext = createContext<User>();
// async function authMiddleware ({ context }) {
//   const token = localStorage.getItem("ACCESS_TOKEN");

//   if (!token) {
//     throw redirect("/login");
//   }

//   context.set(userContext, await getUserById(userId));
// };

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        path: "/home",
        Component: Home,
      },
      {
        path: "*",
        Component: Home,
      },
    ],
  },
  {
    path: "/login",
    Component: Login
  }
]);

export default router;
