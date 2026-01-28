import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

import useNotification from "../../hooks/useNotification/useNotification";
import { type Employee, createOne as createEmployee, validate as validateEmployee } from "../../services/mock";
import EmployeeForm, { type FormFieldValue, type EmployeeFormState } from "./Form";

const INITIAL_FORM_VALUES: Partial<EmployeeFormState["values"]> = {
    role: "Market",
    isFullTime: true
};

export default function EmployeeCreate() {
    const navigate = useNavigate();

    const notifications = useNotification();

    const [formState, setFormState] = useState<EmployeeFormState>(() => ({
        values: INITIAL_FORM_VALUES,
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
        setFormValues(INITIAL_FORM_VALUES);
    }, [setFormValues]);

    const handleFormSubmit = useCallback(async () => {
        const { issues } = validateEmployee(formValues);
        if (issues && issues.length > 0) {
            setFormErrors(Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])));
            return;
        }
        setFormErrors({});

        try {
            createEmployee(formValues as Omit<Employee, "id">);
            notifications.show("Employee created successfully.", {
                severity: "success",
                autoHideDuration: 3000
            });

            // navigate("/employees");
        } catch (createError) {
            notifications.show(`Failed to create employee. Reason: ${(createError as Error).message}`, {
                severity: "error",
                autoHideDuration: 3000
            });
            throw createError;
        }
    }, [formValues, navigate, notifications, setFormErrors]);

    return (
        <EmployeeForm
            formState={formState}
            onFieldChange={handleFormFieldChange}
            onSubmit={handleFormSubmit}
            onReset={handleFormReset}
            submitButtonLabel="Create"
        />
    );
}
