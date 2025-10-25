import { $authHost } from '.';

export const getAllCategories = async () => {
  try {
    const response = await $authHost.get('/api/categories');
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const response = await $authHost.get(`/api/categories/${categoryId}`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getPostsForCategory = async (categoryId, page = 1, limit = 20) => {
  try {
    const response = await $authHost.get(
      `/api/categories/${categoryId}/posts?page=${page}&limit=${limit}`
    );
    // controller returns { page, limit, count, posts }
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
