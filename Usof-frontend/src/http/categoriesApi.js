import { $authHost } from '.';

export const getAllCategories = async () => {
  try {
    const response = await $authHost.get('/api/categories');
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
