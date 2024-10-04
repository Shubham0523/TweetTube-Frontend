import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { parseErrorMessage } from "../../helpers/parseErrMsg.helper";
import { axiosInstance } from "../../helpers/axios.helper";
import { toast } from "react-toastify";

const initialState = {
  loading: false,
  status: false,
  data: null,
};

// Action Creators
export const getLikedVideos = createAsyncThunk("like/getLikedVideos", async () => {
  try {
    const response = await axiosInstance.get(`/like/videos`);
    return response.data.data;
  } catch (error) {
    toast.error(parseErrorMessage(error.response.data));
    throw error;
  }
});

export const toggleLike = createAsyncThunk(
  "like/toggleLike",
  async ({ qs, toggleLike }, { dispatch }) => {
    try {
      const response = await axiosInstance.patch(`/like?toggleLike=${toggleLike}&${qs}`);
      
      // Extract video data from response
      const responseData = response.data.data;
      
      // Dispatch video state update if it's a video like
      if (qs.includes('videoId')) {
        dispatch({
          type: 'video/updateLikeStatus',
          payload: {
            videoId: responseData.videoId || qs.split('=')[1], // Fallback to query param if needed
            isLiked: responseData.isLiked,
            totalLikes: responseData.totalLikes,
            isDisLiked: responseData.isDisLiked,
            totalDisLikes: responseData.totalDisLikes
          }
        });
      }
      
      return responseData;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      throw error;
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  "like/toggleCommentLike",
  async ({ commentId, toggleLike }) => {
    try {
      const response = await axiosInstance.patch(
        `/like/comment/${commentId}?toggleLike=${toggleLike}`
      );
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      throw error;
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  "like/toggleTweetLike", 
  async (tweetId) => {
    try {
      const response = await axiosInstance.patch(`/like/tweet/${tweetId}`);
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      throw error;
    }
  }
);

export const toggleVideoLike = createAsyncThunk(
  "like/toggleVideoLike", 
  async (videoId) => {
    try {
      const response = await axiosInstance.patch(`/like/video/${videoId}`);
      return response.data.data;
    } catch (error) {
      toast.error(parseErrorMessage(error.response.data));
      throw error;
    }
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    // Add any synchronous reducers here if needed
    resetLikeState: (state) => {
      state.loading = false;
      state.status = false;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    // get Liked Videos
    builder.addCase(getLikedVideos.pending, (state) => {
      state.loading = true;
      state.data = null;
    });
    builder.addCase(getLikedVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(getLikedVideos.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle like
    builder.addCase(toggleLike.pending, (state) => {
      // Don't clear data on pending to maintain optimistic updates
      state.loading = true;
    });
    builder.addCase(toggleLike.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(toggleLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle Comment Like
    builder.addCase(toggleCommentLike.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleCommentLike.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(toggleCommentLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle Tweet Like
    builder.addCase(toggleTweetLike.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleTweetLike.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(toggleTweetLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });

    // toggle Video Like
    builder.addCase(toggleVideoLike.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleVideoLike.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.status = true;
    });
    builder.addCase(toggleVideoLike.rejected, (state) => {
      state.loading = false;
      state.status = false;
    });
  },
});

export const { resetLikeState } = likeSlice.actions;
export default likeSlice.reducer;