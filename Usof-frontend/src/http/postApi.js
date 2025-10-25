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
