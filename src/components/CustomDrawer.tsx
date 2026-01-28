import { useState, type ReactNode } from "react";
import { styled } from "@mui/material/styles";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const MuiDrawer = styled(Drawer)(({ theme }) => ({
    boxShadow: theme.shadows[16],
    zIndex: theme.zIndex.drawer + 10,
    borderLeft: "1px solid",
    borderColor: "divider"
}));

type Props = {
    title?: string;
    titleIcon?: ReactNode;
    btnIcon?: ReactNode;
    children?: ReactNode;
};

const CustomDrawer = ({ title, titleIcon, btnIcon, children }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    // Requirement: Prevent closing on backdrop click
    const handleOnClose = (_event: unknown, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason === "backdropClick") return;
        console.log(reason);
        handleClose();
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
            return;
        }
        setIsOpen(open);
    };

    return (
        <>
            {/* <Button variant="contained" disableElevation onClick={handleOpen} startIcon={btnIcon}>
                Open
            </Button> */}
            <IconButton onClick={handleOpen} color="primary" size="small">
                {btnIcon}
            </IconButton>
            <MuiDrawer
                anchor="right"
                open={isOpen}
                variant="temporary"
                onClose={toggleDrawer(false)}
                hideBackdrop={true}
                slotProps={{
                    paper: {
                        sx: {
                            width: {
                                xs: "100%",
                                sm: "80%"
                            }
                        }
                    }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        overflow: "hidden"
                    }}
                >
                    {/* Drawer Header */}
                    <Box
                        sx={{
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            bgcolor: "background.paper"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            {titleIcon}
                            <Typography variant="h6" fontWeight={700}>
                                {title || "System Configuration"}
                            </Typography>
                        </Box>
                        <IconButton onClick={handleClose} color="primary" size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Drawer Body */}
                    <Box sx={{ p: 4, flexGrow: 1, overflowY: "auto", bgcolor: "background.default" }}>{children}</Box>

                    {/* Drawer Actions */}
                    {/* <Box
                        sx={{
                            p: 2,
                            borderTop: "1px solid",
                            borderColor: "divider",
                            display: "flex",
                            gap: 2,
                            bgcolor: "background.paper"
                        }}
                    >
                        <Button variant="contained" size="large" onClick={handleClose}>
                            Apply
                        </Button>
                        <Button variant="outlined" size="large" onClick={handleClose}>
                            Discard
                        </Button>
                    </Box> */}
                </Box>
            </MuiDrawer>
        </>
    );
};

export default CustomDrawer;
