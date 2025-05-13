import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApi, postApi } from "../service/ApiService";
import { isLoggedIn } from "../service/AuthUtil";

//ACTIONS
export const CREATE_POST = "/posts/create"
export const GET_POSTS = "/posts/posts"
export const FETCH_POST_DETAIL = "/posts/post"
export const EDIT_POST = "/posts/edit"
export const DELETE_POST = "/posts/delete"
export const SAVE_COMMENT = "/comments/comment"
export const GET_COMMENTS = "/comments/comments"

// Thunk: Create Post
export const createPost = createAsyncThunk(
    CREATE_POST,
    async ({ data, params }, { rejectWithValue }) => {
        try {
            return await postApi(CREATE_POST, data, params);
        } catch (error) {
            console.log(error)
            return rejectWithValue(error);
        }
    }
);

// Thunk: Fetch Posts
export const fetchPosts = createAsyncThunk(
    GET_POSTS,
    async (params, { rejectWithValue }) => {
        try {
            return await getApi(GET_POSTS, params);
        } catch (error) {
            console.log(error)
            return rejectWithValue(error);
        }
    }
);


// Thunk: Fetch Post Detail
export const fetchPostDetail = createAsyncThunk(
    FETCH_POST_DETAIL,
    async (postid, { rejectWithValue }) => {
        try {
            return await getApi(`${FETCH_POST_DETAIL}/${postid}`);
        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
);

// Thunk: Edit Post
export const editPost = createAsyncThunk(
    EDIT_POST,
    async ({ data, params }, { rejectWithValue }) => {
        try {
            return await postApi(EDIT_POST, data, params);
        } catch (error) {
            console.log(error);
            return rejectWithValue(error);
        }
    }
);

// Thunk: Delete Post
export const deletePost = createAsyncThunk(
    DELETE_POST,
    async ({ data, params }, { rejectWithValue }) => {
        try {
            return await postApi(DELETE_POST, data, params);
        } catch (error) {
            console.log(error)
            return rejectWithValue(error);
        }
    }
);

// Thunk: Save Comment
export const saveComment = createAsyncThunk(
    SAVE_COMMENT,
    async ({ data, params }, { rejectWithValue }) => {
        try {
            return await postApi(SAVE_COMMENT, data, params);
        } catch (error) {
            console.log(error)
            return rejectWithValue(error);
        }
    }
);


// Thunk: Fetch Comments
export const fetchComments = createAsyncThunk(
    GET_COMMENTS,
    async (postid, { rejectWithValue }) => {
        try {
            return await getApi(`${GET_COMMENTS}/${postid}`);
        } catch (error) {
            console.log(error)
            return rejectWithValue(error);
        }
    }
);

const postSlice = createSlice({
    name: "forrum",
    initialState: {
        createPostResp: null,
        fetchPostsResp: null,
        fetchPostDetailResp: null,
        editPostResp: null,
        deletePostResp: null,
        saveCommentResp: null,
        fetchCommentsResp: null,
        loading: false
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            //Create Post
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.createPostResp = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.createPostResp = action.payload.data
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
            })
            //Fetch Posts
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.fetchPostsResp = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.fetchPostsResp = action.payload.data
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
            })
            //Fetch Post Detail
            .addCase(fetchPostDetail.pending, (state) => {
                state.loading = true;
                state.fetchPostDetailResp = null;
            })
            .addCase(fetchPostDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.fetchPostDetailResp = action.payload.data
            })
            .addCase(fetchPostDetail.rejected, (state, action) => {
                state.loading = false;
            })
            //Edit Post
            .addCase(editPost.pending, (state) => {
                state.loading = true;
                state.editPostResp = null;
            })
            .addCase(editPost.fulfilled, (state, action) => {
                state.loading = false;
                state.editPostResp = action.payload.data
            })
            .addCase(editPost.rejected, (state, action) => {
                state.loading = false;
            })
            //Delete Post
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.deletePostResp = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.deletePostResp = action.payload.data
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
            })
            //Save Comment
            .addCase(saveComment.pending, (state) => {
                state.loading = true;
                state.saveCommentResp = null;
            })
            .addCase(saveComment.fulfilled, (state, action) => {
                state.loading = false;
                state.saveCommentResp = action.payload.data
            })
            .addCase(saveComment.rejected, (state, action) => {
                state.loading = false;
            })
            //Fetch Comments
            .addCase(fetchComments.pending, (state) => {
                state.fetchCommentsResp = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.fetchCommentsResp = action.payload.data
            })
            .addCase(fetchComments.rejected, (state, action) => {
            })

    },
});

export const { setLoading } = postSlice.actions;
export default postSlice.reducer;
