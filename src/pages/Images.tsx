import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Box, Tabs, Tab, TextField, InputAdornment, useMediaQuery, useTheme, Paper, IconButton } from "@mui/material";
import { Search as SearchIcon, Refresh } from "@mui/icons-material";
// import CustomDrawer from "../components/CustomDrawer";
import PageContainer from "../components/PageContainer";
import { getTestPostList, getPostList, type IPost } from "../services/danbooru";
import PostList from "../components/Images/PostList";
import CustomPagination from "../components/CustomPagination";

const Images = () => {
    const theme = useTheme();
    const [postList, setPostList] = useState<Array<IPost>>([]);

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [activeTab, setActiveTab] = useState(0);

    const [page, setPage] = useState(1);
    const [limit, _setLimit] = useState(12);
    const [tags, setTags] = useState("");

    // const getTestPostByPaging = useCallback(() => {
    //     getTestPostList(page, limit).then((list) => setPostList(list));
    // }, [page]);

    const getPostByPaging = useCallback(() => {
        getPostList(page, limit, tags).then((list) => setPostList(list));
    }, [page]);

    // const getTestPostBytags = useCallback(() => {
    //     setPage(1);
    //     getTestPostList(page, limit, tags).then((list) => setPostList(list));
    // }, [tags]);

    const getPostBytags = useCallback(() => {
        setPage(1);
        getPostList(page, limit, tags).then((list) => setPostList(list));
    }, [tags]);

    const handleRefresh = () => {
        setPage(1);
        setTags("");
        // getTestPostByPaging()
        getPostByPaging();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        getPostBytags();
    };

    useEffect(() => {
        getPostByPaging();
    }, [getPostByPaging]);

    return (
        <PageContainer
            title="Images"
            breadcrumbs={[]}
            actions={
                <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                    <Refresh />
                </IconButton>
            }
        >
            {/* <CustomDrawer btnIcon={<FileOpen />} title="Detail" titleIcon={<ListIcon />} /> */}
            <Paper elevation={0} sx={{ p: 2, mb: 4, bgcolor: "action.hover", borderRadius: 4 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "center", justifyContent: "space-between" }}>
                    <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} indicatorColor="primary" textColor="primary">
                        <Tab label="Standard" />
                        <Tab label="Quilted" />
                        <Tab label="Masonry" />
                    </Tabs>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth={isMobile}
                            placeholder="Search items..."
                            variant="outlined"
                            size="small"
                            type="search"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 3, bgcolor: "background.paper", width: { md: 300 } }
                            }}
                        />
                    </Box>
                </Box>
            </Paper>
            <CustomPagination pageCount={10} pageNumber={page} setPageNumber={setPage} />
            <PostList postList={postList} activeTab={activeTab} isMobile={isMobile} setTags={setTags} />
            <CustomPagination pageCount={10} pageNumber={page} setPageNumber={setPage} />
        </PageContainer>
    );
};

export default Images;
