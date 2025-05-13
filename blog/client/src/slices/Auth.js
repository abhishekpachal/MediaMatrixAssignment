import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getApi, postApi } from "../service/ApiService";
import { getToken, getUser } from "../service/AuthUtil";

//ACTIONS
export const POST_SIGN_UP = "/users/signup"
export const POST_SIGN_IN = "/users/login"

// Thunk : Sign Up
export const postSignUp = createAsyncThunk(
    POST_SIGN_UP,
    async ({ data, params }, { rejectWithValue }) => {
        try {
            return await postApi(POST_SIGN_UP, data, params);
        } catch (error) {
            console.log(error)
            return rejectWithValue(error);
        }
    }
);

// Thunk : Login
export const postSignIn = createAsyncThunk(
    POST_SIGN_IN,
    async ({ data, params }, { rejectWithValue }) => {
        try {
            return await postApi(POST_SIGN_IN, data, params);
        } catch (error) {
            console.log(error)
            return rejectWithValue(error);
        }
    }
);




const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: getUser(),
        token: getToken(),
        signUpResp: null,
        signInResp: null,
        loading: false,
        loggedIn: getUser() ? true : false,

    },
    reducers: {
        login: (state, action) => {
            let token = action.payload.token;
            let user = action.payload.user;
            state.token = token;
            state.user = user;
            state.loggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.signUpResp = null;
            state.signInResp = null;
            state.loggedIn = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            //Sign Up
            .addCase(postSignUp.pending, (state) => {
                state.loading = true;
            })
            .addCase(postSignUp.fulfilled, (state, action) => {
                state.loading = false;
                state.signUpResp = action.payload.data
            })
            .addCase(postSignUp.rejected, (state, action) => {
                state.loading = false;
            })

            // Sign In
            .addCase(postSignIn.pending, (state) => {
                state.loading = true;
            })
            .addCase(postSignIn.fulfilled, (state, action) => {
                state.loading = false;
                state.signInResp = action.payload.data;
            })
            .addCase(postSignIn.rejected, (state, action) => {
                state.loading = false;
            })

    },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
