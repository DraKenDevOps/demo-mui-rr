const TEST_URL = "https://testbooru.donmai.us";
const BASE_URL = "https://danbooru.donmai.us";

export interface IPost {
    id: number;
    created_at: Date;
    uploader_id: number;
    score: number;
    source: string;
    md5: string;
    last_comment_bumped_at: string | null;
    rating: string;
    image_width: number;
    image_height: number;
    tag_string: string;
    fav_count: number;
    file_ext: string;
    last_noted_at: string | number | null;
    parent_id: string | number | null;
    has_children: boolean;
    approver_id: string | number | null;
    tag_count_general: number;
    tag_count_artist: number;
    tag_count_character: number;
    tag_count_copyright: number;
    file_size: number;
    up_score: number;
    down_score: number;
    is_pending: boolean;
    is_flagged: boolean;
    is_deleted: boolean;
    tag_count: number;
    updated_at: Date;
    is_banned: boolean;
    pixiv_id: string | number | null;
    last_commented_at: string | number | null;
    has_active_children: boolean;
    bit_flags: number;
    tag_count_meta: number;
    has_large: boolean;
    has_visible_children: boolean;
    media_asset: IMediaAsset;
    tag_string_general: string;
    tag_string_character: string;
    tag_string_copyright: string;
    tag_string_artist: string;
    tag_string_meta: string;
    file_url: string;
    large_file_url: string;
    preview_file_url: string;
}

export interface IMediaAsset {
    id: number;
    created_at: Date;
    updated_at: Date;
    md5: string;
    file_ext: string;
    file_size: number;
    image_width: number;
    image_height: number;
    duration: number | string | null;
    status: string;
    file_key: string;
    is_public: boolean;
    pixel_hash: string;
    variants: IVariant[];
}

export interface IVariant {
    type: string;
    url: string;
    width: number;
    height: number;
    file_ext: string;
}

const headers = new Headers();
export async function getTestPostList(page = 1, limit = 12, tags = "") {
    // headers.set("Accept", "application/json");
    try {
        const response = await fetch(`${TEST_URL}/posts.json?page=${page}&limit=${limit}&tags=${tags}`, {
            headers
        });
        const list = await response.json();
        return list as Array<IPost>;
    } catch (err) {
        console.error(err);
        return [] as Array<IPost>;
    }
}

export async function getPostList(page = 1, limit = 12, tags = "") {
    // headers.set("Accept", "application/json");
    try {
        const response = await fetch(`${BASE_URL}/posts.json?page=${page}&limit=${limit}&tags=${tags}`, {
            headers
        });
        const list = await response.json();
        return list as Array<IPost>;
    } catch (err) {
        console.error(err);
        return [] as Array<IPost>;
    }
}
