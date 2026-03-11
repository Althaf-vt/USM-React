import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import userService from "./userService"
// import { search } from "../../../../Backend/routes/authRoutes";

const initialState = {
    users: [],
    search: "",
    page: 1,
    pages: 1,
    isLoading: false,
    isError: false,
    message: ""
}

// Fetch users 
export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async(_,thunkAPI) => {
        try {
            const state = thunkAPI.getState().users;
            return await userService.getUsers(state.search, state.page);
        } catch (error) {
            console.log("FULL ERROR:", error);
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Something went wrong!"
            );
        }
    }
)

export const removeUser = createAsyncThunk(
    'users/delete',
    async(id, thunkAPI) => {
        try {
            await userService.deleteUser(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Delete failed"
            );
        }
    }
)

export const addUser = createAsyncThunk(
    'user/create',
    async(userData, thunkAPI) => {
        try {
            return await userService.createUser(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Create failed"
            );
        }
    }
)

export const editUser = createAsyncThunk(
    'user/update',
    async({id, userData}, thunkAPI) => {
        try {
            return await userService.updateUser(id,userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Update failed"
            );
        }
    }
)



const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        resetUsers: (state) => {
            state.users = [];
            state.isLoading= false;
            state.isError= false;
            state.message= "";
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        clearUserError: (state) => {
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload.users;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(fetchUsers.rejected, (state,action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(removeUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addUser.pending,(state)=> {
                state.isLoading = true;
            })
            .addCase(addUser.fulfilled, (state, action)=> {
                state.isLoading = false;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(editUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            })
            .addCase(editUser.fulfilled, (state,action) => {
                state.isLoading = false;
                state.users = state.users.map((user) => 
                user._id === action.payload._id ? action.payload : user
                )
            })
            .addCase(editUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    },
})

export const {resetUsers, setSearch, setPage, clearUserError} = userSlice.actions;
export default userSlice.reducer;