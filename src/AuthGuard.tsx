import { Outlet, Navigate } from "react-router"

export function extractJwt(token: string, key: "header" | "payload" | "signature") {
    const [header, payload, signature] = token.split(/\./);
    const jwtext = {
        header,
        payload,
        signature
    };
    return jwtext[key];
}

const AuthGuard = () => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
        return <Navigate to="/login" />;
    } else {
        try {
            const user = JSON.parse(atob(extractJwt(token, "payload")));
            if (!user) {
                return <Navigate to="/login" />;
            } else {
                const current = Math.floor(Date.now() / 1000);
                const diff = Number(user["exp"]) - current;
                if (diff <= 0) {
                    localStorage.removeItem("ACCESS_TOKEN");
                    return <Navigate to="/login" />;
                } else {
                    return <Outlet />;
                }
            }
        } catch (error) {
            console.error(error);
            return <Navigate to="/login" />;
        }
    }
}

export default AuthGuard