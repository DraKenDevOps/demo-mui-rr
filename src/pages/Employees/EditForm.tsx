import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Alert, Box, CircularProgress } from "@mui/material";

import { getOne as getEmployee, updateOne as updateEmployee, validate as validateEmployee, type Employee } from "../../services/mock";

import EmployeeForm, { type FormFieldValue, type EmployeeFormState } from "./Form";
import useNotification from "../../hooks/useNotification/useNotification";
import PageContainer from "../../components/PageContainer";

function EditForm({
    initialValues,
    onSubmit
}: {
    initialValues: Partial<EmployeeFormState["values"]>;
    onSubmit: (formValues: Partial<EmployeeFormState["values"]>) => Promise<void>;
}) {
    const { employeeId } = useParams();
    const navigate = useNavigate();

    const notifications = useNotification();

    const [formState, setFormState] = useState<EmployeeFormState>(() => ({
        values: initialValues,
        errors: {}
    }));
    const formValues = formState.values;
    const formErrors = formState.errors;

    const setFormValues = useCallback((newFormValues: Partial<EmployeeFormState["values"]>) => {
        setFormState((previousState) => ({
            ...previousState,
            values: newFormValues
        }));
    }, []);

    const setFormErrors = useCallback((newFormErrors: Partial<EmployeeFormState["errors"]>) => {
        setFormState((previousState) => ({
            ...previousState,
            errors: newFormErrors
        }));
    }, []);

    const handleFormFieldChange = useCallback(
        (name: keyof EmployeeFormState["values"], value: FormFieldValue) => {
            const validateField = async (values: Partial<EmployeeFormState["values"]>) => {
                const { issues } = validateEmployee(values);
                setFormErrors({
                    ...formErrors,
                    [name]: issues?.find((issue) => issue.path?.[0] === name)?.message
                });
            };

            const newFormValues = { ...formValues, [name]: value };

            setFormValues(newFormValues);
            validateField(newFormValues);
        },
        [formValues, formErrors, setFormErrors, setFormValues]
    );

    const handleFormReset = useCallback(() => {
        setFormValues(initialValues);
    }, [initialValues, setFormValues]);

    const handleFormSubmit = useCallback(async () => {
        const { issues } = validateEmployee(formValues);
        if (issues && issues.length > 0) {
            setFormErrors(Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])));
            return;
        }
        setFormErrors({});

        try {
            await onSubmit(formValues);
            notifications.show("Employee edited successfully.", {
                severity: "success",
                autoHideDuration: 3000
            });

            navigate("/employees");
        } catch (editError) {
            notifications.show(`Failed to edit employee. Reason: ${(editError as Error).message}`, {
                severity: "error",
                autoHideDuration: 3000
            });
            throw editError;
        }
    }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

    return (
        <EmployeeForm
            formState={formState}
            onFieldChange={handleFormFieldChange}
            onSubmit={handleFormSubmit}
            onReset={handleFormReset}
            submitButtonLabel="Save"
            backButtonPath={`/employees/${employeeId}`}
        />
    );
}

export default function EmployeeEdit() {
    const { employeeId } = useParams();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadData = useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const showData = await getEmployee(Number(employeeId));

            setEmployee(showData);
        } catch (showDataError) {
            setError(showDataError as Error);
        }
        setIsLoading(false);
    }, [employeeId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSubmit = useCallback(
        async (formValues: Partial<EmployeeFormState["values"]>) => {
            const updatedData = await updateEmployee(Number(employeeId), formValues);
            setEmployee(updatedData);
        },
        [employeeId]
    );

    const renderEdit = useMemo(() => {
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

        return employee ? <EditForm initialValues={employee} onSubmit={handleSubmit} /> : null;
    }, [isLoading, error, employee, handleSubmit]);

    return (
        <PageContainer
            title={`Edit Employee ${employeeId}`}
            breadcrumbs={[{ title: "Employees", path: "/employees" }, { title: `Employee ${employeeId}`, path: `/employees/${employeeId}` }, { title: "Edit" }]}
        >
            <Box sx={{ display: "flex", flex: 1 }}>{renderEdit}</Box>
        </PageContainer>
    );
}
