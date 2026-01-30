import { useState } from "react";
import { Typography, Box, ImageList, ImageListItem, ImageListItemBar, IconButton, Dialog, DialogTitle, DialogContent, Chip, Fade } from "@mui/material";
import {
    // Info as InfoIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Close as CloseIcon,
    FilterList as FilterIcon
} from "@mui/icons-material";
import type { IPost, IVariant } from "../../services/danbooru";

// --- Main Component ---
type Props = {
    postList: Array<IPost>;
    isMobile: boolean;
    activeTab: number;
    setTags?: (tag: string) => void;
};

type VariantType = "180x180" | "360x360" | "720x720" | "sample" | "original";

export default function PostList({ postList, activeTab, isMobile, setTags }: Props) {
    const [selectedImage, setSelectedImage] = useState<IPost | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    const toggleFavorite = (title: string) => {
        const newFavs = new Set(favorites);
        if (newFavs.has(title)) {
            newFavs.delete(title);
        } else {
            newFavs.add(title);
        }
        setFavorites(newFavs);
    };

    function setTextBox(tag: string) {
        setTags && setTags(tag);
    }

    function getImg(variants: IVariant[] = [], type:VariantType = "180x180") {
        let src = "";
        if (!variants) return src;
        try {
            const url = variants.find((v) => v.type == type)?.url;
            if (url) src = url;
        } catch (err) {
            console.error(err);
        }
        return src;
    }

    const renderImageList = () => {
        switch (activeTab) {
            case 0: // Standard
                return (
                    <ImageList cols={isMobile ? 2 : 6} gap={10}>
                        {postList.map((item) => (
                            <ImageListItem key={item.id}>
                                <img
                                    src={getImg(item.media_asset.variants)}
                                    alt={item.source}
                                    loading="lazy"
                                    className="rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                                    onClick={() => setSelectedImage(item)}
                                />
                                <ImageListItemBar
                                    title={item.id.toString()}
                                    subtitle={item.tag_string}
                                    sx={{ borderRadius: "0 0 8px 8px" }}
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(item.source);
                                            }}
                                        >
                                            {favorites.has(item.source) ? <FavoriteIcon sx={{ color: "#ff1744" }} /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                );

            case 1: // Quilted
                return (
                    <ImageList variant="quilted" cols={isMobile ? 2 : 6} rowHeight={121} gap={8}>
                        {postList.map((item) => (
                            <ImageListItem key={item.id} cols={1} rows={1}>
                                <img
                                    src={getImg(item.media_asset.variants)}
                                    alt={item.source}
                                    loading="lazy"
                                    className="rounded-lg cursor-pointer"
                                    onClick={() => setSelectedImage(item)}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                );

            case 2: // Masonry
                return (
                    <ImageList variant="masonry" cols={isMobile ? 2 : 6} gap={12}>
                        {postList.map((item) => (
                            <ImageListItem key={item.id}>
                                <img
                                    src={getImg(item.media_asset.variants)}
                                    alt={item.source}
                                    loading="lazy"
                                    className="rounded-lg cursor-pointer"
                                    onClick={() => setSelectedImage(item)}
                                />
                                <ImageListItemBar
                                    position="below"
                                    title={item.source}
                                    actionIcon={
                                        <IconButton onClick={() => toggleFavorite(item.source)} size="small">
                                            {favorites.has(item.source) ? <FavoriteIcon sx={{ color: "#ff1744" }} /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {/* Content Section */}
            <Fade in timeout={500}>
                <Box sx={{ minHeight: "60vh" }}>
                    {postList.length > 0 ? (
                        renderImageList()
                    ) : (
                        <Box sx={{ display: "flex", flexFlow: "column", alignItems: "center", py: 10 }}>
                            <FilterIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No images match your search
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Fade>

            {/* Detail Modal */}
            <Dialog
                open={Boolean(selectedImage)}
                onClose={() => setSelectedImage(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
            >
                {selectedImage && (
                    <>
                        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" fontWeight="bold">
                                {selectedImage.source}
                            </Typography>
                            <IconButton onClick={() => setSelectedImage(null)}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers sx={{ p: 0 }}>
                            <img src={getImg(selectedImage.media_asset.variants, "original")} alt={selectedImage.source} style={{ width: "100%", display: "block" }} />
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Captured by <strong>{selectedImage.uploader_id}</strong>
                                    </Typography>
                                    <IconButton onClick={() => toggleFavorite(selectedImage.source)}>
                                        {favorites.has(selectedImage.source) ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                                    </IconButton>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    {selectedImage.tag_string.split(/ /g).map((tag) => (
                                        <a href="" onClick={() => setTextBox(tag)}>
                                            <Chip key={tag} label={`#${tag.toLowerCase()}`} size="small" variant="outlined" />
                                        </a>
                                    ))}
                                </Box>
                            </Box>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </>
    );
}
