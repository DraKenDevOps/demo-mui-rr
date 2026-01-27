import { useCallback, useEffect, useMemo, useState } from "react";

import { Alert, Box, Button, CircularProgress, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import { useDialog } from "../../hooks/useDialog/useDialog";
import useNotification from "../../hooks/useNotification/useNotification";
import { deleteOne as deleteEmployee, getOne as getEmployee, type Employee } from "../../services/mock";
import PageContainer from "../../components/PageContainer";

export default function EmployeeShow() {
    const { employeeId } = useParams();
    const navigate = useNavigate();

    const dialogs = useDialog();
    const notifications = useNotification();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(() => {
        setError(null);
        setIsLoading(true);

        try {
            const showData = getEmployee(Number(employeeId));
            setEmployee(showData);
        } catch (showDataError) {
            setError(showDataError as Error);
        }
        setIsLoading(false);
    }, [employeeId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleEmployeeEdit = useCallback(() => {
        navigate(`/employees/${employeeId}/edit`);
    }, [navigate, employeeId]);

    const handleEmployeeDelete = useCallback(async () => {
        if (!employee) {
            return;
        }

        const confirmed = await dialogs.confirm(`Do you wish to delete ${employee.name}?`, {
            title: `Delete employee?`,
            severity: "error",
            okText: "Delete",
            cancelText: "Cancel"
        });

        if (confirmed) {
            setIsLoading(true);
            try {
                deleteEmployee(Number(employeeId));

                navigate("/employees");

                notifications.show("Employee deleted successfully.", {
                    severity: "success",
                    autoHideDuration: 3000
                });
            } catch (deleteError) {
                notifications.show(`Failed to delete employee. Reason:' ${(deleteError as Error).message}`, {
                    severity: "error",
                    autoHideDuration: 3000
                });
            }
            setIsLoading(false);
        }
    }, [employee, dialogs, employeeId, navigate, notifications]);

    const handleBack = useCallback(() => {
        navigate("/employees");
    }, [navigate]);

    const renderShow = useMemo(() => {
        if (isLoading) {
            return (
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        m: 1
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        }
        if (error) {
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <Alert severity="error">{error.message}</Alert>
                </Box>
            );
        }

        return employee ? (
            <Box sx={{ flexGrow: 1, width: "100%" }}>
                <Grid container spacing={2} sx={{ width: "100%" }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Name</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {employee.name}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Age</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {employee.age}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Join date</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {dayjs(employee.joinDate).format("MMMM D, YYYY")}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Department</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {employee.role}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Full-time</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {employee.isFullTime ? "Yes" : "No"}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                        Back
                    </Button>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" startIcon={<EditIcon />} onClick={handleEmployeeEdit}>
                            Edit
                        </Button>
                        <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleEmployeeDelete}>
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        ) : null;
    }, [isLoading, error, employee, handleBack, handleEmployeeEdit, handleEmployeeDelete]);

    const pageTitle = `Employee ${employeeId}`;

    return (
        <PageContainer title={pageTitle} breadcrumbs={[{ title: "Employees", path: "/employees" }, { title: pageTitle }]}>
            <Box sx={{ display: "flex", flex: 1, width: "100%" }}>{renderShow}</Box>
        </PageContainer>
    );
}
