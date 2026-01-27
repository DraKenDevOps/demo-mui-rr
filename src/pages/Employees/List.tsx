import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    type GridColDef,
    type GridFilterModel,
    type GridPaginationModel,
    type GridSortModel,
    type GridEventListener,
    gridClasses
} from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useLocation, useNavigate, useSearchParams } from "react-router";

import { useDialog } from "../../hooks/useDialog/useDialog";
import useNotifications from "../../hooks/useNotification/useNotification";
import { deleteOne as deleteEmployee, getMany as getEmployees, type Employee } from "../../services/mock";
import PageContainer from "../../components/PageContainer";

const INITIAL_PAGE_SIZE = 10;

export default function EmployeeList() {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const dialogs = useDialog();
    const notifications = useNotifications();

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
        pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : INITIAL_PAGE_SIZE
    });
    const [filterModel, setFilterModel] = useState<GridFilterModel>(searchParams.get("filter") ? JSON.parse(searchParams.get("filter") ?? "") : { items: [] });
    const [sortModel, setSortModel] = useState<GridSortModel>(searchParams.get("sort") ? JSON.parse(searchParams.get("sort") ?? "") : []);

    const [rowsState, setRowsState] = useState<{
        rows: Employee[];
        rowCount: number;
    }>({
        rows: [],
        rowCount: 0
    });

    // const [isLoading, setIsLoading] = useState(true);

    const handlePaginationModelChange = useCallback(
        (model: GridPaginationModel) => {
            setPaginationModel(model);

            searchParams.set("page", String(model.page));
            searchParams.set("pageSize", String(model.pageSize));

            const newSearchParamsString = searchParams.toString();

            navigate(`${pathname}${newSearchParamsString ? "?" : ""}${newSearchParamsString}`);
        },
        [navigate, pathname, searchParams]
    );

    const handleFilterModelChange = useCallback(
        (model: GridFilterModel) => {
            setFilterModel(model);

            if (model.items.length > 0 || (model.quickFilterValues && model.quickFilterValues.length > 0)) {
                searchParams.set("filter", JSON.stringify(model));
            } else {
                searchParams.delete("filter");
            }

            const newSearchParamsString = searchParams.toString();

            navigate(`${pathname}${newSearchParamsString ? "?" : ""}${newSearchParamsString}`);
        },
        [navigate, pathname, searchParams]
    );

    const handleSortModelChange = useCallback(
        (model: GridSortModel) => {
            setSortModel(model);

            if (model.length > 0) {
                searchParams.set("sort", JSON.stringify(model));
            } else {
                searchParams.delete("sort");
            }

            const newSearchParamsString = searchParams.toString();

            navigate(`${pathname}${newSearchParamsString ? "?" : ""}${newSearchParamsString}`);
        },
        [navigate, pathname, searchParams]
    );

    const loadData = useCallback(async () => {
        const listData = getEmployees({
            paginationModel,
            sortModel,
            filterModel
        });

        setRowsState({
            rows: listData.items,
            rowCount: listData.itemCount
        });
    }, [paginationModel, sortModel, filterModel]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRefresh = useCallback(() => {
        loadData();
    }, [loadData]);

    const handleRowClick = useCallback<GridEventListener<"rowClick">>(
        ({ row }) => {
            navigate(`/employees/${row.id}`);
        },
        [navigate]
    );

    const handleCreateClick = useCallback(() => {
        navigate("/employees/new");
    }, [navigate]);

    const handleRowEdit = useCallback(
        (employee: Employee) => () => {
            navigate(`/employees/${employee.id}/edit`);
        },
        [navigate]
    );

    const handleRowDelete = useCallback(
        (employee: Employee) => async () => {
            const confirmed = await dialogs.confirm(`Do you wish to delete ${employee.name}?`, {
                title: `Delete employee?`,
                severity: "error",
                okText: "Delete",
                cancelText: "Cancel"
            });

            if (confirmed) {
                try {
                    deleteEmployee(Number(employee.id));

                    notifications.show("Employee deleted successfully.", {
                        severity: "success",
                        autoHideDuration: 3000
                    });
                    loadData();
                } catch (deleteError) {
                    notifications.show(`Failed to delete employee. Reason:' ${(deleteError as Error).message}`, {
                        severity: "error",
                        autoHideDuration: 3000
                    });
                }
            }
        },
        [dialogs, notifications, loadData]
    );

    const initialState = useMemo(
        () => ({
            pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } }
        }),
        []
    );

    const columns = useMemo<GridColDef[]>(
        () => [
            { field: "id", headerName: "ID" },
            { field: "name", headerName: "Name", width: 140 },
            { field: "age", headerName: "Age", type: "number" },
            {
                field: "joinDate",
                headerName: "Join date",
                // type: "date",
                // valueGetter: (value) => value && new Date(value),
                width: 140
            },
            {
                field: "role",
                headerName: "Department",
                type: "singleSelect",
                valueOptions: ["Market", "Finance", "Development"],
                width: 160
            },
            { field: "isFullTime", headerName: "Full-time", type: "boolean" },
            {
                field: "actions",
                type: "actions",
                flex: 1,
                align: "right",
                getActions: ({ row }) => [
                    <GridActionsCellItem key="edit-item" icon={<EditIcon />} label="Edit" onClick={handleRowEdit(row)} />,
                    <GridActionsCellItem key="delete-item" icon={<DeleteIcon />} label="Delete" onClick={handleRowDelete(row)} />
                ]
            }
        ],
        [handleRowEdit, handleRowDelete]
    );

    const pageTitle = "Employees";

    return (
        <PageContainer
            title="LIST"
            breadcrumbs={[{ title: pageTitle }]}
            actions={
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title="Reload data" placement="right" enterDelay={1000}>
                        <div>
                            <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                                <RefreshIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Button variant="contained" onClick={handleCreateClick} startIcon={<AddIcon />}>
                        Create
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ width: "100%" }}>
                <DataGrid
                    rows={rowsState.rows}
                    rowCount={rowsState.rowCount}
                    columns={columns}
                    pagination
                    sortingMode="server"
                    filterMode="server"
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
                    sortModel={sortModel}
                    onSortModelChange={handleSortModelChange}
                    filterModel={filterModel}
                    onFilterModelChange={handleFilterModelChange}
                    disableRowSelectionOnClick
                    onRowClick={handleRowClick}
                    initialState={initialState}
                    showToolbar
                    pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
                    sx={{
                        [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                            outline: "transparent"
                        },
                        [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
                            outline: "none"
                        },
                        [`& .${gridClasses.row}:hover`]: {
                            cursor: "pointer"
                        }
                    }}
                    slotProps={{
                        loadingOverlay: {
                            variant: "circular-progress",
                            noRowsVariant: "circular-progress"
                        },
                        baseIconButton: {
                            size: "small"
                        }
                    }}
                />
            </Box>
        </PageContainer>
    );
}
