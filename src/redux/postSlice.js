import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Asynchronous fetch posts function
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get("http://localhost:8000/api/photos");
  return response.data;
});

//get the initial set of liked photos from the server
export const fetchUserLikes = createAsyncThunk('posts/fetchUserLikes', async(userId) => {
  const response = await axios.get(`http://localhost:8000/api/users/${userId}/likes`);
  // return response.data.map((like) => like.photoId);
  console.log(response.data);
 return response.data;

})



export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ postId, userId }) => {
    const response = await axios.post(
      `http://localhost:8000/api/photos/${postId}/like`,
      { userId }
    );
    console.log(`Liked post response: ${JSON.stringify(response.data)}`);
    // Consider returning the response data instead of postId
    // return {photoId: postId};
    return response.data;
    // return { photoId: postId, userId };
  }
);

// Action to handle unliking a post
// Updated unlikePost action
export const unlikePost = createAsyncThunk(
  "posts/unlikePost",
  async ({ postId, userId }) => {
    const response = await axios.delete(
      `http://localhost:8000/api/photos/${postId}/unlike`,
      { data: { userId } }
    );
    console.log(`Unliked post response: ${JSON.stringify(response.data)}`);
    return {photoId: postId};
    // return { photoId: postId, userId };
    
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
    likedPhotoIds: [], 
    // likesStatus: 'idle', //loading state for likes
    // likesError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // .addCase(fetchPosts.pending, (state) => {
      //   state.status = 'loading';
      // })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // .addCase(fetchUserLikes.pending, (state) => {
      //   state.likesStatus = 'loading';
      // })

      .addCase(fetchUserLikes.fulfilled, (state, action) => {
        // Initialize likedPhotoIds with the ids of the liked photos
        state.likedPhotoIds = action.payload.map(photo => photo.id);
        // // Always replace likedPhotoIds with a new array
        // state.likedPhotoIds = action.payload;

      })

      .addCase(fetchUserLikes.rejected, (state, action) => {
        state.likesStatus = 'failed';
        state.likesError = action.error.message;
      })
      
      .addCase(likePost.fulfilled, (state, action) => {
        // // Add to likedPhotoIds array
        // state.likedPhotoIds = [...state.likedPhotoIds, action.payload.photoId];
        if (!state.likedPhotoIds.includes(action.payload.photoId)) {
          state.likedPhotoIds.push(action.payload.photoId);
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        // // Remove from likedPhotoIds array
        // state.likedPhotoIds = state.likedPhotoIds.filter(
        //   (photoId) => photoId !== action.payload.photoId
        // );
        state.likedPhotoIds = state.likedPhotoIds.filter(photoId => photoId !== action.payload.photoId);
      })
  },
});

export default postSlice.reducer;
