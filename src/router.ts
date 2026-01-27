import { createBrowserRouter, redirect } from "react-router";
import MainLayout from "./layouts/Main";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Download from "./pages/Download";
import Pictures from "./pages/Pictures";
import Images from "./pages/Images";
import Settings from "./pages/Settings";
import Sales from "./pages/Sales";
import Employees from "./pages/Employees/List";
import Traffics from "./pages/Traffics";
import Integrations from "./pages/Integrations";

export function extractJwt(token: string, key: "header" | "payload" | "signature") {
    const [header, payload, signature] = token.split(/\./);
    const jwtext = {
        header,
        payload,
        signature
    };
    return jwtext[key];
}

function authGuard() {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
        throw redirect("/login");
    } 
    // else {
    //     try {
    //         const user = JSON.parse(atob(extractJwt(token, "payload")));
    //         console.log(user)
    //         if (!user) {
    //             throw redirect("/login");
    //         } else {
    //             const current = Math.floor(Date.now() / 1000);
    //             const diff = Number(user["exp"]) - current;
    //             if (diff <= 0) {
    //                 localStorage.removeItem("ACCESS_TOKEN");
    //                 throw redirect("/login");
    //             }
    //         }
    //     } catch (err) {
    //         localStorage.removeItem("ACCESS_TOKEN");
    //         console.error(err);
    //         throw redirect("/login");
    //     }
    // }
    return null;
}

function guestGuard() {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) throw redirect("/home");
    return null;
}

const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        loader: authGuard,
        children: [
            {
                index: true,
                path: "/home",
                Component: Home
            },
            {
                path: "/images",
                Component: Images
            },
            {
                path: "/pictures",
                Component: Pictures
            },
            {
                path: "/download",
                Component: Download
            },
            {
                path: "/employees",
                Component: Employees
            },
            {
                path: "/settings",
                Component: Settings
            },
            {
                path: "/sales",
                Component: Sales
            },
            {
                path: "/traffics",
                Component: Traffics
            },
            {
                path: "/integrations",
                Component: Integrations
            },
            {
                path: "*",
                Component: Home
            }
        ]
    },
    {
        path: "/login",
        Component: Login,
        loader: guestGuard
    }
]);

export default router;
