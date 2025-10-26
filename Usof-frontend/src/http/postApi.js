import { $authHost } from '.';

export const createPost = async (
  title,
  content,
  location,
  images,
  categories
) => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('location', location);
    images.forEach((image) => {
      formData.append('image', image.file);
    });
    categories.forEach((category) => {
      formData.append('categories', category);
    });

    const response = await $authHost.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllPosts = async () => {
  try {
    const response = await $authHost.get('/api/posts');
    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await $authHost.get(`/api/posts/${postId}`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getPostsByUser = async (userId) => {
  try {
    const response = await $authHost.get(`/api/posts/user/${userId}`);
    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createLike = async (postId) => {
  try {
    const response = await $authHost.post(`/api/posts/${postId}/like`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteLike = async (postId) => {
  try {
    const response = await $authHost.delete(`/api/posts/${postId}/like`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllCommentsForPost = async (
  postId,
  sort = 'createdAt',
  order = 'desc'
) => {
  try {
    const response = await $authHost.get(
      `/api/posts/${postId}/comments?sort=${sort}&order=${order}`
    );
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getLikeStatus = async (postId) => {
  try {
    const response = await $authHost.get(`/api/posts/${postId}/like/status`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getStarStatus = async (postId) => {
  try {
    const response = await $authHost.get(`/api/stars/${postId}/star/status`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getFollowingPosts = async () => {
  try {
    const response = await $authHost.get('/api/posts/following');
    return response.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const giveStarToPost = async (postId, stars) => {
  try {
    const response = await $authHost.post(`/api/stars/${postId}/star`, {
      stars,
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deletePostById = async (postId) => {
  try {
    const response = await $authHost.delete(`/api/posts/${postId}`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updatePost = async (...args) => {
  try {
    const postId = args[0];
    const maybeFormData = args[1];

    if (maybeFormData && typeof maybeFormData.append === 'function') {
      // Let the browser set Content-Type (with boundary). Do not set multipart/form-data header manually.
      const response = await $authHost.patch(
        `/api/posts/${postId}`,
        maybeFormData
      );
      return response;
    }

    const title = args[1];
    const content = args[2];
    const location = args[3];
    const images = args[4] || [];
    const categories = args[5] || [];
    const removedImages = args[6] || [];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('location', location);

    (images || []).forEach((image) => {
      if (image?.file) {
        formData.append('newImages', image.file);
      }
    });

    (categories || []).forEach((category) => {
      formData.append('categories', category);
    });

    (removedImages || []).forEach((imgId) => {
      formData.append('removedImages', imgId);
    });

    // Let axios/browser set the Content-Type header for FormData so the multipart boundary is included
    const response = await $authHost.put(`/api/posts/${postId}`, formData);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getCategoriesForPost = async (postId) => {
  try {
    const response = await $authHost.get(`/api/posts/${postId}/categories`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createCommentForPost = async (
  postId,
  content,
  parentId = null
) => {
  try {
    const response = await $authHost.post(`/api/posts/${postId}/comments`, {
      content,
      parentId,
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateCommentById = async (commentId, content) => {
  try {
    const response = await $authHost.patch(`/api/comments/${commentId}`, {
      content,
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteCommentById = async (commentId) => {
  try {
    const response = await $authHost.delete(`/api/comments/${commentId}`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Alias for backward compatibility
export const deleteComment = deleteCommentById;

export const getAllComments = async () => {
  try {
    const response = await $authHost.get('/api/comments');
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createRepost = async (postId) => {
  try {
    const response = await $authHost.post(`/api/posts/${postId}/repost`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const deleteRepost = async (postId) => {
  try {
    const response = await $authHost.delete(`/api/posts/${postId}/repost`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getRepostStatus = async (postId) => {
  try {
    const response = await $authHost.get(`/api/posts/${postId}/repost/status`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getUserReposts = async (userId) => {
  try {
    const response = await $authHost.get(`/api/posts/user/${userId}/reposts`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getRepliesForComment = async (commentId) => {
  try {
    const response = await $authHost.get(`/api/comments/${commentId}/replies`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
