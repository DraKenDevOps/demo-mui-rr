import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { useNavigate } from 'react-router';
import dayjs from "dayjs";

import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, InputLabel, MenuItem, Stack, TextField } from "@mui/material";
import Select, { type SelectChangeEvent, type SelectProps } from "@mui/material/Select";
import type { Employee } from "../../services/mock";

export interface EmployeeFormState {
    values: Partial<Omit<Employee, "id">>;
    errors: Partial<Record<keyof EmployeeFormState["values"], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface EmployeeFormProps {
    formState: EmployeeFormState;
    onFieldChange: (name: keyof EmployeeFormState["values"], value: FormFieldValue) => void;
    onSubmit: (formValues: Partial<EmployeeFormState["values"]>) => Promise<void>;
    onReset?: (formValues: Partial<EmployeeFormState["values"]>) => void;
    submitButtonLabel: string;
    backButtonPath?: string;
}

export default function EmployeeForm(props: EmployeeFormProps) {
    // const { formState, onFieldChange, onSubmit, onReset, submitButtonLabel, backButtonPath } = props;
    const { formState, onFieldChange, onSubmit, onReset, submitButtonLabel } = props;

    const formValues = formState.values;
    const formErrors = formState.errors;

    // const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            setIsSubmitting(true);
            try {
                await onSubmit(formValues);
            } finally {
                setIsSubmitting(false);
            }
        },
        [formValues, onSubmit]
    );

    const handleTextFieldChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onFieldChange(event.target.name as keyof EmployeeFormState["values"], event.target.value);
        },
        [onFieldChange]
    );

    const handleNumberFieldChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onFieldChange(event.target.name as keyof EmployeeFormState["values"], Number(event.target.value));
        },
        [onFieldChange]
    );

    const handleCheckboxFieldChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
            onFieldChange(event.target.name as keyof EmployeeFormState["values"], checked);
        },
        [onFieldChange]
    );

    const handleDateFieldChange = useCallback(
        (fieldName: keyof EmployeeFormState["values"]) => (value: dayjs.Dayjs | null) => {
            if (value?.isValid()) {
                onFieldChange(fieldName, value.toISOString() ?? null);
            } else if (formValues[fieldName]) {
                onFieldChange(fieldName, null);
            }
        },
        [formValues, onFieldChange]
    );

    const handleSelectFieldChange = useCallback(
        (event: SelectChangeEvent) => {
            onFieldChange(event.target.name as keyof EmployeeFormState["values"], event.target.value);
        },
        [onFieldChange]
    );

    const handleReset = useCallback(() => {
        if (onReset) {
            onReset(formValues);
        }
    }, [formValues, onReset]);

    // const handleBack = useCallback(() => {
    //     navigate(backButtonPath ?? "/employees");
    // }, [navigate, backButtonPath]);

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" onReset={handleReset} sx={{ width: "100%" }}>
            <FormGroup>
                <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
                        <TextField
                            value={formValues.name ?? ""}
                            onChange={handleTextFieldChange}
                            name="name"
                            label="Name"
                            error={!!formErrors.name}
                            helperText={formErrors.name ?? " "}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
                        <TextField
                            type="number"
                            value={formValues.age ?? ""}
                            onChange={handleNumberFieldChange}
                            name="age"
                            label="Age"
                            error={!!formErrors.age}
                            helperText={formErrors.age ?? " "}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={formValues.joinDate ? dayjs(formValues.joinDate) : null}
                                onChange={handleDateFieldChange("joinDate")}
                                name="joinDate"
                                label="Join date"
                                format="DD-MM-YYYY"
                                slotProps={{
                                    textField: {
                                        error: !!formErrors.joinDate,
                                        helperText: formErrors.joinDate ?? " ",
                                        fullWidth: true
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
                        <FormControl error={!!formErrors.role} fullWidth>
                            <InputLabel id="employee-role-label">Department</InputLabel>
                            <Select
                                value={formValues.role ?? ""}
                                onChange={handleSelectFieldChange as SelectProps["onChange"]}
                                labelId="employee-role-label"
                                name="role"
                                label="Department"
                                defaultValue=""
                                fullWidth
                            >
                                <MenuItem value="Market">Market</MenuItem>
                                <MenuItem value="Finance">Finance</MenuItem>
                                <MenuItem value="Development">Development</MenuItem>
                            </Select>
                            <FormHelperText>{formErrors.role ?? " "}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
                        <FormControl>
                            <FormControlLabel
                                name="isFullTime"
                                control={<Checkbox size="large" checked={formValues.isFullTime ?? false} onChange={handleCheckboxFieldChange} />}
                                label="Full-time"
                            />
                            <FormHelperText error={!!formErrors.isFullTime}>{formErrors.isFullTime ?? " "}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
            </FormGroup>
            <Stack direction="row" spacing={2} justifyContent="space-between">
                {/* <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                    Back
                </Button> */}
                <Button type="submit" variant="contained" size="large" loading={isSubmitting}>
                    {submitButtonLabel}
                </Button>
            </Stack>
        </Box>
    );
}
