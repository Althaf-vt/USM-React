import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";
import profileService from "./profileService";

const userSession = localStorage.getItem("userSession")
  ? JSON.parse(localStorage.getItem("userSession"))
  : null;

const adminSession = localStorage.getItem("adminSession")
  ? JSON.parse(localStorage.getItem("adminSession"))
  : null;

const initialState = {
  user: userSession,
  admin: adminSession,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Register
export const register = createAsyncThunk(
    'auth/register',
    async(userData, thunkAPI) => {
        try {
            return await authService.register(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

// Login

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async(userData, thunkAPI) => {
        try {
            return await authService.loginUser(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
)

export const loginAdmin = createAsyncThunk(
    'auth/loginAdmin',
    async(userData, thunkAPI) => {
        try {
            return await authService.loginAdmin(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
)

// Update profile 

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (formData, thunkAPI) => {
        try {
            const updatedUser = await profileService.updateUserProfile(formData);

            // Update localStorage with new data
            const currentUser = JSON.parse(localStorage.getItem('userSession'));
            const newUser = {...currentUser, ...updatedUser};
            localStorage.setItem('userSession', JSON.stringify(newUser));

            return newUser;
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Update failed"
            )
        }
    }
)

export const updateAdminProfile = createAsyncThunk(
    'auth/updateAdminProfile',
    async (formData, thunkAPI) => {
        try {
            const updatedUser = await profileService.updateAdminProfile(formData);

            // Update localStorage with new data
            const currentUser = JSON.parse(localStorage.getItem('adminSession'));
            const newUser = {...currentUser, ...updatedUser};
            localStorage.setItem('adminSession', JSON.stringify(newUser));

            return newUser;
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Update failed"
            )
        }
    }
)



export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem("userSession");
        },

        logoutAdmin: (state) => {
            state.admin = null;
            localStorage.removeItem("adminSession");
        },

        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.isSuccess = true;
                state.user = action.payload;

                localStorage.setItem("userSession", JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state,action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(loginAdmin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.isSuccess = true;
                state.admin = action.payload;

                localStorage.setItem("adminSession", JSON.stringify(action.payload));
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess= false;
                state.message = "";
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isSuccess = false;
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(updateAdminProfile.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess= false;
                state.message = "";
            })
            .addCase(updateAdminProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.admin = action.payload;
            })
            .addCase(updateAdminProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

    }
})

export const {logoutUser, logoutAdmin,reset} = authSlice.actions;
export default authSlice.reducer;