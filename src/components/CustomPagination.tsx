import { Box, Pagination } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";

interface Props {
    setPageNumber: Dispatch<SetStateAction<number>>;
    pageCount: number;
    pageNumber: number;
}

const CustomPagination = ({ pageCount, pageNumber, setPageNumber }: Props) => {
    return (
        <Box
            sx={{
                my: 2,
                p: 2,
                bgcolor: "background.paper",
                boxShadow: "0 1px 20px 0 rgba(69,90,100,.08)"
            }}
        >
            <Pagination
                count={pageCount}
                page={pageNumber}
                showFirstButton
                showLastButton
                color="primary"
                shape="rounded"
                onChange={(_, p) => setPageNumber(p > pageCount ? pageCount : p)}
            />
        </Box>
    );
};

export default CustomPagination;
