import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./slices/Post";
import authReducer from "./slices/Auth";
import loaderReducer from "./slices/Loader";


const store = configureStore({
    reducer: {
        loader: loaderReducer,
        post: postReducer,
        auth: authReducer,
    },
});

export default store;
