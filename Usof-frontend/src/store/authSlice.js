import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { $host, $authHost } from '../http';
import { jwtDecode } from 'jwt-decode';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await $host.post('/auth/login', { email, password });
      const token = response.data.accessToken;
      localStorage.setItem('accessToken', token);

      const decoded = jwtDecode(token);

      const user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
        fullName: '',
        login: '',
        avatar: '',
      };

      return {
        user,
        accessToken: token,
        status: response.status,
        message: response.data.message,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: 'Error', status: 500 }
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (updateData, thunkAPI) => {
    try {
      const response = await $authHost.patch(
        `/user/${updateData.id}`,
        updateData
      );
      return { ...response.data, updateField: updateData };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || { message: 'Error', status: 500 }
      );
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (formData, thunkAPI) => {
    try {
      const response = await $authHost.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || { message: 'Error', status: 500 }
      );
    }
  }
);

const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuth: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuth = false;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update User

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload.updateField };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Upload Avatar

      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.user.avatar = action.payload.avatar;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
