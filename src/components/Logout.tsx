import { useNavigate } from "react-router";
import { IconButton, Tooltip } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";

export default function Logout() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("USER");
        navigate("/login", { replace: true });
        // window.location.href = "/login";
    };

    return (
        <Tooltip title="Logout" enterDelay={1000}>
            <IconButton size="small" onClick={handleLogout}>
                <LogoutIcon
                    sx={{
                        display: "inline",
                        color: "#d33333"
                    }}
                />
            </IconButton>
        </Tooltip>
    );
}
