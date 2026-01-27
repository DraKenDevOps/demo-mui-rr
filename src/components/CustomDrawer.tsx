import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, Drawer, IconButton, Typography, Button, Divider } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon, Settings as SettingsIcon } from "@mui/icons-material";

const MuiDrawer = styled(Drawer)(({ theme }) => ({
    boxShadow: theme.shadows[16],
    zIndex: theme.zIndex.drawer + 10,
    borderLeft: "1px solid",
    borderColor: "divider"
}));

const CustomDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    // Requirement: Prevent closing on backdrop click
    // const handleOnClose = (_event: unknown, reason: "backdropClick" | "escapeKeyDown") => {
    //     if (reason === "backdropClick") return;
    //     console.log(reason)
    //     handleClose();
    // };

    return (
        <>
            <Button variant="contained" disableElevation onClick={handleOpen} startIcon={<MenuIcon />}>
                Open
            </Button>
            <MuiDrawer
                anchor="right"
                open={isOpen}
                onClose={handleClose}
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
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            bgcolor: "background.paper"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <SettingsIcon color="primary" />
                            <Typography variant="h6" fontWeight={700}>
                                System Configuration
                            </Typography>
                        </Box>
                        <IconButton onClick={handleClose} color="primary" size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Drawer Body */}
                    <Box sx={{ p: 4, flexGrow: 1, overflowY: "auto" }}>
                        
                    </Box>

                    {/* Drawer Actions */}
                    <Box
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
                    </Box>
                </Box>
            </MuiDrawer>
        </>
    );
};

export default CustomDrawer;
